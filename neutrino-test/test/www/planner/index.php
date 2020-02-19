<?php
require_once '../core/classes/BundlesManager.php';
$bundlesManager = new BundlesManager('planner', '../bundles/');
?>
<!doctype html>
<html>
  <head>
    <title>planner</title>
  </head>
  <body>
   <div id="root"></div> 
    <?php $bundlesManager->bodyOutput();?>
  </body>
</html>
