<?php
require_once '../core/classes/BundlesManager.php';
require_once '../core/classes/SessionManager.php';
require_once '../core/classes/SecurityHeaders.php';
require_once '../core/classes/ConnectDb.php';
require_once '../core/classes/GetApplicationData.php';

$bundlesManager = new BundlesManager('planner', '../bundles/');
$nonce = SecurityHeaders::getNonce();
$session = new SessionManager();
$isLogged = $session->isValid();

//array that will be json encoded and injected into the page as a js global varaible
$JSdata = [ "logged" => $isLogged];

if($isLogged){
  //get user data
  //get planner data
  $getAppData = new GetApplicationData($_SESSION);
  $data = $getAppData->getData(["account", "planner"]);
  $JSdata += ["data" => $data];
}

//injection of the global js variables, using bundlesManager
$JSencodedData = json_encode($JSdata);
$jsGlobalVariables = <<<ES6
;var PHP_GLOBALS = $JSencodedData;
ES6;
$bundlesManager->addScript($jsGlobalVariables, $nonce);
?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link href="https://fonts.googleapis.com/css?family=Roboto:300,400|Material+Icons" rel="stylesheet">
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>planner</title>
    <?php $bundlesManager->headOutput();?>
  </head>
  <body>
   <div id="root"></div> 
    <?php $bundlesManager->bodyOutput();?>
  </body>
</html>
