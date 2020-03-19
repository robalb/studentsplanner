<?php
require_once '../core/classes/SessionManager.php';
require_once '../core/classes/SecurityHeaders.php';
require_once '../core/classes/ConnectDb.php';
require_once '../core/classes/GetApplicationData.php';


$session = new SessionManager();

//check that the user is allowed to call this api
if(!isset($_SESSION['registration_currentStep']) || $session->isValid()){
  http_response_code(500);
  echo json_encode(['error'=>'session_error_refresh']);
  die();
}

$body = file_get_contents('php://input');
//validates received data, and returns an error if something is not right
$error = 0;
$error += (strlen($body) > 400) || (strlen($body) < 5);
try{
  $request = json_decode($body, true, 3);
} catch(Exception $e){
  $request = [];
  $error++;
}
if($error !== 0){
  http_response_code(400);
  echo json_encode(['error'=>'malformed_request']);
  die();
}


//check step parameter, and session variables, and perform relevant checks

//handle first step
if($_SESSION['registration_currentStep'] === 0){
  $error = 0;
  //check mail existance and max length
  $error += !(isset($request['mail']) && strlen($request['mail']) < 150 );
  //check password existence and length
  $error += !(isset($request['password']) && strlen($request['password']) < 200 );
  //check fullName existence and length
  $error += !(isset($request['fullName']) && strlen($request['fullName']) > 3 && strlen($request['fullName']) < 100 );
  //chek mail validity and create filtered mail variable
  $mail = filter_var($request['mail'], FILTER_SANITIZE_EMAIL);
  $error += !$mail;
  if($error !== 0){
    http_response_code(400);
    echo json_encode(['error'=>'malformed_request']);
    die();
  }
  //check if the mail is available.
  $instance = ConnectDb::getInstance();
  $pdo = $instance->getConnection();
  $stmt = $pdo->prepare('SELECT fullName FROM students WHERE mail = ?');
  $stmt->execute([$mail]);
  //if the mail is not available, return an error
  if($stmt->rowCount() > 0){
    http_response_code(400);
    echo json_encode(['error'=>'mail_already_exists']);
    die();
  }else{
    //the mail is available, return an ok, and put all the form data that will be needed in the next
    //step in a session variable
    $password = $request['password'];
    //handle the case where the client couldn't send a hashed password
    if(isset($request["isHash"]) && $request["isHash"] == false){
      $password = hash("sha256", $password);
    }
    $_SESSION['registration_formData'] = [
      'fullName' => $request['fullName'],
      'hash' => $hash,
      'mail' => $mail
    ];
    $_SESSION['registration_currentStep'] = 1;
    echo json_encode(['success'=>true]);
    die();
  }
}

else if($_SESSION['registration_currentStep'] === 1){
  //handle second step
  /* $_SESSION['registration_fromInvite'] = true; */
  /* $_SESSION['registration_classID'] = $row['classID']; */
}
/* //check mail existance and max length */
/* $error += !(isset($request['mail']) && strlen($request['mail']) < 150 ); */
/* //check password existence and max length */
/* $error += !(isset($request['password']) && strlen($request['password']) < 200 ); */
/* //check that getData is a populated array if its set */
/* $error += (isset($request['getData']) && !( is_array($request['getData']) && count($request['getData']) > 0 ) ); */
if($error !== 0){
  http_response_code(400);
  echo json_encode(['error'=>'malformed_request']);
  die();
}
