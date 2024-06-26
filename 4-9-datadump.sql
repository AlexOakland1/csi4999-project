-- MariaDB dump 10.19-11.3.2-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: csi4999
-- ------------------------------------------------------
-- Server version	11.3.2-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `eventmembers`
--

DROP TABLE IF EXISTS `eventmembers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `eventmembers` (
  `eventid` int(11) NOT NULL,
  `memberid` int(11) NOT NULL,
  PRIMARY KEY (`eventid`,`memberid`),
  KEY `memberid` (`memberid`),
  CONSTRAINT `eventmembers_ibfk_1` FOREIGN KEY (`eventid`) REFERENCES `events` (`eventid`),
  CONSTRAINT `eventmembers_ibfk_2` FOREIGN KEY (`memberid`) REFERENCES `members` (`memberid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `eventmembers`
--

LOCK TABLES `eventmembers` WRITE;
/*!40000 ALTER TABLE `eventmembers` DISABLE KEYS */;
INSERT INTO `eventmembers` VALUES
(43,1),
(44,1),
(47,1),
(48,1),
(74,1),
(76,1),
(78,1),
(43,2),
(46,2),
(47,2),
(48,2),
(74,2),
(77,2),
(78,2),
(60,6),
(62,6),
(62,7),
(43,9),
(46,9),
(47,9),
(48,9),
(74,9),
(78,9),
(54,13),
(57,13),
(54,14),
(56,14),
(57,14),
(54,15),
(57,15),
(58,15),
(53,16),
(50,17),
(52,17),
(49,18),
(50,18),
(51,18),
(52,18);
/*!40000 ALTER TABLE `eventmembers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `events` (
  `eventid` int(11) NOT NULL AUTO_INCREMENT,
  `eventname` varchar(255) NOT NULL,
  `eventdesc` varchar(2048) DEFAULT NULL,
  `eventdatetime` datetime DEFAULT NULL,
  `eventimportance` enum('normal','important','low') DEFAULT NULL,
  `userid` int(11) NOT NULL,
  `location` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`eventid`),
  KEY `userid` (`userid`),
  CONSTRAINT `events_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`)
) ENGINE=InnoDB AUTO_INCREMENT=88 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES
(43,'Harold\'s Birthday Party','For Harold\'s 8th Birthday','2024-04-01 11:00:00','normal',1,'12th Avenue and Oak'),
(44,'Test','This might be a test.','2024-03-02 00:17:00','important',1,'Ohio'),
(46,'Vacation','We\'re going to Six Flags','2024-03-05 00:50:00','important',1,'Ohio'),
(47,'Baseball Game','The big game!','2024-04-06 16:00:00','normal',1,'12th Avenue and Oak'),
(48,'going to the store','getting tomatoes and carrots','2024-03-04 11:30:00','important',1,'the store'),
(49,'Create my secret room','Needs to be under the bush.','1994-06-01 11:53:00','important',7,'Hyrule'),
(50,'Find Rupees for Secret Room','Link needs a reason to find the secret room.','1994-07-07 12:00:00','important',7,'Hyrule'),
(51,'Furnish Secret Room','Some torches would be nice.','1995-03-07 23:55:00','normal',7,'Hyrule'),
(52,'Test Secret Room','Make sure it can be found.','1995-03-07 23:56:00','normal',7,'Hyrule'),
(53,'Find Secret Room','Link needs to find my secret room.','1996-12-07 23:57:00','important',7,'Hyrule'),
(54,'Event 11','Event Desc','2024-03-07 23:57:00','normal',3,'Eventville'),
(55,'Event 12','Event','2024-03-07 23:58:00','normal',3,'Eventville'),
(56,'Event 13','Add more events','2024-03-07 23:58:00','normal',3,'7-11'),
(57,'Go to 7-11 again','I need my slurpee','2024-07-11 18:59:00','important',3,'7-11'),
(58,'Clean the tower','Needs maintainence','2024-03-07 23:59:00','normal',3,'The Tower'),
(59,'Change Password','It needs to be more secure','2024-03-08 00:00:00','normal',4,'My house'),
(60,'Go to gym','Gotta pump iron','2024-03-10 12:01:00','normal',4,'Gym'),
(61,'Add more events','Now','2024-03-08 00:01:00','normal',4,'My house'),
(62,'Add even more events','Needs to be 30','2024-03-08 00:02:00','normal',4,'My house'),
(63,'Contemplate adding more events','hmm yes there needs to be more','2024-03-08 00:02:00','normal',4,'My house'),
(64,'Be an egghead','It\'s spherical','2024-03-08 00:03:00','normal',9,'The barn'),
(65,'Polish my head','It needs to be shiny','2024-03-08 00:03:00','normal',9,'Hardware store'),
(66,'Humpty Dumpty Cosplay','It\'ll look great','2024-03-08 00:04:00','normal',9,'Convention'),
(67,'Event','Eventing','2024-03-08 00:05:00','normal',9,'Eventville'),
(68,'Event Again','Still eventing','2024-03-08 00:05:00','normal',9,'Eventville'),
(69,'Get new shoes','People keep making fun of me','2024-03-08 00:06:00','normal',8,'The shoe store'),
(70,'Number 1','By midterm, you should have 8-10 features working in your project.','2024-03-08 00:06:00','normal',8,'Midterm'),
(71,'Number 2','System Requirements tables FURPS','2024-03-08 00:07:00','normal',8,'Midterm'),
(72,'Number 3','Two use case tables with a description column, a table for each user, in addition to your use case diagrams (4 diagrams)','2024-03-08 00:07:00','normal',8,'Midterm'),
(73,'Number 4','Activity diagram for one of your cases','2024-03-08 00:07:00','normal',8,'Midterm'),
(74,'Bike Ride','Make sure everyone\'s bike is working and the tires are filled up!','2024-04-09 10:45:00','normal',1,'The Park'),
(76,'Get Party Supplies','Buy balloons and any additional gifts that are needed.','2024-04-11 12:00:00','normal',1,'Party Store'),
(77,'Get Birthday Cake','Make sure it isn\'t red velvet. Melpert hates it.','2024-04-12 22:00:00','important',1,'Gianni\'s Bakery'),
(78,'Melpert\'s Birthday Party','He wants a surprise party, so make sure to get the family together!','2024-04-13 12:00:00','important',1,'Home'),
(84,'Get Studies Ready','My students need to study.','2024-04-09 15:30:00','important',10,'Classroom'),
(85,'Write Exam','The exam needs to be written up','2024-04-10 11:31:00','important',10,'Office'),
(86,'Hold Class','The students need to learn.','2024-04-15 07:00:00','important',10,'Classroom'),
(87,'Hold Exam','A very important exam!','2024-04-17 06:30:00','important',10,'Classroom');
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `members`
--

DROP TABLE IF EXISTS `members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `members` (
  `memberid` int(11) NOT NULL AUTO_INCREMENT,
  `userid` int(11) NOT NULL,
  `membername` varchar(255) NOT NULL,
  `membercategory` enum('spouse','child','other','friend') DEFAULT NULL,
  PRIMARY KEY (`memberid`),
  KEY `userid` (`userid`),
  CONSTRAINT `members_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `members`
--

LOCK TABLES `members` WRITE;
/*!40000 ALTER TABLE `members` DISABLE KEYS */;
INSERT INTO `members` VALUES
(1,1,'Kyle','spouse'),
(2,1,'Kevin','other'),
(6,4,'Heather','spouse'),
(7,4,'Hubert','friend'),
(9,1,'Melpert','child'),
(13,3,'Jane Doe','spouse'),
(14,3,'Jim Doe','child'),
(15,3,'Gerome','other'),
(16,7,'Link','friend'),
(17,7,'Zelda','friend'),
(18,7,'Ganondorf','friend');
/*!40000 ALTER TABLE `members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plannerevents`
--

DROP TABLE IF EXISTS `plannerevents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `plannerevents` (
  `eventid` int(11) NOT NULL,
  `plannerid` int(11) NOT NULL,
  PRIMARY KEY (`eventid`,`plannerid`),
  KEY `plannerid` (`plannerid`),
  CONSTRAINT `plannerevents_ibfk_1` FOREIGN KEY (`eventid`) REFERENCES `events` (`eventid`),
  CONSTRAINT `plannerevents_ibfk_2` FOREIGN KEY (`plannerid`) REFERENCES `planners` (`plannerid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plannerevents`
--

LOCK TABLES `plannerevents` WRITE;
/*!40000 ALTER TABLE `plannerevents` DISABLE KEYS */;
INSERT INTO `plannerevents` VALUES
(76,2),
(77,2),
(78,2),
(43,4),
(47,4),
(74,4),
(49,5),
(50,5),
(51,5),
(52,5),
(53,5),
(54,6),
(55,6),
(56,6),
(59,7),
(61,7),
(62,7),
(70,8),
(71,8),
(72,8),
(73,8),
(64,9),
(65,9),
(66,9),
(84,10),
(85,10),
(86,10),
(85,11),
(87,11),
(46,12),
(74,12);
/*!40000 ALTER TABLE `plannerevents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `planners`
--

DROP TABLE IF EXISTS `planners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `planners` (
  `plannerid` int(11) NOT NULL AUTO_INCREMENT,
  `userid` int(11) NOT NULL,
  `plannername` varchar(255) DEFAULT NULL,
  `plannerdesc` varchar(255) DEFAULT NULL,
  `plannertheme` enum('Normal','Vacation','Birthday','Family Event','Work','Sports','School') DEFAULT NULL,
  PRIMARY KEY (`plannerid`),
  KEY `userid` (`userid`),
  CONSTRAINT `planners_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `planners`
--

LOCK TABLES `planners` WRITE;
/*!40000 ALTER TABLE `planners` DISABLE KEYS */;
INSERT INTO `planners` VALUES
(2,1,'Birthday Plans','For Melpert.','Birthday'),
(4,1,'Spring Activities','Activities we\'ll do to celebrate spring!','Family Event'),
(5,7,'Secret Room Stuff','Need to make my secret room.','Work'),
(6,3,'Generic Events','They\'re generic.','Normal'),
(7,4,'Planner Stuff','Stuff relating to the planner.','Work'),
(8,8,'Number Events','The least vauge events I can think of.','Normal'),
(9,9,'Head related Events','Gotta keep up my egg shaped head.','Normal'),
(10,10,'School Related Activities','What it says on the tin.','Normal'),
(11,10,'Exam Activities','What it says on the tin, again.','School'),
(12,1,'Outdoor Activities','Activities that are held not inside.','Sports');
/*!40000 ALTER TABLE `planners` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subusers`
--

DROP TABLE IF EXISTS `subusers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `subusers` (
  `userid` int(11) NOT NULL,
  `subuserid` int(11) NOT NULL AUTO_INCREMENT,
  `subusername` varchar(255) NOT NULL,
  `subusertype` enum('Adult','Child','Relative','Friend') DEFAULT NULL,
  PRIMARY KEY (`subuserid`),
  KEY `userid` (`userid`),
  CONSTRAINT `subusers_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subusers`
--

LOCK TABLES `subusers` WRITE;
/*!40000 ALTER TABLE `subusers` DISABLE KEYS */;
INSERT INTO `subusers` VALUES
(1,1,'Teresa','Adult'),
(1,2,'Kevin','Child'),
(1,3,'Aiden','Friend'),
(2,9,'Ted','Adult'),
(7,10,'Chris Houlihan','Adult'),
(3,11,'John Doe','Adult'),
(4,12,'George','Adult'),
(5,13,'Andrew','Adult'),
(6,14,'Billy Bob','Adult'),
(8,15,'Daniel','Adult'),
(9,16,'Eggbert the Egghead','Adult'),
(10,17,'Professor Levi','Adult');
/*!40000 ALTER TABLE `subusers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `userid` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`userid`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES
(1,'test','test','Teresa Ester'),
(2,'test2','test2','Ted Ester'),
(3,'john','john','John Doe'),
(4,'george','password','George'),
(5,'andrew','andrew','Andrew'),
(6,'Billy','billy','Billy Bob'),
(7,'chris','chris','Chris Houlihan'),
(8,'daniel','daniel','Daniel'),
(9,'eggbert','egghead','Eggbert the Egghead'),
(10,'levi','prof','Professor Levi');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usersubusers`
--

DROP TABLE IF EXISTS `usersubusers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usersubusers` (
  `userid` int(11) NOT NULL,
  `subuserid` int(11) NOT NULL,
  PRIMARY KEY (`userid`,`subuserid`),
  KEY `subuserid` (`subuserid`),
  CONSTRAINT `usersubusers_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`),
  CONSTRAINT `usersubusers_ibfk_2` FOREIGN KEY (`subuserid`) REFERENCES `subusers` (`subuserid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usersubusers`
--

LOCK TABLES `usersubusers` WRITE;
/*!40000 ALTER TABLE `usersubusers` DISABLE KEYS */;
INSERT INTO `usersubusers` VALUES
(1,1),
(1,2),
(1,3),
(2,9),
(7,10),
(3,11),
(4,12),
(5,13),
(6,14),
(8,15),
(9,16),
(10,17);
/*!40000 ALTER TABLE `usersubusers` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-04-09 21:24:28
