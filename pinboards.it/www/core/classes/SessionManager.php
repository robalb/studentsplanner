<?php

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
        private $defaultName = "SESSBISQUIT";
        private $defaultLifeTime = 0;
        private $defaultPath = "/";
        // $_SERVER['SERVER_NAME'];
        private $defaultDomain = "";
        //WARNING !
        private $defaultSecure = false;
        private $defaultHttpOnly = true;
        private $defaultSameSite = "lax";

        /**
         * constructor that initializes a php session in a better
         * and more secure way compared to the classic session_start();
         */
        function __construct($lifeTime = null){
            if(!$lifeTime)$lifeTime = $this->defaultLifeTime;
            session_name($this->defaultName);
            session_set_cookie_params(
               $lifeTime,
               $this->defaultPath,
               $this->defaultDomain,
               $this->defaultSecure,
               $this->defaultHttpOnly
               //array("samesite" => $this->defaultSameSite)
            );
            session_start();
            
            //prevent session fixation attacks, by changing the cookie id if the user is trying to
            //connect using a cookie id that is not recognized
            if(!isset($_SESSION['__id_is_recognized'])){
               $_SESSION['__id_is_recognized'] = true;
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
         * returns wether the user is new or has been already logged
         * @return boolean - the user state
         */
        public function isValid(){
            return isset($_SESSION['__is_valid']);
        }
    }
?>
