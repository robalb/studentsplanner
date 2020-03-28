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
  PRIMARY KEY (`ID`)
) DEFAULT CHARSET = utf8mb4;


CREATE TABLE IF NOT EXISTS `students` (
  `classID` int(11) NOT NULL,
  `mail` varchar(255) NOT NULL,
  `password` char(60) NOT NULL,
  `fullName` varchar(60) NOT NULL,
  `uniqueName` varchar(60) NOT NULL,
  `registrationTimestamp` int(11) NOT NULL,
  `lastLoginTimestamp` int(11) NOT NULL,
  `lastLoginIp` varchar(255) NOT NULL,
  `admin` boolean NOT NULL,
  `locale` varchar(3) NOT NULL,
  `trustScore` int(11),
  INDEX (`classID`),
  INDEX `mail` (`mail`)
) DEFAULT CHARSET = utf8mb4;


CREATE TABLE IF NOT EXISTS `planner_states` (
  `classID` int(11) NOT NULL,
  `stateHash` varchar(8),
  `plannerData` varchar(4096),
  `authorUniqueName` varchar(60),
  `timestamp` int(11),
  INDEX (`classID`)
) DEFAULT CHARSET = utf8mb4;



CREATE TABLE IF NOT EXISTS `invite_codes` (
  `code` char(16) NOT NULL,
  `classID` int(11) NOT NULL,
  `invitedBy` varchar(60) NOT NULL,
  `creationDate` int(11) NOT NULL,
  `lifespan` int(11) NOT NULL,
  INDEX(`code`)
) DEFAULT CHARSET = utf8mb4;


/* test data */
INSERT INTO class (ID, name) VALUES (1, 'TEST');

INSERT INTO planner_states (classID, stateHash) VALUES
(1, '00000000');

INSERT INTO invite_codes (code, classID, invitedBy, creationDate, lifespan) VALUES
('validInviteTestX', 1, 'giorgio vasari', 1585331238, 96400);
INSERT INTO invite_codes (code, classID, invitedBy, creationDate, lifespan) VALUES
('expiredInviteXXX', 1, 'giorgio vasari', 1585331238, 12);

INSERT INTO students VALUES
(1, '12@mail.com', '$2y$14$244vKtBFjCL0htHl23n6GeAIX7puuml.sPULc6YuzYTS9Ut3bjEAy', 'giorgio vasari', 'vasari',
  1585330487, 1585330487, 'localhosts', true, 'it', 100);
INSERT INTO students VALUES
(1, '13@mail.com', '$2y$14$244vKtBFjCL0htHl23n6GeAIX7puuml.sPULc6YuzYTS9Ut3bjEAy', 'giorgio sarti', 'sarti',
  1585330487, 1585330487, 'localhosts', true, 'it', 100);
INSERT INTO students VALUES
(1, '14@mail.com', '$2y$14$244vKtBFjCL0htHl23n6GeAIX7puuml.sPULc6YuzYTS9Ut3bjEAy', 'andrea perioli', 'perioli',
  1585330487, 1585330487, 'localhosts', true, 'it', 100);
INSERT INTO students VALUES
(1, '15@mail.com', '$2y$14$244vKtBFjCL0htHl23n6GeAIX7puuml.sPULc6YuzYTS9Ut3bjEAy', 'rudyard sassari', 'sassari',
  1585330487, 1585330487, 'localhosts', true, 'it', 100);
INSERT INTO students VALUES
(1, '16@mail.com', '$2y$14$244vKtBFjCL0htHl23n6GeAIX7puuml.sPULc6YuzYTS9Ut3bjEAy', 'francesco patressini', 'patressini',
  1585330487, 1585330487, 'localhosts', true, 'it', 100);
INSERT INTO students VALUES
(1, '17@mail.com', '$2y$14$244vKtBFjCL0htHl23n6GeAIX7puuml.sPULc6YuzYTS9Ut3bjEAy', 'aieie aieie', 'aieie',
  1585330487, 1585330487, 'localhosts', true, 'it', 100);
INSERT INTO students VALUES
(1, '18@mail.com', '$2y$14$244vKtBFjCL0htHl23n6GeAIX7puuml.sPULc6YuzYTS9Ut3bjEAy', 'ivo stebri', 'stebri',
  1585330487, 1585330487, 'localhosts', true, 'it', 100);
INSERT INTO students VALUES
(1, '20@mail.com', '$2y$14$244vKtBFjCL0htHl23n6GeAIX7puuml.sPULc6YuzYTS9Ut3bjEAy', 'rudyard kipling', 'kipling',
  1585330487, 1585330487, 'localhosts', true, 'en', 100);
INSERT INTO students VALUES
(1, '21@mail.com', '$2y$14$244vKtBFjCL0htHl23n6GeAIX7puuml.sPULc6YuzYTS9Ut3bjEAy', 'andrea se', 'se',
  1585330487, 1585330487, 'localhosts', true, 'it', 100);
INSERT INTO students VALUES
(1, '22@mail.com', '$2y$14$244vKtBFjCL0htHl23n6GeAIX7puuml.sPULc6YuzYTS9Ut3bjEAy', 'joseph longsurnamelengthedgecase', 'surnamelength',
  1585330487, 1585330487, 'localhosts', true, 'it', 100);
INSERT INTO students VALUES
(1, '23@mail.com', '$2y$14$244vKtBFjCL0htHl23n6GeAIX7puuml.sPULc6YuzYTS9Ut3bjEAy', 'namelengthedgecase smith', 'smith',
  1585330487, 1585330487, 'localhosts', true, 'it', 100);
INSERT INTO students VALUES
(1, '24@mail.com', '$2y$14$244vKtBFjCL0htHl23n6GeAIX7puuml.sPULc6YuzYTS9Ut3bjEAy', 'xavier garcìa y fernandez y gonzales y rofriguez lopez', 'garcìa',
  1585330487, 1585330487, 'localhosts', true, 'it', 100);

