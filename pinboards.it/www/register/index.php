<?php
require_once '../core/classes/BundlesManager.php';
require_once '../core/classes/SessionManager.php';
require_once '../core/classes/SecurityHeaders.php';

$bundlesManager = new BundlesManager('register', '../bundles/');
$nonce = SecurityHeaders::getNonce();
$session = new SessionManager();
$isLogged = $session->isValid();

if($isLogged){
  //redirect to home section
  header('location: ../');
  die();
}

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


