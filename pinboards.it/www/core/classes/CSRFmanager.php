<?php

class CSRFmanager{
  //TODO: study wether this is needed, or i can just generate a
  //token when it is requested and it doesnt exist without security problems
  public static function generate(){
    /* if(isset($_SESSION['CSRF'])){ */
    /*   throw new Exception('csrf token already generated'); */
    /*   return 0; */
    /* } */
    $_SESSION['CSRF'] = bin2hex(random_bytes(64));
  }

  public static function getToken(){
    if(!isset($_SESSION['CSRF'])){
      $_SESSION['CSRF'] = bin2hex(random_bytes(64));
    }
    return $_SESSION['CSRF'];
  }

  public static function validate(string $token){
    if(!isset($_SESSION['CSRF'])){
      throw new Exception('session or csrf token not set');
    }else{
      return hash_equals($_SESSION['CSRF'], $token);
    }
  }
}

