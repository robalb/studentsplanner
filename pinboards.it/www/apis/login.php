<?php


require_once '../core/classes/SessionManager.php';
require_once '../core/classes/SecurityHeaders.php';
require_once '../core/classes/ConnectDb.php';

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
$instance = ConnectDb::getInstance();
$pdo = $instance->getConnection();
if(!$session->isValid()){
  $stmt = $pdo->prepare('SELECT s.classID, s.password, s.fullName, s.uniqueName, c.name FROM students s, class c WHERE s.mail = ? AND s.classID = c.ID');
  $stmt->execute([$mail]);
  $match = false;
  if($stmt->rowCount() > 0){
    $row = $stmt->fetch();
    //check password
    $match = password_verify($password, $row['password']);
  }
  //handle wrong username or password
  if(!$match){
    http_response_code(401);
    echo json_encode(['error'=>'wrong_mail_or_password']);
    die;
  }

  //create sesion
  $_SESSION = array_merge($_SESSION, [
    //TODO
    'classID' => $row['classID'],
    'className' => $row['name'],
    'mail' => $mail,
    'fullName' => $row['fullName'],
    'uniqueName' => $row['uniqueName']
  ]);
  $session->setValid();

  
}


//add here additional requested data
echo json_encode(['success'=>true]);

/* debug */
/* echo var_dump($body); */
/* echo var_dump($request); */
