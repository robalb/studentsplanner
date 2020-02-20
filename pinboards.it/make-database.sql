-- --------------------------------------------------------
-- PINBOARDS DATABASE CONFIGURATION
-- --------------------------------------------------------

/* https://dba.stackexchange.com/questions/76788/create-a-mysql-database-with-charset-utf-8 */
/* https://stackoverflow.com/questions/766809/whats-the-difference-between-utf8-general-ci-and-utf8-unicode-ci */
/* http://utf8everywhere.org/ */
CREATE DATABASE IF NOT EXISTS `pinboards_0`
CHARACTER SET = 'utf8mb4' COLLATE = 'utf8mb4_general_ci';
USE `pinboards_0`;

CREATE TABLE IF NOT EXISTS `class` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(60) NOT NULL,
  `schoolID` int(11),
  `currentPlannerState` varchar(8),
  `plannerStateHistory` varchar(255),
  PRIMARY KEY (`ID`)
) DEFAULT CHARSET = utf8mb4;


CREATE TABLE IF NOT EXISTS `students` (
  `classID` int(11) NOT NULL,
  `mail` varchar(255) NOT NULL,
  `password` char(60) NOT NULL,
  `fullName` varchar(60) NOT NULL,
  `uniqueName` varchar(60) NOT NULL,
  `registrationTimestamp` int(11),
  `lastLoginTimestamp` int(11),
  `lastLoginIp` varchar(255),
  INDEX (`classID`)
) DEFAULT CHARSET = utf8mb4;


CREATE TABLE IF NOT EXISTS `planner_states` (
  `classID` int(11) NOT NULL,
  `stateHash` varchar(8),
  `parentStateHash` varchar(8),
  `plannerData` varchar(255),
  `authorUniqueName` varchar(60),
  `timestamp` int(11),
  INDEX (`classID`)
) DEFAULT CHARSET = utf8mb4;
