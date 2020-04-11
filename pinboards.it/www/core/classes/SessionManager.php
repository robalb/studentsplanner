<?php
require_once 'ConnectDb.php';

/**
 * class to manage php sessions, and improve the sessions security.
 * NOTE: set the option $defaultSecure to true when deploying on a https server
 *       sessions won't work if $defaultSecure is set to true on a non https web server
 * @example - usage example
 * <code>
 * <?php
 * require_once './classes/SessionManager.php';
 * $session = new SessionManager();
 * $_SESSION['foo'] = 'bar';
 * </code>
 * 
 * using the default php function, the example above can be written as:
 * <code>
 * <?php
 * session_start();
 * $_SESSION['foo'] = 'bar';
 * </code>
 */
class SessionManager{
  //default cookie settings
  private $defaultName = "SESSBISQUIT";
  private $defaultLifeTime = 0;
  private $defaultPath = "/";
  // $_SERVER['SERVER_NAME'];
  private $defaultDomain = "";
  //WARNING !
  private $defaultSecure = false;
  private $defaultHttpOnly = true;
  private $defaultSameSite = "Lax";

  //permanent cookie settings
  private $permanentName = "STALEBISQUIT";
  private $permanentLifeTime = (60 * 60 * 24 * 30); //30 days

  //class internal attributes
  private $isNew = false;

  /**
   * constructor that initializes a php session in a better
   * and more secure way compared to the classic session_start();
   */
  function __construct($lifeTime = null){
    if(!$lifeTime)$lifeTime = $this->defaultLifeTime;
    session_name($this->defaultName);
    session_set_cookie_params([
        'lifetime' => $lifeTime,
        'path' => $this->defaultPath,
        'domain' => $this->defaultDomain,
        'secure' => $this->defaultSecure,
        'httponly' => $this->defaultHttpOnly,
        'samesite' => $this->defaultSameSite
      ]);
    session_start();

    //if the session is new
    if(!isset($_SESSION['__id_is_recognized'])){
      //set a flag to recognize the session as old
      $_SESSION['__id_is_recognized'] = true;
      //set a temporary attribute to let the class know that the session is new
      $this->isNew = true;
      //prevent session fixation attacks, by changing the cookie id if the user is trying to
      //connect using a cookie id that is not recognized
      if(isset($_COOKIE[$this->defaultName])) session_regenerate_id(true);
    }
  }

  /**
   * set the user state to valid/logged. this method should be called
   * after a login when all the session variables have been set
   */
  public function setValid(){
    $_SESSION['__is_valid'] = true;
  }

  /**
   * set a permanent cookie to remember the user session
   */
  public function setPermanent($mail){
    //the cookie can only be set if the response headers have not already been sent
    if(headers_sent()){
      throw new Exception('Headers were already sent');
      return 0;
    }
    //generate the secure uid
    $bytes = random_bytes(33);
    $uid = str_replace(['+','/','='], ['-','_',''], base64_encode($bytes));
    //prepare other variables
    $uidHash = hash('sha256', $uid);
    $rawIp = $_SERVER['REMOTE_ADDR']??null;
    $ip = filter_var($rawIp, FILTER_VALIDATE_IP) ?: 'unknown';
    $userAgent = $_SERVER['HTTP_USER_AGENT']??null;
    //add the secure id hash and other data to the authIds table
    $instance = ConnectDb::getInstance();
    $pdo = $instance->getConnection();
    $stmt = $pdo->prepare('INSERT INTO authIds VALUES (:tokenHash, :creationDate, :userMail, :creatorUserAgent, :creatorIp)');
    $stmt->execute([
      'tokenHash' => $uidHash,
      'creationDate' => time(),
      'userMail' => $mail,
      'creatorUserAgent' => $userAgent,
      'creatorIp' => $ip
    ]);
    if($stmt->rowCount() < 1){
      //on fail avoid proceeding further with the cookie creation
      return 0;
    }
    //on success:
    //delete the previous permanent cookie db record if existing
    $this->deletePermanentRecord();
    //set the cookie, overwriting the previous one if existing
    setcookie(
      $this->permanentName,
      $uid,
      [
        'expires' => time() + $this->permanentLifeTime,
        'path' => $this->defaultPath,
        'domain' => $this->defaultDomain,
        'secure' => $this->defaultSecure,
        'httponly' => $this->defaultHttpOnly,
        'samesite' => $this->defaultSameSite
      ]
    );
  }

  private function deletePermanentRecord(){
    if (!isset($_COOKIE[$this->permanentName])) {
      return false;
    }
    $uid = $_COOKIE[$this->permanentName];
    $uidHash = hash('sha256', $uid);
    //delete the database row
    $instance = ConnectDb::getInstance();
    $pdo = $instance->getConnection();
    $stmt = $pdo->prepare('DELETE FROM authIds WHERE tokenHash = ?');
    $stmt->execute([ $uidHash ]);
    return ($stmt->rowCount() > 0);
  }

  private function deletePermanentCookie(){
    if (isset($_COOKIE[$this->permanentName])) {
        unset($_COOKIE[$this->permanentName]);
        setcookie($this->permanentName, '', time() - 3600, '/'); // empty value and old timestamp
    }
  }

  /**
   * removes the user session completely, and unset the
   * 'remember me' permanent cookie if set, also removing its record in the db
   * @return boolean - the success of the operation
   */
  public function logout(){
    if($this->isNew){
      return false;
    }
    //delete the session
    session_destroy();
    //delete the remember me token completely, both from the db and the session cookie
    $this->deletePermanentRecord();
    $this->deletePermanentCookie();
    return true;
  }

  /**
   * returns wether the user is new or has been already logged
   * @return boolean - the user state
   */
  public function isValid(){
    return isset($_SESSION['__is_valid']);
  }

  /**
   * returns wether the session has been created now, or already existed
   * this can be useful in situations where a page depends on existing session variables,
   * but the user is not logged (for example in registration or login pages) so isValid() can't help
   * @return boolean - the session is new or not
   */
  public function isNew(){
    return $this->isNew;
  }
}
