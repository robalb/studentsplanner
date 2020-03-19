<?php
//TODO: make this api accessible only if the user is logged, otherwise it can be used to bypass common 
//security protections
require_once '../core/classes/SessionManager.php';
$session = new SessionManager();
session_destroy();
echo json_encode(['success'=> true]);
