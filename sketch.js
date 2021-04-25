/*Lalima Bhola
Project 4: "Jellyfish Mania"
This game works by the user first pressing 's' on the start screen to start the game, in which case a credit screen appears with instructions on how to play (and the credits), then the user proceeds to play until time is up. Then they can restart the game.

CREDITS:
All graphics were created by Lalima Bhola using Adobe Illustrator and Adobe Photoshop. References for states of the game can be found at this link: https://editor.p5js.org/ehersh/sketches/Hk52gNXR7. Reference for the game timer can be found at this link: https://editor.p5js.org/marynotari/sketches/S1T2ZTMp- Reference to sprite implementation is found at this link: https://creative-coding.decontextualize.com/making-games-with-p5-play/
*/


var b = []; //holds bubbles
var numBubbles = 8; //number of bubbles on screen at a time

var start = 0; //initialize start variable to 0
var scoreCounter = 0; //initialize score counter to 0
var numStrikes = 5; //initialize number of strikes
var timerVal = 60; //set time to 60 seconds

var c1, c2; //background colors
var turtleImg, turtleSpr; //turtle images into a gif
var algaeImg; //holds static algae

var boatImg, boatSpr; //boat images into a gif
var boatX = 140; //set x coordinate
var boatY = 55; //set y coordinate

var jellyfish; //group of sprites
var jellyImg, jellySpr; //jellyfish images into a gif 
var jellyNum = 40; //set number of jellyfish on screen

var plasticImg; //image of plastic bag
var plasticGroup; //sprite group of plastic bags
var plasticNum = 10; // number of plastic bags

var eat; //"invisible" sprite for eating jellyfish

function preload() {
  jellyImg = loadAnimation("Jellyfish0.png", "Jellyfish1.png", "Jellyfish2.png"); //load each frame of the gif
  turtleImg = loadAnimation("Turtle0.png", "Turtle1.png", "Turtle2.png"); //load each frame of the gif
  boatImg = loadAnimation("Boat1.png", "Boat2.png", "Boat3.png", "Boat4.png", "Boat5.png", "Boat6.png", "Boat7.png", "Boat8.png"); //load each frame of the gif
  plasticImg = loadImage('PlasticBag.png');
}



function setup() {
  createCanvas(850, 650);

  textFont("Coiny"); //bubbly font applied to all text

  c1 = color(115, 224, 255); //color on top of canvas
  c2 = color(16, 146, 179); //color on bottom of canvas

  jellyfish = new Group(); //group of jellyfish sprites

  /*draws instances of jellyfish at random sizes (adds to jellyfish sprite group)*/
  for (var i = 0; i < jellyNum; i++) {
    jellySpr = createSprite(random(width), random(100, height - 50), random(5, 10), random(5, 10));
    jellyfish.frameDelay = 50; //10.5;
    jellySpr.addAnimation("default", jellyImg); //adding jellyfish gif to each sprite in the group through the loadAnimation() in preload() function
    jellySpr.scale = random(0.22, 0.42); //random size between 2 values
    jellyfish.add(jellySpr);
  }

  plasticGroup = new Group(); //group of plastic bags

  /*add static plastic bag to sprite group*/
  for (var p = 0; p < plasticNum; p++) {
    var plasticSpr = createSprite(random(width), random(80, height - 80), random(25, 100), random(25, 100));
    plasticGroup.frameDelay = 50;
    plasticSpr.scale = 0.35; //shrink size
    plasticSpr.addAnimation("default", plasticImg); //add plastic bag image to each sprite in the group using loadImage() from preload() function
    plasticGroup.add(plasticSpr);
  }

  eat = createSprite(1, 1, mouseX, mouseY); //create sprite for the turtle's mouth

  turtleSpr = createSprite(width / 2, height / 2); //create turtle sprite
  turtleImg.frameDelay = 9; //10.5;  //slow rate of image
  turtleSpr.scale = 0.95; //scale down the turtle
  turtleSpr.addAnimation("bubbly", turtleImg); //add animation from the 3 pictures for the turtle

  boatSpr = createSprite(boatX, boatY); //set boat at these coordinates
  boatImg.frameDelay = 9; //change frame rate of boat gif
  boatSpr.addAnimation("default", boatImg); //add animations from the instances of the boat images

  algaeImg = loadImage('Algae.png'); //image is loaded into the variable  //algae image loaded into variable

  for (var bub = 0; bub < numBubbles; bub++) { //add to array of bubbles
    b[bub] = new Bubbles(random(height), random(200), color(231, 252, 255), 3);
  }
}



function draw() {
  if (start == 0) {
    titleScreen(); //start screen with title and option to either start the game, view instructions, or view credits
  }
}



function gameScreen() {
  push();
  setGradient(c1, c2); //create gradient for background, needs to be in draw() and not setup() because it redraws after every new feature

  image(algaeImg, 0, height - 290, width, 305); //algae drawn before turtle and jellyfish

  /*Printing time to the screen*/
  // textStyle(BOLD);
  textSize(28);
  strokeWeight(4);
  stroke(0);

  /*data for the game output to screen*/
  text("Time left: " + timerVal + " seconds", 157, height - 15);
  text("Jellyfish caught: " + scoreCounter, 145, height - 50);
  text("Strikes: " + numStrikes, width - 85, height - 15);

  /*have timer count down*/
  if (frameCount % 15 == 0 && timerVal > 0) { // accurate to actual seconds; stops at 0
    timerVal--;
  }

  /*needs to go before drawSprites() function*/
  eat.overlap(plasticGroup, strike); //call strike() function when the mouth overlaps a plastic bag
  eat.overlap(jellyfish, jellyGone); //call jellyGone() function when mouth overlaps a jellyfish

  drawSprites();

  /*set location of turtle sprite relative to mouse x and y*/
  turtleSpr.position.x = mouseX + 110;
  turtleSpr.position.y = mouseY + 40;

  /*set location of invisible sprite to mouse x and y*/
  eat.position.x = mouseX;
  eat.position.y = mouseY;


  /*moving sprite group of jellyfish*/
  for (var i = 0; i < jellyfish.length; i++) {
    jellyfish[i].position.x += jellyfish[i].width * 0.04/*0.009*/;  //faster speed than 0.009
    if (jellyfish[i].position.x > width + 65) {
      jellyfish[i].position.x = -75;
      jellyfish[i].position.y = random(100, height - 100); //randomizes the height the jellyfish is brought back on the screen
    }
  }

  boatSpr.position.x = boatX++; //move the boat to the right
  if (boatX > width + 105) { //when the boat exceeds the canvas...
    boatX = -145; //loop back
  }

  /*have the plastic bags rotate and move to the right*/
  for (var p = 0; p < plasticGroup.length; p++) {
    plasticGroup[p].position.x += plasticGroup[p].width * 0.04;  //this number can be changed to alter the speed of the plastic bags
    plasticGroup[p].rotation -= random(3);
    if (plasticGroup[p].position.x > width + 50) { //when they exceed the canvas, loop back around
      plasticGroup[p].position.x = -40;
      plasticGroup[p].position.y = random(50, height - 100); //randomizes the height the plastic bag is brought back onto the screen
    }
  }

  for (var add = 0; add < numBubbles; add++) { //draws bubbles on the canvas for the specified number n
    b[add].display(); //calls display function from Bubbles class
    b[add].move(); //calls move function from Bubbles class
  }

  /*when timer is up, call endScreen()*/
  if (timerVal == 0 || numStrikes == 0) {
    endScreen(scoreCounter, numStrikes, timerVal); //pass counter, strikes, and time as parameters
  }
  pop();
}




/*Displays the title of the game & choice on playing the game right away or viewing instructions first (along with credit screen)*/
function titleScreen() {
  push();
  background(141, 115, 255);
  fill(255);
  textAlign(CENTER);
  textSize(50);
  textStyle(BOLD);
  text('JELLYFISH MANIA', width / 2, (height / 2) - 40);
  textStyle(NORMAL);
  textSize(25);
  text("Press 's' to start game", width / 2, height / 2 + 10);
  text("Press 'i' to view instructions", width / 2, height / 2 + 50);
  text("Press 'c' to view credits", width / 2, height / 2 + 90);

  if (key == 's') {
    gameScreen();
  } else if (key == 'i') {
    instructionScreen();
  } else if (key == 'c') {
    creditScreen();
  }
  pop();
}




/*Displays instructions on how to play*/
function instructionScreen() {
  push();
  background(241, 204, 255);
  fill(0, 8, 61);
  textAlign(CENTER);
  textSize(30);
  textStyle(BOLD);
  text('Instructions:', width / 2, (height / 2) - 140);
  textStyle(NORMAL);
  textSize(25);
  text('A timer will start, giving you 60 seconds to play the game.', width / 2, (height / 2) - 100); //height decreases down the canvas
  text('You control a turtle using the mouse and have the turtle', width / 2, (height / 2) - 70);
  text('eat jellyfish by hovering over them. The goal of this', width / 2, (height / 2) - 40);
  text('game is to eat the most jellyfish in the allotted time.', width / 2, (height / 2) - 10);
  text('If you eat 5 plastic bags, you lose the game.', width / 2, (height / 2) + 20);

  textStyle(ITALIC);
  textSize(22);
  text("If you want to quit the game while in progress, press 'q'", width / 2, (height / 2) + 75);

  textSize(25);
  textStyle(BOLD);
  text("Press 'e' to exit and return to start screen", width / 2, height / 2 + 140);

  if (key == 'e') { //if 'e' is selected, then jump back to the titleScreen
    titleScreen();
  }
  pop();
}





/*gives credit to all references*/
function creditScreen() {
  push();
  background(207, 244, 255);
  fill(0, 8, 61);
  textAlign(CENTER);
  textSize(30);
  textStyle(BOLD);
  text('Credits:', width / 2, (height / 2) - 150);
  textStyle(ITALIC);
  textSize(20);
  text('All graphics were created by Lalima Bhola using Adobe Illustrator', width / 2, (height / 2) - 100); //height decreases as it goes down the canvas
  text('and Adobe Photoshop. References for states of the game can be found', width / 2, (height / 2) - 70);
  text('at this link: https://editor.p5js.org/ehersh/sketches/Hk52gNXR7', width / 2, (height / 2) - 40);
  text('Reference for the game timer can be found at this link:', width / 2, (height / 2) - 10);
  text('https://editor.p5js.org/marynotari/sketches/S1T2ZTMp-', width / 2, (height / 2) + 20);
  text('Reference to sprite implementation is found at this link:', width / 2, (height / 2) + 50);
  text('https://creative-coding.decontextualize.com/making-games-with-p5-play/', width / 2, (height / 2) + 80);
  textStyle(BOLD);
  textSize(25);
  text("Press 'e' to exit and return to start screen", width / 2, height / 2 + 150);

  if (key == 'e') { //press 'e' to jump back to the title screen
    titleScreen();
  }
  pop();
}




/*after the time is up OR strikes were reached, end the game and display stats*/
function endScreen(score, strikeNum, timeRem) {
  push();
  fill(255);
  stroke(0);
  strokeWeight(4);

  if (timeRem == 0) { //if the game ended when time was up:
    textAlign(CENTER);
    textSize(60);
    // textStyle(BOLD);
    text("You have caught " + score + " fish", width / 2, (height / 2));
  } else if (strikeNum == 0) { //if the game ended when the user ran out of strikes:
    textAlign(CENTER);
    textSize(70);
    // textStyle(BOLD);
    text("YOU LOST", width / 2, (height / 2));
    textSize(50);
    text("You have run out of strikes", width / 2, (height / 2) + 50);
  } else if (timeRem == 0 && strikeNum == 0) { //if the game ended when both the user ran out of time and strikes:
    textAlign(CENTER);
    textSize(60);
    // textStyle(BOLD);
    text("You ran out of strikes as the game ended", width / 2, (height / 2));
    text("You have caught " + score + " fish", width / 2, (height / 2) + 40);
  }

  textSize(30);
  // textStyle(BOLD);
  text("Press 'y' to return to the start screen", width / 2, (height / 2) + 90);

  noLoop(); //stop the screen
  pop();
}




function strike(eat, plasticGroup) { //function to be called when the turtle eats a plastic bag  
  plasticGroup.position.x -= (width - 20);
  numStrikes--; //decrease strike counter
}

function jellyGone(eat, jellyfish) { //function to be called when the turtle eats a jellyfish
  jellyfish.position.x -= (width - 20);
  scoreCounter++; //increase counter by 1
}



function keyPressed() {
  if (key === 'y') {
    scoreCounter = 0; //reset counter when mouse is pressed
    numStrikes = 5; //reset number of strikes
    timerVal = 60; //reset time left in game
    loop(); //start the game again
  }
}



function setGradient(col1, col2) { //***NOTE: called from the gameScreen() function, NOT the setup() function
  push();
  noFill();
  for (var y = 0; y < height; y++) { //for the height of the canvas
    var inter = map(y, 0, height, 0, 1); //map function 
    var c = lerpColor(col1, col2, inter); //pre-set function
    stroke(c);
    line(0, y, width, y);
  }
  pop();
}
