var PLAY = 1; 
var END = 0;
var gameState=PLAY;
var level=1;

//game1 variables
var score1;
var vaccineGroup, enemyGroup;
var gameOver, reset; 
var player

var vaccineImg, playerImg, enemyImg, gameOverImg, resetImg;

//game2 variables
var girl;
var ground;
var topObstaclesGroup, bottomObstaclesGroup;
var topObstacleImg, bottomObstacleImg;
var girlFighterImg;
var score2;

//game3 variables
const Engine = Matter.Engine;
const World= Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;

var engine, world;
var backgroundImg,platform;
var bird, slingshot;

var gameState2 = "onSling";
var score3 = 0;

function preload(){
  //game1 preload
  vaccineImg = loadImage("IMGS/Vaccine.png");
  playerImg = loadImage("IMGS/Girl_Player.png");
  enemyImg = loadImage("IMGS/Enemy.jpg");

  gameOverImg = loadImage("IMGS/GameOver.png");
  resetImg = loadImage("IMGS/restart.png");

  //game2 preload
  bottomObstacleImg = loadImage("flap_hum_imgs/Pointy_Up_Bar.png");
  topObstacleImg = loadImage("flap_hum_imgs/Pointy_Down_Bar.png");
  girlFighterImg = loadImage("flap_hum_imgs/Girl_Fighter.png");

  //game3 preload
  getBackgroundImg();
}

function setup() {
  createCanvas(1200,450)

  //game1 setup
  score1 = 0;
  vaccineGroup = createGroup();
  enemyGroup = createGroup();

  player = createSprite(200,200,20,20)
  player.addImage(playerImg);
  player.scale = 0.25;
  player.visible=false;


  gameOver = createSprite(300,300);
  gameOver.addImage(gameOverImg);
  gameOverImg.scale = 0.1;
  gameOver.visible = false;

  reset = createSprite(300,400);
  reset.addImage(resetImg);
  reset.scale = 0.5;
  reset.visible = false;

  //game2 setup
  girl = createSprite(200,200,30,30);
  girl.addImage(girlFighterImg);
  girl.scale = 0.25;
  girl.visible=false;

  ground = createSprite(600,450,2400,20);
  ground.x = ground.width/2;
  ground.velocityX = -6;
  ground.visible=false;
  topObstaclesGroup = new Group();
  bottomObstaclesGroup = new Group();

  score2 = 0;  
  
  
  //game3 setup
  engine = Engine.create();
  world = engine.world;

  ground = new Ground(600,height,1200,20);
  platform = new Ground(150, 305, 300, 170);

  box1 = new Box(700,320,70,70);
  box2 = new Box(920,320,70,70);
  pig1 = new Pig(810, 350);
  log1 = new Log(810,260,300, PI/2);

  box3 = new Box(700,240,70,70);
  box4 = new Box(920,240,70,70);
  pig3 = new Pig(810, 220);

  log3 =  new Log(810,180,300, PI/2);

  box5 = new Box(810,160,70,70);
  log4 = new Log(760,120,150, PI/7);
  log5 = new Log(870,120,150, -PI/7);

  bird = new Bird(200,50);

  slingshot = new SlingShot(bird.body,{x:200, y:50});
}

function draw() {  
  if (level ===1 ){
    game1();
  } 
  if (level ===2){
    game2();
  }
  if (level ===3){
    game3();
  }
}

//This is game1's code:
function createvaccines(){
  if (World.frameCount % 80 === 0) {
    var postion = Math.round(random(1,2));
    var vaccine = createSprite(1200, 200);
    vaccine.addImage(vaccineImg);
    vaccine.scale = 0.5;

    vaccine.y = Math.round(random(0,400));
    vaccine.lifetime = 300;
    
    if (postion === 1) {
      vaccine.x = 1200; 
      vaccine.velocityX = -(4+(score1/4));
    } else {
      if (postion === 2) {
        vaccine.x = 0;
        vaccine.velocityX = 4+(score1/4);
      }
    }

    vaccineGroup.add(vaccine);
  }
}

function createEnemy(){
  if (World.frameCount % 200 === 0) {
    var postion = Math.round(random(1,2));
    var enemy = createSprite(1200, 200);
    enemy.addImage(enemyImg);
    enemy.scale = 0.15;

    enemy.velocityX = -(4+(score1/10));
    enemy.y = Math.round(random(0,400));
    enemy.lifetime = 300;
    
    if (postion === 1) {
      enemy.x = 1200;
      enemy.velocityX = -(4+(score1/10));
    } else {
      if (postion === 2) {
        enemy.x = 0;
        enemy.velocityX = 4+(score1/10);
      }
    }
    enemyGroup.add(enemy);
  }
}

function restartGame1(){
  gameState = PLAY;
  score1 = 0;
  reset.visible = false;
  gameOver.visible = false;
  enemyGroup.destroyEach();
  vaccineGroup.destroyEach();

  show_game1_vars();
}

function game1(){
  background("lightblue");
  
  textSize(30);
  text("Score: "+ score1, 250, 100);

  if (gameState === PLAY) {
    show_game1_vars();
    createvaccines();
    createEnemy(); 
    
    player.y = World.mouseY;
    player.x = World.mouseX;
    
    if (player.isTouching(vaccineGroup)) {
      vaccineGroup.destroyEach();
      score1=score1+2;
    }
    
    if (player.isTouching(enemyGroup)) {
      gameState = END;
    }
    
    if(score1===30){
      level=level+1;
    }

  } else if (gameState === END) {
    hide_game1_vars();
    gameOver.visible = true;
    reset.visible = true;
    
    vaccineGroup.destroyEach();     
    enemyGroup.destroyEach();

    if(mousePressedOver(reset)){
      restartGame1();
    }

  }

  drawSprites();
}

function hide_game1_vars(){  
  score1.visible = false;
  player.visible = false;
}

function show_game1_vars(){  
  score1.visible = true;
  player.visible = true;
}


//This is game2's code:
function spawnObstacles(){
  if(frameCount % 60 === 0){
    var rand1 = Math.round(random(0,100));
    var rand2 = rand1 + 350;
    
    var topObstacle = createSprite(1200,rand1,45,100);
    topObstacle.addImage(topObstacleImg);
    topObstacle.scale = 0.5;

    var bottomObstacle = createSprite(1200,rand2,45,100);
    bottomObstacle.addImage(bottomObstacleImg);
    bottomObstacle.scale = 0.5;

    topObstacle.velocityX = -5;
    bottomObstacle.velocityX = -5;

    bottomObstacle.lifetime = 300;
    topObstacle.lifetime = 300;


    bottomObstaclesGroup.add(bottomObstacle);
    topObstaclesGroup.add(topObstacle);

    ground.depth = bottomObstacle.depth;
    ground.depth = ground.depth + 1;
  }
}

function game2(){
  background(255,255,255);  
  hide_game1_vars();
  show_game2_vars();
  if(gameState === PLAY){
    score2 = score2 + Math.round(getFrameRate()/60);

    if(keyDown(UP_ARROW)){
      girl.velocityY = -10;
    }
    
    girl.velocityY = girl.velocityY + 0.5;
  
    if(ground.x < 0){
      ground.x = ground.width/2;
    }
    
    spawnObstacles();

    if(girl.isTouching(ground) || girl.isTouching(bottomObstaclesGroup) || girl.isTouching(topObstaclesGroup)){
      gameState = END;
    }
  } else if (gameState === END){
    ground.velocityX = 0;
    girl.velocityY = 0;
    bottomObstaclesGroup.setVelocityXEach(0);
    topObstaclesGroup.setVelocityXEach(0);
    bottomObstaclesGroup.setLifetimeEach(-1);
    topObstaclesGroup.setLifetimeEach(-1);
  }

  drawSprites();

  text("Score: "+ score2, 500,50);
}

function hide_game2_vars(){
  girl.visible = false;
  ground.visible = false;
  score2.visible = false;
}

function show_game2_vars(){
  girl.visible = true;
  ground.visible = true;
  score2.visible = true;
}



//game3's code
function game3_vars(){
  if(backgroundImg)
        background(backgroundImg);
    
        noStroke();
        textSize(35)
        fill("white")
        text("Score  " + score3, width-300, 50)
    
    Engine.update(engine);
    //strokeWeight(4);
    box1.display();
    box2.display();
    ground.display();
    pig1.display();
    pig1.score3();
    log1.display();

    box3.display();
    box4.display();
    pig3.display();
    pig3.score3();
    log3.display();

    box5.display();
    log4.display();
    log5.display();

    bird.display();
    platform.display();
    //log6.display();
    slingshot.display();

    if(score3===1000){
      level=level+1;
    }
}

function mouseDragged(){
  if (gameState!=="launched"){
      Matter.Body.setPosition(bird.body, {x: mouseX , y: mouseY});
  }
}

function mouseReleased(){
  slingshot.fly();
  gameState2 = "launched";
}

function keyPressed(){
  if(keyCode === 32 && gameState2 == "launched"){
      Matter.Body.setPosition(bird.body, {x: 200, y: 50});
      slingshot.attach(bird.body);
      gameState2 = "onSling";
  }
}

async function getBackgroundImg(){
  var response = await fetch("http://worldtimeapi.org/api/timezone/Asia/Kolkata");
  var responseJSON = await response.json();

  var datetime = responseJSON.datetime;
  var hour = datetime.slice(11,13);
  
  if(hour>=0600 && hour<=1900){
      bg = "sprites/bg1.png";
  }
  else{
      bg = "sprites/bg2.jpg";
  }

  backgroundImg = loadImage(bg);
  console.log(backgroundImg);
}