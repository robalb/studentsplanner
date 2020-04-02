<?php
require_once 'ConnectDb.php';

class DataCache{
  private static $userDataReloaded = false;

  static function reloadUserData($mail){
    if(self::$userDataReloaded){
      return false;
    }
    self::$userDataReloaded = true;
    //get the uer data
    $instance = ConnectDb::getInstance();
    $pdo = $instance->getConnection();
    $stmt = $pdo->prepare('SELECT s.classID, s.fullName, s.uniqueName, s.admin, s.locale, c.name FROM students s LEFT JOIN class c ON s.classID = c.ID  WHERE s.mail = ?');
    $stmt->execute([$mail]);
    if($stmt->rowCount() > 0){
      $row = $stmt->fetch(PDO::FETCH_ASSOC);
      $className = $row['classID'] == 0 ? '' : $row['name'];
      $_SESSION = array_merge($_SESSION, [
        'classID' => $row['classID'],
        'className' => $className,
        'fullName' => $row['fullName'],
        'uniqueName' => $row['uniqueName'],
        'locale' => $row['locale'],
        'isAdmin' => $row['admin']
      ]);
    }
  }
}
