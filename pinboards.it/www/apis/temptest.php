<?php
require_once '../core/classes/ConnectDb.php';
  $instance = ConnectDb::getInstance();
  $pdo = $instance->getConnection();

  //generate random invite code string
  // base_convert ( string $number , int $frombase , int $tobase ) : string
  $bytesLength = 12;
  $default = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  $custom = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$$";
  $randomBytes = random_bytes($bytesLength);
  $randomString = base64_encode($randomBytes);
  $code = strtr($randomString, $default, $custom);
  var_dump($code);
  $stmt = $pdo->prepare('INSERT INTO invite_codes VALUES (?, ?, ?, ?, ?)');
  $stmt->execute([
    $code, //code
    1,//classID
    'giorgio vasari',//invitedBy
    time(),//creationDate
    (60*60*24) //lifespan
  ]);



/* $options = [ */
/*       'cost' => 13, */
/*     ]; */
/* echo password_hash(hash("sha256", "password"), PASSWORD_BCRYPT, $options); */

