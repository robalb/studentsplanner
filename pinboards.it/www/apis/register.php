<?php
require_once '../core/classes/SessionManager.php';
require_once '../core/classes/SecurityHeaders.php';
require_once '../core/classes/RegistrationScreens/ApiScreens.php';



//initialize screen manager, get the current screen
$apiScreens = new ApiScreens();
$currentScreen = $apiScreens->getCurrentScreen();

//initialize session manager
$session = new SessionManager();
$isLogged = $session->isValid();

if($isLogged){
  //set a screen that in the frontend will redirect to the home section
  $apiScreens->setScreen('ok', []);
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

//check that the user screen is correct
/* if($request['screen'] && $request['screen'] !== $currentScreen){ */
/*   echo json_encode(['screen'=> $currentScreen]); */
/*   die(); */
/* } */

//refresh the current screen, passing the user data as parameter
$apiScreens->refreshCurrentScreen($request);

//return the current screen data
$JSdata = $apiScreens->getFrontData();
echo(json_encode($JSdata));




//check step parameter, and session variables, and perform relevant checks

//handle first step
/* if($_SESSION['registration_currentStep'] === 0){ */
/*   $error = 0; */
/*   //check mail existance and max length */
/*   $error += !(isset($request['mail']) && strlen($request['mail']) < 150 ); */
/*   //check password existence and length */
/*   $error += !(isset($request['password']) && strlen($request['password']) < 200 ); */
/*   //check fullName existence and length */
/*   $error += !(isset($request['fullName']) && strlen($request['fullName']) > 3 && strlen($request['fullName']) < 100 ); */
/*   //chek mail validity and create filtered mail variable */
/*   $mail = filter_var($request['mail'], FILTER_SANITIZE_EMAIL); */
/*   $error += !$mail; */
/*   if($error !== 0){ */
/*     http_response_code(400); */
/*     echo json_encode(['error'=>'malformed_request']); */
/*     die(); */
/*   } */
/*   //check if the mail is available. */
/*   $instance = ConnectDb::getInstance(); */
/*   $pdo = $instance->getConnection(); */
/*   $stmt = $pdo->prepare('SELECT fullName FROM students WHERE mail = ?'); */
/*   $stmt->execute([$mail]); */
/*   //if the mail is not available, return an error */
/*   if($stmt->rowCount() > 0){ */
/*     http_response_code(400); */
/*     echo json_encode(['error'=>'mail_already_exists']); */
/*     die(); */
/*   }else{ */
/*     //the mail is available, return an ok, and put all the form data that will be needed in the next */
/*     //step in a session variable */
/*     $password = $request['password']; */
/*     //handle the case where the client couldn't send a hashed password */
/*     if(isset($request["isHash"]) && $request["isHash"] == false){ */
/*       $password = hash("sha256", $password); */
/*     } */
/*     $_SESSION['registration_formData'] = [ */
/*       'fullName' => $request['fullName'], */
/*       'hash' => $hash, */
/*       'mail' => $mail */
/*     ]; */
/*     $_SESSION['registration_currentStep'] = 1; */
/*     echo json_encode(['success'=>true]); */
/*     die(); */
/*   } */
/* } */

/* else if($_SESSION['registration_currentStep'] === 1){ */
/*   //handle second step */
/*   /1* $_SESSION['registration_fromInvite'] = true; *1/ */
/*   /1* $_SESSION['registration_classID'] = $row['classID']; *1/ */
/* } */
/* /1* //check mail existance and max length *1/ */
/* /1* $error += !(isset($request['mail']) && strlen($request['mail']) < 150 ); *1/ */
/* /1* //check password existence and max length *1/ */
/* /1* $error += !(isset($request['password']) && strlen($request['password']) < 200 ); *1/ */
/* /1* //check that getData is a populated array if its set *1/ */
/* /1* $error += (isset($request['getData']) && !( is_array($request['getData']) && count($request['getData']) > 0 ) ); *1/ */
/* if($error !== 0){ */
/*   http_response_code(400); */
/*   echo json_encode(['error'=>'malformed_request']); */
/*   die(); */
/* } */
