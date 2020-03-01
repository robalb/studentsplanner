<?php
require_once 'ConnectDb.php';

class GetApplicationData{
  private $allowedDataNames;
  private $session;
  public function __construct(array $sessionData){
    $this->allowedDataNames = [
      'account', 'planner'
    ];

    $this->session = $sessionData;
  }

  private function account(){
    //get required database data
    //TODO remove this placeholder
    $studentsArray = [
      [
        "uid" => "antonio",
        "fullName" => "antonio grasqwi",
        "isAdmin" => true
      ],
      [
        "uid" => "roberto",
        "fullName" => "roberto grasqwi",
        "isAdmin" => true
      ],
      [
        "uid" => "zobrofio",
        "fullName" => "zobrofio worqui",
        "isAdmin" => true
      ],
      [
        "uid" => "tresbito",
        "fullName" => "tresbito grasqwi",
        "isAdmin" => true
      ],
      [
        "uid" => "giorgio",
        "fullName" => "giorgio vasari",
        "isAdmin" => true
      ]
    ];

    //generate data array
    $data = [];
    $data["user"] = [
      "uid" => $this->session["uniqueName"],
      "fullName" => $this->session["fullName"],
      "locale" => $this->session["locale"],
      "isAdmin" => $this->session["isAdmin"],
    ];
    $data["classroomName"] = $this->session["className"];
    $data["students"] = $studentsArray;
    return $data;
  }

  private function planner(){
    //TODO
    //json_decode($databasereceivedstuff, true, 5);
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
      $dataJson = $this->$data();
      $returnArray += [$data => $dataJson];

    }

    return $returnArray;
  }
}
