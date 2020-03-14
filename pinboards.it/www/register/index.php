<?php
require_once '../core/classes/BundlesManager.php';
require_once '../core/classes/SessionManager.php';
require_once '../core/classes/SecurityHeaders.php';
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

//get user locale, and language file
$languageManager = new LanguageManager("false");
$locale = $languageManager->getNegotiatedUserLocale();
$languageManager->updateLocale($locale);


//variables that will be injected into the page as a js global varaible
//json containing all the webpage strings
$JSlanguageJson = $languageManager->getUserLanguageJson();
//an array containing other variables, that will be json encoded
$JSdata = ["invited" => false];


//TODO: check if there is a valid invide code in the get parameter
//retrieve invite informations, delete the invite from the database if it's expired,
//and if it's valid, save in a session varaiable the classID
$invitedBy = "giorgio vasari";
$className = "testClassName";
$JSdata = [
  "invited" => true,
  "inviteData" => [
    "invitedBy" => $invitedBy,
    "className" => $className
  ]
];

//injection of the global js variables, using bundlesManager
$JSencodedData = json_encode($JSdata);
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
