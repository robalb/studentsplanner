<?php
require_once './core/classes/BundlesManager.php';
$bundlesManager = new BundlesManager('planner', './bundles/');
?>
<!doctype html>
<html>
  <head>
    <title>planner</title>
  </head>
  <body>
    <?php $bundlesManager->bodyOutput();?>
  </body>
</html>
