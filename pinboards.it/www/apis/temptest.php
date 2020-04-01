<?php
require_once '../core/classes/Procedures.php';

  /* $result = Procedures::createInviteCode( */
  /*   1,//classID */
  /*   'giorgio vasari',//invitedBy */
  /*   (0) //lifespan */
  /* ); */
  /* var_dump($result); */
  $result = Procedures::negotiateName(1, 'qwe@qw.qw');
  var_dump($result);

/* $options = [ */
/*       'cost' => 13, */
/*     ]; */
/* echo password_hash(hash("sha256", "password"), PASSWORD_BCRYPT, $options); */

