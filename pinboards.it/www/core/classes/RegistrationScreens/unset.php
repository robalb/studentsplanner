<?php
function unsetRegistrationScreens(){
  unset($_SESSION['registrationScreen_current']);
  unset($_SESSION['registrationScreen_front']);
  unset($_SESSION['registrationScreen_back']);
}

