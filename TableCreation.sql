CREATE TABLE `Users` (
	`uid` INT(11) NOT NULL AUTO_INCREMENT,
	`username` varchar(10) NOT NULL,
	`pass` varchar(10) NOT NULL,
	`access` BINARY(2) NOT NULL,
	`score` INT(11) NOT NULL,
	`missile` INT(11) NOT NULL,
	PRIMARY KEY (`uid`)
);

CREATE TABLE `Questions` (
	`qid` INT(11) NOT NULL AUTO_INCREMENT,
	`title` VARCHAR(255) NOT NULL,
	`body` TEXT NOT NULL,
	`test case 1` VARCHAR(255) NOT NULL,
	`test case 2` VARCHAR(255) NOT NULL,
	`test case 3` VARCHAR(255) NOT NULL,
	`answer 1` VARCHAR(255) NOT NULL,
	`answer 2` VARCHAR(255) NOT NULL,
	`answer 3` VARCHAR(255) NOT NULL,
	`points` INT(11) NOT NULL,
	PRIMARY KEY (`qid`)
);

CREATE TABLE `Question logs` (
	`uid` INT(11) NOT NULL,
	`qid` INT(11) NOT NULL,
	`solved/unsolved` BOOLEAN NOT NULL
);

CREATE TABLE `Ship logs` (
	`uid` INT(11) NOT NULL,
	`row` INT(11) NOT NULL,
	`col` INT(11) NOT NULL,
	`hit/miss` BOOLEAN NOT NULL
);

CREATE TABLE `Grid` (
	`row` INT(11) NOT NULL,
	`col` INT(11) NOT NULL,
	`uid` INT(11) NOT NULL,
	`isactive` BOOLEAN NOT NULL
);

ALTER TABLE `Question logs` ADD CONSTRAINT `Question logs_fk0` FOREIGN KEY (`uid`) REFERENCES `Users`(`uid`);

ALTER TABLE `Question logs` ADD CONSTRAINT `Question logs_fk1` FOREIGN KEY (`qid`) REFERENCES `Questions`(`qid`);

ALTER TABLE `Ship logs` ADD CONSTRAINT `Ship logs_fk0` FOREIGN KEY (`uid`) REFERENCES `Users`(`uid`);

ALTER TABLE `Grid` ADD CONSTRAINT `Grid_fk0` FOREIGN KEY (`uid`) REFERENCES `Users`(`uid`);