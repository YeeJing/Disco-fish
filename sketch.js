//tutorials:https://molleindustria.github.io/p5.play/examples/index.html?fileName=collisions.js
//tutorials:https://molleindustria.github.io/p5.play/examples/index.html?fileName=camera.js
//tutorials:https://molleindustria.github.io/p5.play/examples/index.html?fileName=collisions2.js
//textbox tutorial:https://p5js.org/examples/typography-words.html

//images from parts of Calder's art

//virtual camera move the mouse around
//the sprite follows the mouse but appears at the center of the sketch
var fish;
var house;
var bg;
var obstacle;
var frame;
var redball;
var blueball;
var yellowball;
var textbox;
var textfont;
var moon;
var tri;
var index;
var blackball;

//the scene is twice the size of the canvas
var SCENE_W = 2400;
var SCENE_H = 1200;
var scenery;
var c;

let x = 1;
let y = 1;
let easing = 0.05;

function preload() {
  soundFormats('mp3', 'ogg');
  //sound from https://www.youtube.com/watch?v=QMFICm6Yyxw
  mySound = loadSound('sound/calder.mp3');

}

function setup() {
  c = createCanvas(800, 400);
  mySound.setVolume(0);
  mySound.play()

  //redball
  redball = createSprite(500, 500);
  redball.addImage(loadImage('image/red.png'));
  redball.setCollider('circle', 0, 0, 90);

  //blueball
  blueball = createSprite(500, 900);
  blueball.addImage(loadImage('image/blue.png'));
  blueball.setCollider('circle', 0, 0, 40);

  //yellowball
  yellowball = createSprite(200, 900);
  yellowball.addImage(loadImage('image/yellow.png'));
  yellowball.setCollider('circle', 0, 0, 70);

  //blackball
  blackball = createSprite(1800, 300);
  blackball.addImage(loadImage('image/black.png'));
  blackball.setCollider('circle', 0, 0, 130);

  //index
  index = createSprite(700, 115);
  index.addImage(loadImage('image/index.png'));
  index.setCollider('circle', 0, 0, 70);

  //triangle
  tri = createSprite(900, 1000);
  tri.addImage(loadImage('image/tri.png'));
  tri.setCollider('circle', -10, 20, 100);

  //moon
  moon = createSprite(800, 300);
  moon.addImage(loadImage('image/moon.png'));
  moon.setCollider('circle', 0, 0, 70);

  //create a sprite and add the 3 animations
  fish = createSprite(400, 200, 50, 100);
  scenery = loadImage('image/bg.png');

  var myAnimation = fish.addAnimation('floating', 'image/fish_0.png', 'image/fish_1.png', 'image/fish_2.png', 'image/fish_3.png', 'image/fish_4.png', 'image/fish_5.png', 'image/fish_6.png', 'image/fish_7.png');
  //slow down animation 
  myAnimation.frameDelay = 7;
  //set collider
  fish.setCollider('rectangle', 0, 10, 180, 140);

  //house
  house = loadImage('image/house.png');

  //text box and font
  textbox = loadImage("image.tsxtbox.png");
  textfont = loadFont("font/Oswald-VariableFont:wght.ttf");
  textSize(20);

  obstacle = new Group();

  //create some background for visual reference
  for (var i = 0; i < 5; i++) {
    //create a sprite and add the 3 animations
    var shell = createSprite(random(-width, SCENE_W + width), random(-height, SCENE_H + height));
    //cycles through shells 0 1 2
    shell.addAnimation('normal', 'image/shell' + i % 3 + '.png');
    obstacle.add(shell);
    shell.setCollider('circle', 0, 0, 10);
  }

  frame = loadImage('assets/frame.png');
}

function draw() {
  background(167, 248, 237);
  image(scenery, -width, -height, 4000, 2000);

  let targetX = mouseX;
  let dx = targetX - x;
  fish.velocity.x = (camera.mouseX - fish.position.x) * easing;

  let targetY = mouseY;
  let dy = targetY - y;
  fish.velocity.y = (camera.mouseY - fish.position.y) * easing;

  //collider
  fish.displace(redball);
  fish.displace(blueball);
  fish.displace(yellowball);
  fish.displace(blackball);
  fish.displace(tri);
  fish.displace(index);

  //different colourballs can push each other
  blueball.displace(redball);
  blueball.displace(yellowball);

  redball.displace(blueball);
  redball.bounce(yellowball);

  yellowball.displace(redball);
  yellowball.displace(blueball);

  //the fish will be blocked by the obstacles
  fish.collide(obstacle);


  //a camera is created automatically at the beginning
  //.5 zoom is zooming out (50% of the normal size)
  if (mouseIsPressed)
    camera.zoom = 0.4;
  else
    camera.zoom = 0.7;

  //set the camera position to the fish position
  camera.position.x = fish.position.x - 10;
  camera.position.y = fish.position.y;

  //limit the fish movements
  if (fish.position.x < 0)
    fish.position.x = 0;
  if (fish.position.y < 0)
    fish.position.y = 0;
  if (fish.position.x > SCENE_W)
    fish.position.x = SCENE_W;
  if (fish.position.y > SCENE_H)
    fish.position.y = SCENE_H;

  //shadows
  noStroke();
  fill(0, 0, 0, 80);
  ellipse(fish.position.x, fish.position.y + 80, 120, 30);
  //character on the top
  drawSprites();
  drawSprites(bg);
  drawSprite(fish);

  //text
  textAlign(RIGHT);
  drawWords(fish.position.x + 200, fish.position.y - 250);

  image(house, 430, -height / 4, 700, 500);

  camera.off();
  image(frame, 0, 0);
}

function drawWords(x, y) {
  fill(0);
  textStyle(BOLD);
  text('Welcome!', x, y);
  textStyle(NORMAL);
  text('Push things to the sandpit to build your Calder inspired art', x, y + 30);
  text('Press S to save your artwork!', x, y + 60);
}


function keyPressed() {
  if (key === 's') {
    saveCanvas(c, 'myCanvas', 'jpg');
  }
}