<?php
require_once '../core/classes/BundlesManager.php';
require_once '../core/classes/SessionManager.php';
require_once '../core/classes/SecurityHeaders.php';
require_once '../core/classes/LanguageManager.php';

require_once '../core/classes/RegistrationScreens/PageScreens.php';


$bundlesManager = new BundlesManager('register', '../bundles/');
$nonce = SecurityHeaders::getNonce();
$session = new SessionManager();
$isLogged = $session->isValid();

if($isLogged){
  //redirect to home section
  header('location: ../account/');
  die();
}

//initialize languagemanager, and get user locale
$languageManager = new LanguageManager();
$locale = $languageManager->getNegotiatedUserLocale();

//initialize screen manager, check the current screen
$pageScreens = new PageScreens();
$currentScreen = $pageScreens->getCurrentScreen();

//if there are no current screens, set one
if(!$currentScreen){
  $pageScreens->setScreen('userForm', []);
}else{
  //refresh the current screen
  $pageScreens->refreshCurrentScreen();
}

/* var_dump($_SESSION); */

//injection of the global js variables, using bundlesManager
//registration screen related variables
$JSdata = $pageScreens->getFrontData();
$JSencodedData = json_encode($JSdata);
//language related variables
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
