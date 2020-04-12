<?php
require_once '../core/classes/SessionManager.php';
require_once '../core/classes/SecurityHeaders.php';
require_once '../core/classes/ConnectDb.php';
require_once '../core/classes/CSRFmanager.php';
require_once '../core/classes/GetApplicationData.php';
require_once '../core/classes/RegistrationScreens/unset.php';


$session = new SessionManager();
$body = file_get_contents('php://input');

//return error if the user is logged, or it doesn't have a session
$isLogged = $session->isValid();
$isNew = $session->isNew();
if($isNew || $isLogged){
  //redirect to home section
  http_response_code(400);
  echo json_encode(['error'=>'session_error_refresh']);
  die();
}

//validates received data, and returns an error if something is not right
$error = 0;
$error += (strlen($body) > 400) || (strlen($body) < 5);
try{
  $request = json_decode($body, true, 3);
} catch(Exception $e){
  $request = [];
  $error++;
}
//check mail existance and max length
$error += !(isset($request['mail']) && strlen($request['mail']) < 150 );
//check remember me existance and max length
$error += !(isset($request['remember']) && strlen($request['remember']) < 10 );
//check password existence and max length
$error += !(isset($request['password']) && strlen($request['password']) < 200 );
//check that getData is a populated array if its set
$error += (isset($request['getData']) && !( is_array($request['getData']) && count($request['getData']) > 0 ) );
if($error !== 0){
  http_response_code(400);
  echo json_encode(['error'=>'malformed_request']);
  die();
}
//validate csrf token
if(!isset($request['CSRF']) || !CSRFmanager::validate($request['CSRF'])){
  http_response_code(400);
  echo json_encode(['error'=>'csrf_error']);
  die();
}

//attempt login if not logged
$mail = filter_var($request['mail'], FILTER_SANITIZE_EMAIL);
$password = $request['password'];
//handle the case where the client couldn't send a hashed password
if(isset($request["isHash"]) && $request["isHash"] == false){
  $password = hash("sha256", $password);
}
$instance = ConnectDb::getInstance();
$pdo = $instance->getConnection();
if(!$session->isValid()){
  $stmt = $pdo->prepare('SELECT classID, password, fullName, uniqueName, admin, locale FROM students WHERE mail = ?');
  $stmt->execute([$mail]);
  $match = false;
  //if the user is found
  if($stmt->rowCount() > 0){
    $row = $stmt->fetch();
    $match = password_verify($password, $row['password']);
  }else{
    //useless call to password verify, to prevent clients enumeration via timing attacks
    $randomPassword = (string) rand(1000000, 99999999);
    $config = require dirname(__FILE__).'/../core/config/config.php';
    $cost = $config['bcryptCost'];
    $randomBcrypt = '$2y$'.$cost.'$xLUuCq2oZDNpRtjQLNBeYO3Ey04Bm3/48ctufqU2NUgnC29uPa3eq';
    password_verify($randomPassword, $randomBcrypt);
  }
  //handle wrong username or password
  if(!$match){
    http_response_code(401);
    echo json_encode(['error'=>'wrong_mail_or_password']);
    die;
  }

  unsetRegistrationScreens();

  $hasClassroom = $row['classID'] != 0;

  //if the user is in a class, get the class name
  $className = "";
  if($hasClassroom){
    $stmt = $pdo->prepare('SELECT name FROM class WHERE ID = ?');
    $stmt->execute([ $row['classID'] ]);
    if($stmt->rowCount() > 0){
      $nameRow = $stmt->fetch(PDO::FETCH_ASSOC);
      if(isset($nameRow['name'])){
        $className = $nameRow['name'];
      }
    }
  }

  //create sesion
  $_SESSION = array_merge($_SESSION, [
    'classID' => $row['classID'],
    'className' => $className,
    'mail' => $mail,
    'fullName' => $row['fullName'],
    'uniqueName' => $row['uniqueName'],
    'locale' => $row['locale'],
    'isAdmin' => $row["admin"]
  ]);
  $session->setValid();
  //if the user wants to remember the session
  if($request['remember'] === true){
    $session->setPermanent($mail);
  }
}

//create response array, that will be turned into json and echoed
$response = [
  "success" => true
];

//if this variable is set, it means that the user tried to use an invite code, then clicked login.
//Respond with the invite code, this will cause the frontend code to redirect to the invite page
if(isset($_SESSION['user_invitecode']) && $_SESSION['user_invitecode']){
  //NOTE: $_SESSION['user_invitecode'] is a safe value, already checked and sanitized
  $response['inviteCode'] = $_SESSION['user_invitecode'];
}else{
  //the user is not going to be redirected to the invite page, so fetch the current page data if required
  if(isset($request['getData'])){
    $getAppData = new GetApplicationData($_SESSION);
    $data = $getAppData->getData($request['getData']);
    //what in the world is this? - oh, just the php equivalent of $response["data"] = $data;
    $response += ["data" => $data];
  }
}

echo json_encode($response);

/* debug */
/* echo var_dump($body); */
/* echo var_dump($request); */
