-- MySQL dump 10.13  Distrib 8.0.20, for Win64 (x86_64)
--
-- Host: localhost    Database: vacation_lover
-- ------------------------------------------------------
-- Server version	8.0.20

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `favorite_vacations`
--

DROP TABLE IF EXISTS `favorite_vacations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favorite_vacations` (
  `user_token` int NOT NULL,
  `vacation_id` int NOT NULL,
  PRIMARY KEY (`user_token`,`vacation_id`),
  KEY `user_token_idx` (`user_token`,`vacation_id`),
  KEY `vacation_id_idx` (`vacation_id`),
  CONSTRAINT `users_id` FOREIGN KEY (`user_token`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `vacation_id` FOREIGN KEY (`vacation_id`) REFERENCES `vacations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favorite_vacations`
--

LOCK TABLES `favorite_vacations` WRITE;
/*!40000 ALTER TABLE `favorite_vacations` DISABLE KEYS */;
INSERT INTO `favorite_vacations` VALUES (23,1),(24,1),(25,1),(39,1),(40,1),(41,1),(43,1),(23,2),(24,2),(23,3),(24,3),(25,3),(23,4),(39,4),(23,5),(41,5),(23,6),(24,6),(25,6),(39,6),(41,6),(23,7),(23,8),(24,8),(39,8),(40,8),(43,8);
/*!40000 ALTER TABLE `favorite_vacations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(25) DEFAULT NULL,
  `password` varchar(45) DEFAULT NULL,
  `type` varchar(10) DEFAULT NULL,
  `first_name` varchar(12) DEFAULT NULL,
  `last_name` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (22,'Admin@Admin.com','766342084f4872910acc23a16dcf14c1','Admin','Admin','Cohen'),(23,'leon@gmail.com','766342084f4872910acc23a16dcf14c1','User','Leon','Karpov'),(24,'shauli@gmail.com','766342084f4872910acc23a16dcf14c1','User','Shauli','or shaul'),(25,'shmulik@gmail.com','766342084f4872910acc23a16dcf14c1','User','Shmulik','gatzki'),(39,'Shauuli@gmail.com','766342084f4872910acc23a16dcf14c1','User','Shaaaauli','shaul'),(40,'Shauuuli@gmail.com','766342084f4872910acc23a16dcf14c1','User','Shaaaauli','shaul'),(41,'mmm@mmm.com','766342084f4872910acc23a16dcf14c1','User','mmm','mmm'),(43,'LEONKARPOV4139@GMAIL.COM','766342084f4872910acc23a16dcf14c1','User','Leon','Karpov'),(47,'avi@gmail.com','766342084f4872910acc23a16dcf14c1','User','Avi','Edri'),(48,'arielcohen961@gmail.com','766342084f4872910acc23a16dcf14c1','User','Ariel','cohen'),(49,'shalom@gmail.com','766342084f4872910acc23a16dcf14c1','User','shalom','gibor'),(50,'shalomolam@gmail.com','766342084f4872910acc23a16dcf14c1','User','shalom','hagibor');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vacations`
--

DROP TABLE IF EXISTS `vacations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vacations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `description` varchar(1200) DEFAULT NULL,
  `destination` varchar(45) DEFAULT NULL,
  `image` varchar(500) DEFAULT NULL,
  `starting` varchar(60) DEFAULT NULL,
  `ending` varchar(60) DEFAULT NULL,
  `price` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vacations`
--

LOCK TABLES `vacations` WRITE;
/*!40000 ALTER TABLE `vacations` DISABLE KEYS */;
INSERT INTO `vacations` VALUES (1,'Wherever you step in Greece, you’re treading gloriously historic ground—right in the footsteps of the Minoans, the Ancient Greeks, and other astonishing cultures. Even at a trendy café in Athens or a bustling restaurant in Thessaloniki, the tremendous energy of Greece’s history is palpable. Tourist attractions are many and varied, and include the Acropolis of Athens, the Mycenae Lion Gate, and majestic Mount Olympus—abode of the gods. The Greek Islands, meanwhile, are a destination in and of themselves—internationally renowned for their gleaming beaches and exuberant nightlife. Cruising the sparkling Mediterranean amid these archipelagos introduces you to some of Europe’s most transcendent scenery.','GREECE','1604415463589-image_processing20181012-4-1el46o4.jpg','10/3/2010','26/3/2020',299),(2,'Did you know you can see the bright lights of Las Vegas from space?\n\nIt\'s true. The lights of the Las Vegas Strip are a shining beacon, determined to remind us of its status among the elite global entertainment meccas of the world. From elaborate resorts, sprawling golf courses, world-class entertainment, non-stop gaming, high-end shopping, and cuisine from every place in between, Las Vegas has something for everyone.','LAS VEGAS','1604404054867-The_Strip_LD_t1024.jpg','18/10/2020','24/10/2020',402),(3,'\nVancouver is a coastal city in the lower mainland of British Columbia, between the Burrard Inlet to the north and the Fraser River to the south. It is surrounded by water on three sides and is nestled alongside the Coastal Mountain Range, which dominates the cityscape. This largest metropolitan area in Western Canada is a thriving urban center surrounded by stunning natural beauty. Vancouver is ethnically and linguistically diverse and is famed for its Chinese culture with a third of its inhabitants of Chinese origin. Port Metro Vancouver is the busiest and largest in Canada and the fourth largest in North America. Forestry is the largest industry in Vancouver, with tourism being a close second. Interestingly, Vancouver has been nicknamed \"Hollywood North\" because it is the third largest film production center in North America.','VANCOUVER','1604404104765-Vancouver Vacation Packages.jpg','20/10/2020','5/11/1989',399),(4,'The city with a beautiful bay, famous red bridge and infamous fog welcomes you to enjoy art, history, shopping and outdoor activities. San Francisco is simultaneously romantic, exciting, relaxing and intriguing. Rent a bike, walk, ride the trolley or drive to fascinating destinations. Tour San Francisco Bay by boat for unique views from beneath Golden Gate Bridge. Stop at Alcatraz Island; its former inescapable prison became famous in the film Birdman of Alcatraz.','SAN FRANCISCO','1604404178638-www.usnews.jpg','11/10/2020','18/10/2020',599),(5,'There are endless things to do in New York City. This globally recognized city is home to some of the world’s most recognizable landmarks, most respected museums, and activities that will interest any visitor. Sightseeing, art museums, Broadway plays, cuisine from around the world, unparalleled fashion districts, and unique historic attractions make New York City the perfect destination for a cultural vacation package','NEW YORK','1604404460357-4th-of-july-nyc-600.jpg','20/10/2020','20/11/2029',399),(6,'Barcelona is one of those mythic cities people never forget visiting when on their Spain vacation. Like Paris or Venice, its name takes on a certain level of whimsy, perhaps fitting for the city of artists including Picasso, Dali, and of course architect Antoni Gaudi. Barcelona is both Spanish and a world apart from Spain, the capital of fiercely independent Catalonia, yet also an urbane crossroads for the world. It can also be a little overwhelming if you’re not sure what to see first. Here are four top days designed to help you get the most out of Barcelona in limited time.','BARCELONA','1604774825271-Park-Guell-in-Barcelona-Spain.jpg','28/01/2021','05/02/2021',499),(7,'Once the country’s first line of defence against invaders, the English coastline these days is a peaceful place where locals and visitors can enjoy more tranquil pursuits. Taking a bracing walk on a windswept pier, eating delicious fish and chips, searching for marine life in rockpools, finding fossils in ancient cliffs, building sandcastles and dolphin-spotting on picturesque beaches are just some of the activities offered by the English seaside. In 2020, indulging in these activities and more will be a whole lot easier as new sections of the England Coast Path continue to open. Once complete, at almost 3000 miles, the path will be the longest continuous trail of its kind in the world, granting access to the country’s entire coastline for the first time.','ENGLAND','1604775253534-England_shutterstockRF_222790018.jpg','02/01/2021','15/01/2020',399),(8,'Costa Rica flies the flag for sustainable tourism. This small country’s vast biodiversity attracts visitors keen to spot sleepy sloths in trees, red-eyed frogs paralysing their predators, and whales in the Pacific. Costa Ricans understand the importance of preserving their slice of tropical paradise and have found a way to invite others in while living in harmony with their neighbours – from leafcutter ants to jaguars. Ninety percent of the country’s energy is created by renewable sources, and it could become one of the first carbon-neutral countries in 2020. Adventure lovers can hike volcanoes or ride a zip line, while those craving ‘me time’ can enjoy yoga retreats and spa experiences. The catchphrase pura vida (pure life) is more than a saying, it’s a way of life.','COSTA RICA','1604775400750-Costa_Rica_GettyRF_160544345.jpg','12/12/2020','18/12/2020',159);
/*!40000 ALTER TABLE `vacations` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-11-21 16:59:15
