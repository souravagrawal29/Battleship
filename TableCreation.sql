CREATE TABLE `Users` (
	`uid` INT(11) NOT NULL AUTO_INCREMENT,
	`username` varchar(10) NOT NULL,
	`pass` varchar(10) NOT NULL,
	`access` INT(5) NOT NULL,
	`score` INT(11) NOT NULL,
	`missile` INT(11) NOT NULL,
	PRIMARY KEY (`uid`)
);

CREATE TABLE `Questions` (
	`qid` INT(11) NOT NULL AUTO_INCREMENT,
	`body` TEXT NOT NULL,
	`points` INT(11) NOT NULL,
	`answer` VARCHAR(255) NOT NULL,
	`test case 1` VARCHAR(255) NOT NULL,
	PRIMARY KEY (`qid`)
);

CREATE TABLE `Logs` (
	`uid` INT(11) NOT NULL,
	`qid` INT(11) NOT NULL,
	`hit/miss` BOOLEAN NOT NULL,
	`row` INT NOT NULL,
	`col` INT NOT NULL
);

CREATE TABLE `Grid` (
	`row` INT(11) NOT NULL,
	`col` INT(11) NOT NULL,
	`uid` INT(11) NOT NULL,
	`isactive` BOOLEAN NOT NULL
);

ALTER TABLE `Logs` ADD CONSTRAINT `Logs_fk0` FOREIGN KEY (`uid`) REFERENCES `Users`(`uid`);

ALTER TABLE `Logs` ADD CONSTRAINT `Logs_fk1` FOREIGN KEY (`qid`) REFERENCES `Questions`(`qid`);

ALTER TABLE `Grid` ADD CONSTRAINT `Grid_fk0` FOREIGN KEY (`uid`) REFERENCES `Users`(`uid`);

