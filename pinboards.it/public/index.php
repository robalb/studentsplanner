<?php
require_once './core/classes/BundlesManager.php';
$bundlesManager = new BundlesManager('index', './bundles/');
?>
<!doctype html>
<html>
  <head>
    <title>Getting Started</title>
  </head>
  <body>
    <?php echo "PHP IS WORKING"; ?>
    <p>
      css is probably working
    </p>
    <a href="./about">about</a>
    <a href="./hello">hello</a>
    <?php $bundlesManager->bodyOutput();?>
  </body>
</html>
