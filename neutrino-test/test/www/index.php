<?php
require_once './core/classes/BundlesManager.php';
$bundlesManager = new BundlesManager('index', './bundles/');
?>
<!doctype html>
<html>
  <head>
    <title>index</title>
    <?php $bundlesManager->headOutput();?>
  </head>
  <body>
   <div id="root"></div> 
    <?php $bundlesManager->bodyOutput();?>
  </body>
</html>
