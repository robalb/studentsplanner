<?php

return array(
  //DATABASE CONFIGURATION
  'dbHost' => getenv('MARIADB_HOST'),
  'dbName' => getenv('MARIADB_DATABASE'),
  'dbUsername' => getenv('MARIADB_USER'),
  'dbPassword' => getenv('MARIADB_PASSWORD'),
  //SECURITY
  'bcryptCost' => 13,
  //WEBSITE URLS
  'baseUrl' => getenv('BASE_URL'),
  'inviteUrl' => getenv('BASE_URL') . '/register?invite=',
  //MAIL CONFIGURATION
  'smtpHost' => '',
  'smtpUsername' => '',
  'smtpPassword' => '',

  'mailFrom' => '',
  'mailName' => '',
);
