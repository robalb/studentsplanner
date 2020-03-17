<?php
require_once '../core/classes/SessionManager.php';
require_once '../core/classes/SecurityHeaders.php';
require_once '../core/classes/ConnectDb.php';
require_once '../core/classes/GetApplicationData.php';


$session = new SessionManager();

//check that session variables related to the registration already exist
if(!isset($_SESSION['registration_currentStep']){
  http_response_code(500);
  echo json_encode(['error'=>'session_error_refresh']);
  die();
}
/* $_SESSION['registration_fromInvite'] = true; */
/* $_SESSION['registration_classID'] = $row['classID']; */

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

//TODO: check step parameter, and session variables, and perform relevant checks

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
