<?php
require_once './ConnectDb.php';

class GetApplicationData{
  private $allowedDataNames;
  private $sessionData;
  public function __construct(array $sessionData){
    $this->allowedDataNames = [
      'account', 'planner'
    ];

    $this->sessionData = $sessionData;
  }

  public function getData(array $requiredData){

  }
}
