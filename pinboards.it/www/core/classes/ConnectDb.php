<?php

/**
 * singleton class to manage the database connection
 * @example - here is an inline example:
 * <code>
 * <?php
 *  //instantiate the class
 *  $instance = ConnectDb::getInstance();
 *  // get the gonnection
 *  $conn = $instance->getConnection();
 * </code>
 */
class ConnectDb {
  // Hold the class instance.
  private static $instance = null;
  private $conn;
  
  /**
   * private constructor where the database connection is estabilished.
   */
  private function __construct() {
    $config = require dirname(__FILE__).'/../config/config.php';

    $dsn = "mysql:host={$config['dbHost']};dbname={$config['dbName']}";

    $options = [
      PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
      PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
      PDO::ATTR_EMULATE_PREPARES   => false,
      PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES 'utf8'"
    ];
    try {
      $this->conn = new PDO($dsn, $config['dbUsername'], $config['dbPassword'], $options);
    } catch (\PDOException $e) {
      throw new \PDOException($e->getMessage(), (int)$e->getCode());
    }
  }

  /**
   * constructor. Call this method to istantiate the class
   * @return object - the singleton object
   */
  public static function getInstance() {
    if(!self::$instance) {
      self::$instance = new ConnectDb();
    }
    return self::$instance;
  }

  /**
   * returns the pdo object for the database connection
   * @return object
   */
  public function getConnection() {
    return $this->conn;
  }
}
