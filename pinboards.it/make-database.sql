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
  INDEX (`classID`),
  INDEX `mail` (`mail`)
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


/* test data */
INSERT INTO class (ID, name, currentPlannerState) VALUES (1, 'TEST', '7e57abcd');

INSERT INTO planner_states (classID, stateHash, parentStateHash) VALUES 
(1, '7e57abcd', '00000000');

INSERT INTO students (classID, mail, password, fullName, uniqueName) VALUES
(1, 'student1@mail.com', '', 'andre asurname', 'asurname');
INSERT INTO students (classID, mail, password, fullName, uniqueName) VALUES
(1, 'student2@mail.com', '', 'giorgio asurname', 'asurname g');
INSERT INTO students (classID, mail, password, fullName, uniqueName) VALUES
(1, 'student3@mail.com', '', 'qwe bsurname', 'bsurname');
INSERT INTO students (classID, mail, password, fullName, uniqueName) VALUES
(1, 'student4@mail.com', '', 'qweqwe eqwewqe csur', 'csur');
INSERT INTO students (classID, mail, password, fullName, uniqueName) VALUES
(1, 'student5@mail.com', '', 'csurname', 'csurname');
INSERT INTO students (classID, mail, password, fullName, uniqueName) VALUES
(1, 'student6@mail.com', '', 'cqwe cqwe', 'cqwe');
INSERT INTO students (classID, mail, password, fullName, uniqueName) VALUES
(1, 'student7@mail.com', '', 'andre dellos', 'dellos');
INSERT INTO students (classID, mail, password, fullName, uniqueName) VALUES
(1, 'student8@mail.com', '', 'sogni gorgoro', 'gorgoro');
INSERT INTO students (classID, mail, password, fullName, uniqueName) VALUES
(1, 'student9@mail.com', '', 'sogni forbici', 'forbici');
INSERT INTO students (classID, mail, password, fullName, uniqueName) VALUES
(1, 'student10@mail.com', '', 'fwer lorilli', 'lorilli');
INSERT INTO students (classID, mail, password, fullName, uniqueName) VALUES
(1, 'student11@mail.com', '', 'qweqwe vernini', 'vernini');
INSERT INTO students (classID, mail, password, fullName, uniqueName) VALUES
(1, 'student12@mail.com', '$2y$12$LAzPfA.oeIiKBtwEqWHxPOOc8HrsKqNdxLHLISTCWf5n/Y4bSmgm2', 'giorgio vasari', 'vasari');
INSERT INTO students (classID, mail, password, fullName, uniqueName) VALUES
(1, 'student13@mail.com', '', 'gargari zulli', 'zulli');
INSERT INTO students (classID, mail, password, fullName, uniqueName) VALUES
(1, 'student14@mail.com', '', 'gije zanti', 'zanti');


