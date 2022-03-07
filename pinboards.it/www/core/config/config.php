<?php

/**
 * CONFIGURATION VARIABLES
 * ATTENZIONE: non includere modifiche con informazioni sensibili in futuri commit
 * è possibile configurare git per ignorare automaticamente qualsiasi modifica locale al file.
 * Per farlo, dopo essersi assicurati che app/config.php è il percorso corretto di questo file, scrivere:
 * git update-index --assume-unchanged app/config.php
 *
 */
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
