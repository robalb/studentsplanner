<?php
require_once '../core/classes/SessionManager.php';
require_once '../core/classes/SecurityHeaders.php';
require_once '../core/classes/ConnectDb.php';
require_once '../core/classes/CSRFmanager.php';
require_once '../core/classes/GetApplicationData.php';
require_once '../core/classes/DataCache.php';

$session = new SessionManager();
$body = file_get_contents('php://input');

if(!$session->isValid()){
  http_response_code(401);
  echo json_encode(['error'=>'session_error_refresh']);
  die();
}


//validates received data, and returns an error if something is not right
$error = 0;
$error += (strlen($body) > 9000) || (strlen($body) < 5);
try{
  if($error === 0){
    $request = json_decode($body, true, 8);
  }
} catch(Exception $e){
  $request = [];
  $error++;
}

//check action field
$error += !(isset($request['action']) && strlen($request['action']) < 60 );
//check that data is a populated array if its set
$error += (isset($request['data']) && !( is_array($request['data']) && count($request['data']) > 0 ));
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

//reload the user data
DataCache::reloadUserData($_SESSION['mail']);

//push case
if($request['action'] == "push"){
  //invalid permissions case
  if(!$_SESSION['isAdmin']){
  echo json_encode(['error'=>'invalid_permissions']);
  die();
  }
  //validate data
  //TODO: diff calculation

  //prepare update data
  $timestamp = time();
  $stateHash = bin2hex(random_bytes(8));
  $plannerData = json_encode($request['data']);
  //update db table
  $instance = ConnectDb::getInstance();
  $pdo = $instance->getConnection();

  $stmt = $pdo->prepare('UPDATE planner_states SET timestamp = ?, authorUniqueName = ?, stateHash = ?, plannerData = ? WHERE classID = ?');
  $stmt->execute([
    $timestamp,
    $_SESSION['uniqueName'],
    $stateHash,
    $plannerData,
    $_SESSION['classID']
  ]);
  echo json_encode(['success' => true]);
}



