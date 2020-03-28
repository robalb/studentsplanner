<?php
require_once 'ConnectDb.php';

class GetApplicationData{
  private $allowedDataNames;
  private $session;
  private $defaults;
  public function __construct(array $sessionData){
    //-- configuration --

    //configure here the allowed data elements
    $this->allowedDataNames = [
      'account', 'planner'
    ];
    //configure here the default values for all the 
    //data elements that might be stored as null in the database. These values will be converted in json format
    $this->defaults = [
      "planner" => [
        "events" => []
      ]
    ];

    $this->session = $sessionData;
  }

  private function account(){
    //get required database data
    $studentsArray = [];
    $instance = ConnectDb::getInstance();
    $pdo = $instance->getConnection();
    $stmt = $pdo->prepare('SELECT uniqueName, fullName, admin FROM students WHERE classID = ? LIMIT 100');
    $stmt->execute([ $this->session['classID'] ]);
    if($stmt->rowCount() > 0){
      while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $studentsArray[] = [
          "uid" => $row["uniqueName"],
          "fullName" => $row["fullName"],
          "isAdmin" => (bool) $row["admin"],
        ];
      }
    }

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
    $returnData = $this->defaults["planner"];
    $instance = ConnectDb::getInstance();
    $pdo = $instance->getConnection();
    $stmt = $pdo->prepare('SELECT stateHash, plannerData FROM planner_states WHERE classID = ? ');
    $stmt->execute([ $this->session['classID'] ]);
    if($stmt->rowCount() > 0){
      $row = $stmt->fetch();
      $plannerData = $row["plannerData"];
      //if plannerData is not empty
      if(strlen($plannerData) > 0 && $row["stateHash"] != '00000000'){
        try{
          $returnData = json_decode($plannerData, true, 50);
        }catch(Exception $e){
          echo var_dump($e);
          die;
        }
      }
    }
    return $returnData;
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
    if(!$valid){
      return false;
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
