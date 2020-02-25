<?php

class SecurityHeaders{
  function __construct(){
  }
  public static function getNonce(){
    //TODO: init headers, generate random NONCE
    $nonce = "TEST_NONCE";
    return $nonce;
  }
}
