<?php
require_once './core/classes/BundlesManager.php';
require_once './core/classes/SessionManager.php';
require_once './core/classes/SecurityHeaders.php';
require_once './core/classes/ConnectDb.php';
require_once './core/classes/LanguageManager.php';

$bundlesManager = new BundlesManager('index', './bundles/');
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
    <title><?php $t('register');?></title>
    <link rel="canonical" href="https://www.pinboards.it/" />

    <?php include './core/pages/headers.php';?>

    <meta name="keywords" content="<?php $t('keywords');?>" />
    <meta name="og:title" property="og:title" content="<?php $t('og title');?>" />
    <meta name="og:description" property="og:description" content="<?php $t('og description');?>" />
    <meta name="og:site_name" property="og:site_name" content="Pinboards" />
    <meta name="og:type" property="og:type" content="website" />
    <meta name="og:locale" property="og:locale" content="<?php $t('og locale');?>" />
    <!-- insert a tag of this type for every language supported -->
    <meta name="og:locale:alternate" property="og:locale:alternate" content="it_IT" />
    <meta name="og:locale:alternate" property="og:locale:alternate" content="en_US" />
    <!--<meta name="og:image" property="og:image" content="http://path-to-png" />
    <meta name="og:image:alt" property="og:image:alt" content="logo" />
    <meta name="og:image:type" property="og:image:type" content="image/png" />
    <meta name="og:image:width" property="og:image:width" content="400" />
    <meta name="og:image:height" property="og:image:height" content="300" />-->
    <meta property="al:ios:app_name" content="Pinboards" />
    <meta property="al:ios:app_store_id" content="" />
    <meta property="al:ios:url" content="" />
    <meta property="al:android:app_name" content="Pinboards" />
    <meta property="al:android:package" content="" />
    <meta property="al:android:url" content="" />

    <?php $bundlesManager->headOutput();?>
  </head>
  <body>
   <div id="root"></div> 
    <?php $bundlesManager->bodyOutput();?>
  </body>
</html>
