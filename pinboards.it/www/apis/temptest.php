<?php
/* phpinfo(); */
    $bytes = random_bytes(33);
    $uid = str_replace(['+','/','='], ['-','_',''], base64_encode($bytes));
    echo strlen(hash('sha256', $uid));
/* $bytes = random_bytes(33); */
/* $encoded = str_replace(['+','/','='], ['-','_','$'], base64_encode($bytes)); */
/* echo $encoded; */

/* require_once '../core/classes/Procedures.php'; */
  /* $result = Procedures::createInviteCode( */
  /*   1,//classID */
  /*   'giorgio vasari',//invitedBy */
  /*   (0) //lifespan */
  /* ); */
  /* var_dump($result); */
  /* $result = Procedures::negotiateName(1, 'qwe@qw.qw'); */
  /* var_dump($result); */

/* $options = [ */
/*       'cost' => 13, */
/*     ]; */
/* echo password_hash(hash("sha256", "password"), PASSWORD_BCRYPT, $options); */

