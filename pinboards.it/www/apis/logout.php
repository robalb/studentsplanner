<?php
require_once '../core/classes/SessionManager.php';
$session = new SessionManager();
session_destroy();
echo json_encode(['success'=> true]);
