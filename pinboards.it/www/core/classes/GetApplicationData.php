<?php
require_once 'ConnectDb.php';

class GetApplicationData{
  private $allowedDataNames;
  private $sessionData;
  public function __construct(array $sessionData){
    $this->allowedDataNames = [
      'account', 'planner'
    ];

    $this->sessionData = $sessionData;
  }

  private function account(){
    return "{account-data}";
  }

  private function planner(){
    return "{planner-data}";
  }

  public function getData(array $requiredData){
    //check that the required data is valid
    $valid = true;
    foreach($requiredData as $data){
      if(!in_array($data, $this->allowedDataNames)){
        $valid = false;
        break;
      }
    }

    //generate the associative array to return
    $returnArray = [];
    foreach($requiredData as $data){
      $dataJson = $this->account();
      $returnArray += [$data => $dataJson];

    }

    return $returnArray;
  }
}
