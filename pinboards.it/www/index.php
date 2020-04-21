<?php
require_once './core/classes/BundlesManager.php';
require_once './core/classes/SessionManager.php';
require_once './core/classes/SecurityHeaders.php';
require_once './core/classes/ConnectDb.php';
require_once './core/classes/LanguageManager.php';

$bundlesManager = new BundlesManager('index', './bundles/');
$nonce = SecurityHeaders::getNonce();
$session = new SessionManager();
$isLogged = $session->isValid();

if($isLogged){
  header("Location: ./account/");
}

//initialize the languagemanager
$languageManager = new LanguageManager();
$locale = $languageManager->getNegotiatedUserLocale();
$t = $languageManager->getT();

?>
<!DOCTYPE html>
<html lang="<?php echo $locale;?>">
  <head>
    <meta name="language" content="<?php echo $locale;?>">
    <?php include './core/pages/headers.php';?>
    <title><?php $t('index');?></title>
    <?php $bundlesManager->headOutput();?>
  </head>
  <body>
   <h1>Pinboards</h1><br/>
   <p>homepage</p>
   <p><a href="./account">accedi</a><br/> </p>
   <p> <a href="./register"> registrati </a></p>
   <p>this is project is open source at <a href="https://github.com/robalb/studentsplanner/">github</a> </p>
   <div id="root"></div> 
    <?php $bundlesManager->bodyOutput();?>
  </body>
</html>
