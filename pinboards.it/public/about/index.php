<?php
require_once '../core/classes/BundlesManager.php';
$bundlesManager = new BundlesManager('about', '../bundles/');
?>
<!doctype html>
<html>
  <head>
    <title>about</title>
  </head>
  <body>
    <h1>
      about
    </h1>
    <?php echo "PHP IS WORKING"; ?>
    <p>
      css is probably working
    </p>
    <a href="../">index</a>
    <a href="/hello">hello</a>
    <?php $bundlesManager->bodyOutput();?>
  </body>
</html>
