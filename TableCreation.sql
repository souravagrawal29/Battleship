ALTER TABLE `QLogs` DROP FOREIGN KEY `QLogs_fk0`;

ALTER TABLE `QLogs` DROP FOREIGN KEY `QLogs_fk1`;

ALTER TABLE `Shiplogs` DROP FOREIGN KEY `Shiplogs_fk0`;

ALTER TABLE `Grid` DROP FOREIGN KEY `Grid_fk0`;

DROP TABLE IF EXISTS `Users`;

DROP TABLE IF EXISTS `Questions`;

DROP TABLE IF EXISTS `QLogs`;

DROP TABLE IF EXISTS `Shiplogs`;

DROP TABLE IF EXISTS `Grid`;

CREATE TABLE `Users` (
	`uid` INT(11) NOT NULL AUTO_INCREMENT,
	`username` varchar(10) NOT NULL,
	`pass` varchar(10) NOT NULL,
	`access` INT(11) NOT NULL DEFAULT '0',
	`score` INT(11) NOT NULL DEFAULT '0',
	`missile` INT(11) NOT NULL DEFAULT '0',
	`isloggedin` INT(11) NOT NULL,
	PRIMARY KEY (`uid`)
);

CREATE TABLE `Questions` (
	`qid` INT(11) NOT NULL AUTO_INCREMENT,
	`title` VARCHAR(255) NOT NULL,
	`body` TEXT NOT NULL,
	`testcase1` TEXT NOT NULL,
	`testcase2` TEXT NOT NULL,
	`testcase3` TEXT NOT NULL,
	`answer1` TEXT NOT NULL,
	`answer2` TEXT NOT NULL,
	`answer3` TEXT NOT NULL,
	`points` INT(11) NOT NULL,
	`constraints` TEXT NOT NULL,
	`input_format` TEXT NOT NULL,
	`output_format` TEXT NOT NULL,
	`sample_input` TEXT NOT NULL,
	`sample_output` TEXT NOT NULL,
	PRIMARY KEY (`qid`)
);

CREATE TABLE `QLogs` (
	`uid` INT(11) NOT NULL,
	`qid` INT(11) NOT NULL,
	`solved` BOOLEAN NOT NULL,
	`attempt_no` INT(11) NOT NULL,
	`logtime` TIMESTAMP NOT NULL
);

CREATE TABLE `Shiplogs` (
	`uid` INT(11) NOT NULL,
	`row` INT(11) NOT NULL,
	`col` INT(11) NOT NULL,
	`hit` BOOLEAN NOT NULL,
	`logtime` TIMESTAMP NOT NULL
);

CREATE TABLE `Grid` (
	`row` INT(11) NOT NULL,
	`col` INT(11) NOT NULL,
	`uid` INT(11) NOT NULL,
	`isactive` BOOLEAN NOT NULL
);

ALTER TABLE `QLogs` ADD CONSTRAINT `QLogs_fk0` FOREIGN KEY (`uid`) REFERENCES `Users`(`uid`);

ALTER TABLE `QLogs` ADD CONSTRAINT `QLogs_fk1` FOREIGN KEY (`qid`) REFERENCES `Questions`(`qid`);

ALTER TABLE `Shiplogs` ADD CONSTRAINT `Shiplogs_fk0` FOREIGN KEY (`uid`) REFERENCES `Users`(`uid`);

ALTER TABLE `Grid` ADD CONSTRAINT `Grid_fk0` FOREIGN KEY (`uid`) REFERENCES `Users`(`uid`);