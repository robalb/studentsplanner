<?php
require_once '../core/classes/SessionManager.php';
require_once '../core/classes/SecurityHeaders.php';
require_once '../core/classes/ConnectDb.php';
require_once '../core/classes/GetApplicationData.php';


$session = new SessionManager();
$body = file_get_contents('php://input');

//validates received data, and returns an error if something is not right
$error = 0;
$error += (strlen($body) > 250) || (strlen($body) < 5);
try{
  $request = json_decode($body, true, 3);
} catch(Exception $e){
  $request = [];
  $error++;
}
//check mail existance and max length
$error += !(isset($request['mail']) && strlen($request['mail']) < 150 );
//check password existence and max length
$error += !(isset($request['password']) && strlen($request['password']) < 66 );
//check that getData is a populated array if its set
$error += (isset($request['getData']) && !( is_array($request['getData']) && count($request['getData']) > 0 ) );
if($error !== 0){
  http_response_code(400);
  echo json_encode(['error'=>'malformed_request']);
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
  $stmt = $pdo->prepare('SELECT s.classID, s.password, s.fullName, s.uniqueName, s.admin, s.locale, c.name FROM students s, class c WHERE s.mail = ? AND s.classID = c.ID');
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


  //create sesion
  $isAdmin = (bool) $row["admin"];
  $_SESSION = array_merge($_SESSION, [
    'classID' => $row['classID'],
    'className' => $row['name'],
    'mail' => $mail,
    'fullName' => $row['fullName'],
    'uniqueName' => $row['uniqueName'],
    'locale' => $row['locale'],
    'isAdmin' => $isAdmin
  ]);
  $session->setValid();
}

//create response array, that will be turned into json and echoed
$response = [
  "success" => true
];

//get required data
if(isset($request['getData'])){
  $getAppData = new GetApplicationData($_SESSION);
  $data = $getAppData->getData($request['getData']);
  //what in the world is this? - oh, just the php equivalent of $response["data"] = $data;
  $response += ["data" => $data];
}

echo json_encode($response);

/* debug */
/* echo var_dump($body); */
/* echo var_dump($request); */
