# Project Title

Ayakashi Ghost Guild ~Fantasy~
—- A free puzzle solving card game

## Getting Started

1.Unzip the file and use terminal commands to direct to the directory of this file.
2.Command "ionic serve" within the file to run the project
Note: This project is also accessible using Xcode (IOS simulator) or an android simulator.

### Prerequisites and Installations

Have Node.js, Ionic, ngCordova installed in your computer.
An instruction can be found on the website: http://ionicframework.com/getting-started/

## Running the tests

Sample tests should access views of the app, but automatic test is unavailable by now.
Steps to test the views:

1. Testing Slideboxes:
	The Slideboxes provides an introduction of the main functions and displaying some game playing methods.
	This function will appear before the user starts to play the game.
2. Testing Login system:
  This version provides each user functionalities in logging in to the game as individuals.
  Their account information will be stored separately corresponding to their rewards they got during the process of exploring the game.
3. Testing Tabs:
  There are five tabs which link to different views under the "/template/.." directory
   	         homePage.html, Explore.html, Collection.html, Gacha.html, Setting.html
             They are correspondingly related to five main features of the project.
4. Testing Side-menu in the index.html: There are four list-items inside the side-menu, each list-item has a link to different pages which are intro.html, signup.html, login.html, homePage.html.
5. Testing views linked to Explore.html: Completed data available for Question1.html.
6. Testing different settings: The setting page allows users to set their Gender, Birthday, and Nickname.

## Built With

* Ionic
* AngularJS
* CSS

## Version Notes:

Version 1.1

Added features for data security by establishing structured database using firebase in order to serve individual users.
Added default data including user's information on life, star, and energy points, and also personal icons.
Completed dataset for world number 1 and added results for exploring different worlds.
Developed a view for collecting the card that user has collected.
Created associated buttons for Gacha and Setting functions.
Adjusted the content and the location of the side bar.

## Incomplete Issues:

 1. Incomplete relationships between the reward from Explore and the card information from Collection and the cards optioned from Gacha
 2. Incomplete datasets for exploring locations other than world number 1.
 3. Lack of updating functions associated with Nickname, Birthday, and Gender information under the setting page for different users.
 4. Lack of function music plugin.
 5. Incomplete descriptions corresponding to each card.
 6. Incomplete link for "About Us", "Like us on Facebook".
 7. Incomplete functional buttons for gacha methods.


## Authors

Group 6:
Yang Wei

Mengqi Lin

##Support Devices

IOS phone/
Android phone

