<?php
require_once '../core/classes/BundlesManager.php';
$bundlesManager = new BundlesManager('planner', '../bundles/');
?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link href="https://fonts.googleapis.com/css?family=Roboto:300,400|Material+Icons" rel="stylesheet">
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>planner</title>
  </head>
  <body>
   <div id="root"></div> 
    <?php $bundlesManager->bodyOutput();?>
  </body>
</html>