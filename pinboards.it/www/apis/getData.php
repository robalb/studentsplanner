<?php
require_once '../core/classes/SessionManager.php';
require_once '../core/classes/SecurityHeaders.php';
require_once '../core/classes/CSRFmanager.php';
require_once '../core/classes/GetApplicationData.php';
require_once '../core/classes/DataCache.php';

$session = new SessionManager();
$body = file_get_contents('php://input');

//validate session
if(!$session->isValid()){
  http_response_code(401);
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
//check that getData is set and is a populated array
$error += !(
  isset($request['getData']) &&
  ( is_array($request['getData']) &&
    count($request['getData']) > 0 &&
    count($request['getData']) < 10)
);

if($error !== 0){
  http_response_code(400);
  echo json_encode(['error'=>'malformed_request']);
  die();
}

//validate csrf token
if(!isset($request['CSRF']) || !CSRFmanager::validate($request['CSRF'])){
  http_response_code(400);
  echo json_encode(['error'=>'csrf_error_refresh']);
  die();
}

//refresh the session varaibles holding the user data
DataCache::reloadUserData($_SESSION['mail']);

//initialize getAppdata, and request the user data
$getAppData = new GetApplicationData($_SESSION);
$data = $getAppData->getData($request['getData']);
//prepare the default response
$response = [ 'error' => 'malformed_request' ];
//if the requested data is valid, change the default response
if($data){
  $response = ["data" => $data];
}

echo json_encode($response);
