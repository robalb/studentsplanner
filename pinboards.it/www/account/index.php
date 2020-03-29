<?php
require_once '../core/classes/BundlesManager.php';
require_once '../core/classes/SessionManager.php';
require_once '../core/classes/SecurityHeaders.php';
require_once '../core/classes/GetApplicationData.php';
require_once '../core/classes/CSRFmanager.php';
require_once '../core/classes/LanguageManager.php';

$bundlesManager = new BundlesManager('account', '../bundles/');
$nonce = SecurityHeaders::getNonce();
$languageManager = new LanguageManager();
$session = new SessionManager();
$isLogged = $session->isValid();

//array that will be json encoded and injected into the page as a js global varaible
$JSdata = [ "logged" => $isLogged];

if($isLogged){
  //get user data
  $getAppData = new GetApplicationData($_SESSION);
  $data = $getAppData->getData(["account", "inviteCode"]);
  $JSdata += ["data" => $data];
  //get locale from session variable
  $locale = $_SESSION['locale'];
}else{
  //get locale from useragent
  $locale = $languageManager->getNegotiatedUserLocale();
}


//injection of the global js variables, using bundlesManager
//csrf token related variables
$JScsrfToken = CSRFmanager::getToken();
//language related variables
$JSlanguageJson = $languageManager->getUserLanguageJson($locale);
//app data variables
$JSencodedData = json_encode($JSdata);
$jsGlobalVariables = <<<ES6
;var PHP_CSRF = '$JScsrfToken';
var LANGUAGE = $JSlanguageJson;
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
    <title>account</title>
    <?php $bundlesManager->headOutput();?>
  </head>
  <body>
   <div id="root"></div> 
    <?php $bundlesManager->bodyOutput();?>
  </body>
</html>

