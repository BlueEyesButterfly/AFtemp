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
5. Testing views linked to Explore.html: Completed data available for all 16 worlds.
6. Testing Summon function: Completed datasets and function for Normal summon and Rare summon function is now available for the users.
7. Testing collection: The collection pages records all cards that have been obtained.
7. Testing different settings: The setting page allows users to set their Gender and Nickname.
8. Testing update function: User can update their user their Gender and Nickname information.
9. Accessing extra information: The setting page allows users to access to our facebook and about us page.
10: Testing logout system: The setting page offers user opportunity to logout with their information being stored in order to login for the next time.

## Built With

* Ionic
* AngularJS
* CSS

## Version Notes:

Version 1.2

Added normal summon function which could randomly generate a card associated with this normal card set and cost user 3 points of energy.
Added rare summon function which could randomly generate a card associated with this rare card set and cost user 5 points of energy.
Added interactions between two summon functions and collection data storage. 
Added interactions between two summon functions and user energy points.
Added tables in firebase for all worlds in explore page.
Completed all the function of different worlds in explore page.
Added tables in firebase for all cards belonged to different worlds.
Completed the function of grading which could render WinACard page if all answers were right, and render youLoose page if one answer was not right.
Completed the function of WinACard page which could randomly generate a card associated with that world, and automatically created a new record in user's collections.   
Added Like us on facebook link out page.
Added About us page.
Added update function for user to update their nickname and gender in the settings.
Changed Exchange function into the collection function in order to let the user to complete different functions associate with the card they got more directly.
Verified the functional music plugin in IOS system.

## Incomplete Issues:
 
 1. Incomplete functional buttons for remaining gacha function "shop".
 2. Incomplete some constraint for dynamic user data.
 3. Incomplete Exchange function for card collected in the collection page.


## Authors

Group 6:
Yang Wei

Mengqi Lin

##Support Devices

IOS phone/
Android phone

