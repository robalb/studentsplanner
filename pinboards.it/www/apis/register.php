<?php
require_once '../core/classes/SessionManager.php';
require_once '../core/classes/SecurityHeaders.php';
require_once '../core/classes/CSRFmanager.php';
require_once '../core/classes/RegistrationScreens/ApiScreens.php';

//initialize screen manager, get the current screen
$apiScreens = new ApiScreens();
$currentScreen = $apiScreens->getCurrentScreen();

//initialize session manager
$session = new SessionManager();

//if the user didn't have a session, return a refresh page error.
//these apis can be called only if the user has a session (specifically, register and login
//require a session, all the other pages require a valid (logged) session)
if($session->isNew()){
  http_response_code(401);
  echo json_encode(['error'=>'session_error_refresh']);
  die();
}

//check that the user passed valid data
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

//validate csrf token
if(!isset($request['CSRF']) || !CSRFmanager::validate($request['CSRF'])){
  http_response_code(400);
  echo json_encode(['error'=>'csrf_error']);
  die();
}

//refresh the current screen, passing the user data as parameter
$apiScreens->refreshCurrentScreen($request);

//return the current screen data
$JSdata = $apiScreens->getFrontData();
echo(json_encode($JSdata));

