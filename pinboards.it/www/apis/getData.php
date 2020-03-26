<?php
require_once '../core/classes/SessionManager.php';
require_once '../core/classes/SecurityHeaders.php';
require_once '../core/classes/CSRFmanager.php';
require_once '../core/classes/GetApplicationData.php';

$session = new SessionManager();
$body = file_get_contents('php://input');

if(!$session->isValid()){
  http_response_code(401);
  echo json_encode(['error'=>'invalid session']);
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
  echo json_encode(['error'=>'csrf_error']);
  die();
}

$response = [ 'error' => 'malformed_request' ];

$getAppData = new GetApplicationData($_SESSION);
$data = $getAppData->getData($request['getData']);
$response = ["data" => $data];

echo json_encode($response);
