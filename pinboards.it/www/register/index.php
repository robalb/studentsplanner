<?php
require_once '../core/classes/BundlesManager.php';
require_once '../core/classes/SessionManager.php';
require_once '../core/classes/SecurityHeaders.php';
require_once '../core/classes/ConnectDb.php';
require_once '../core/classes/LanguageManager.php';


$bundlesManager = new BundlesManager('register', '../bundles/');
$nonce = SecurityHeaders::getNonce();
$session = new SessionManager();
$isLogged = $session->isValid();

if($isLogged){
  //redirect to home section
  header('location: ../');
  die();
}

//initialize languagemanager, and get user locale
$languageManager = new LanguageManager();
$locale = $languageManager->getNegotiatedUserLocale();

//initialize variables that will be injected into the page as a js global varaible
$JSdata = ["invited" => false];
//initialize global variables that will be used by the registration api endpoint
$_SESSION['registration_currentStep'] = 0;
$_SESSION['registration_fromInvite'] = false;

//check if there is a valid code being passed as get parameter
if(isset($_GET['invite']) &&
  is_string($_GET['invite']) &&
  strlen($_GET['invite']) === 16 ){
  //retrieve invite informations from db
  $instance = ConnectDb::getInstance();
  $pdo = $instance->getConnection();
  $stmt = $pdo->prepare('SELECT i.code, i.classID, i.invitedBy, i.creationDate, i.lifespan, c.name FROM invite_codes i, class c WHERE i.code = ? and i.classID = c.ID');
  $stmt->execute([$_GET['invite']]);
  //check if the invite code exists
  if($stmt->rowCount() > 0){
    $row = $stmt->fetch();
    //check if the invite has not expired
    if(time() - $row['creationDate'] < $row['lifespan']){
      //the invite is good.
      //assign session variables that will be required in the register api endpoint
      $_SESSION['registration_fromInvite'] = true;
      $_SESSION['registration_classID'] = $row['classID'];
      //prepare data that will be passed to js
      $JSdata = [
        "invited" => true,
        "error" => false,
        "inviteData" => [
          "invitedBy" => $row['invitedBy'],
          "className" => $row['name']
        ]
      ];
    }else{
      //the invite code has expired.
      //remove it from the database
      $stmt = $pdo->prepare('DELETE FROM invite_codes where code = ?');
      $stmt->execute([$_GET['invite']]);
      //handle data that will be passed to js
      $JSdata = [
        "invited" => true,
        "error" => "expired_code"
      ];
    }
  }else{
    //the invite code does not exist.
    //handle data that will be passed to js
    $JSdata = [
      "invited" => true,
      "error" => "invalid_code"
    ];
  }
}else{
  //invalid code
  if(isset($_GET['invite'])){
    $JSdata = [
      "invited" => true,
      "error" => "invalid_code_get"
    ];
  }
}

//injection of the global js variables, using bundlesManager
$JSencodedData = json_encode($JSdata);
$JSlanguageJson = $languageManager->getUserLanguageJson($locale);
$jsGlobalVariables = <<<ES6
;var LANGUAGE = $JSlanguageJson;
var PHP_GLOBALS = $JSencodedData;
ES6;
$bundlesManager->addScript($jsGlobalVariables, $nonce);
?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link href="https://fonts.googleapis.com/css?family=Roboto:300,400|Material+Icons" rel="stylesheet">
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>register</title>
    <?php $bundlesManager->headOutput();?>
  </head>
  <body>
   <div id="root"></div> 
    <?php $bundlesManager->bodyOutput();?>
  </body>
</html>
