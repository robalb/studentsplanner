<?php
//TODO: make this api accessible only if the user is logged, otherwise it can be used to bypass common 
//security protections
//perform checks:
//-- session is valid
//-- data json is valid
//-- csrf token is valid
//
require_once '../core/classes/SessionManager.php';
$session = new SessionManager();

$success = $session->logout();
echo json_encode(['success'=> $success]);
