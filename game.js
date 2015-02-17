/*My approach to coding the Alien Attack Game in the book Foundation Game Design in HTML5 and Javascript by Rex van der Spuy. I also added some additional features, like the alien advancing when the player misses */



//image sprites
var ship;
var alien;
var bullet;

//canvas variables
var canvasSize = 400;
var canvas;

//alien x and y positions
var xpos = Math.floor(Math.random() * canvasSize);
var ypos = Math.floor(Math.random() * (canvasSize/10));

//user x and y position guesses/input
var userXpos = 0;
var userYpos = 0;

//paragraph var to respond to user input
var output;

//boolean for seeing if alien hit
var isHit;

// shot counter
var shotsTaken = 0;
var shotsRemaining = 10;
var shotcount;



window.onload = setupCanvas;

// renders canvas: var canvasSize can be changed to render a larger or smaller canvas
function setupCanvas(){
    document.getElementById("wrapper").style.width = parseInt(canvasSize + 40,10)+"px";
    canvas = document.getElementById("canvas");
    canvas.style.width = canvasSize+"px";
    canvas.style.height = canvasSize+"px";
    canvas.style.backgroundSize = canvasSize+"px"+" "+canvasSize+"px";
    placeSprite();
}


//placing the alien, ship, and (invisible) bullet on the canvas
function placeSprite(){
    ship = document.getElementById("ship");
    alien= document.getElementById("alien");
    bullet = document.getElementById("bullet");
    if(xpos > canvasSize - alien.clientWidth){
        alien.style.left = canvasSize - alien.clientWidth + "px";
    }
    else{
        alien.style.left = xpos + "px";
    }
    alien.style.top = ypos + "px";
    bullet.style.top = canvasSize - (ship.clientHeight*1.5) + "px";
    ship.style.top = canvasSize- ship.clientHeight+ "px";
    output = document.getElementById("output");
    output.innerHTML = "Enter the X and Y position (0-"+canvasSize+"), then click fire!";
    beginGame();
}

//when user hits fire, begin game
function beginGame(){
    document.getElementById("fire").addEventListener("click", isValid);
    window.addEventListener("keydown", keydownHandler, false); 
    
}

//run program if user presses "enter" button on keyboard
function keydownHandler(){
    if(event.keyCode == 13){
        isValid();
    }
    
}

// makes sure user enters a number that is greater than or equal to 0, and less than or equal to 400
// lets user know if they entered an invalid input
// extracts value of valid user input (as an integer)
function isValid(){
    userXpos = document.getElementById("xpos").value;
    userYpos = document.getElementById("ypos").value;
    if(userXpos == "" || userXpos == null || userYpos == "" || userYpos == null){
        output.innerHTML = "You must fill in both an X and Y position to fire!"; 
        return;
    } 
    if(userXpos > canvasSize || userXpos < 0 || userYpos > canvasSize || userXpos < 0){
        output.innerHTML = "Both the X and Y Position must be greater than or equal to 0 and less than or equal to 400";
        return;

    }
    if(isNaN(userXpos) || isNaN(userYpos)){
        output.innerHTML = "You must enter a number for both X and Y positions!";
        return;
    }
   else{
       userXpos = parseInt(userXpos, 10);
       userYpos = parseInt(userYpos, 10);
       shipFire(); 
    }
    
}

// checks to see if alien has been hit, announces results to user
// takes into account that y axis is reversed for the render of the alien
function shipFire(){
    if(userXpos > parseInt(xpos + alien.clientWidth, 10) || userXpos < xpos ){
        output.innerHTML = "You missed! The alien has advanced!";
        isHit= false;
    }
    if(userXpos <= parseInt(xpos + alien.clientWidth, 10) && userXpos >= xpos ){
        if(userYpos >= parseInt(canvasSize - ypos - alien.clientHeight, 10) && userYpos <= parseInt(canvasSize - ypos, 10)){
            output.innerHTML = "You've hit the alien!";
            isHit= true;
            console.log(isHit);
        }
        else if(userYpos > parseInt(canvasSize - ypos, 10)){
            output.innerHTML = "You aimed past the alien and missed! The alien has advanced!"; 
            isHit= false;
            console.log(isHit);
        }
        else{
            output.innerHTML = "You missed! The alien has advanced!";  
            isHit= false;
        }
    }
    moveShip();
    shotCounter();
    
}

// moves the ship, checks to make sure ship does not move outside boundaries of canvas
//checks to make sure bullet is fired even when the user has not changed x or y position
// waits for animation to end before calling fireBullet
function moveShip(){
    var left = ship.style.left;
    if(userXpos <= ship.clientWidth/2){
        if(left == "0px"){
            fireBullet();
        }
        else{
            ship.style.left = "0px";
        }
    }
    else if(userXpos < canvasSize - ship.clientWidth){
        if(left == userXpos - alien.clientWidth/2 + "px"){
            fireBullet();
        }
        else{
            ship.style.left = userXpos - alien.clientWidth/2 + "px";
        }
    }
    else{
        if(left == canvasSize - ship.clientWidth + "px"){
            fireBullet();
        }
        else{
            ship.style.left = canvasSize - ship.clientWidth + "px";
        }
    }
    ship.addEventListener('transitionend', fireBullet, true);
    
}


// updates how many shots have been taken/ how many are remaining and posts to screen
function shotCounter(){
    shotcount = document.getElementById("shotcount");
    shotsTaken++;
    shotsRemaining--;
    shotcount.innerHTML = "Shots: "+shotsTaken+", Remaining: "+shotsRemaining;
    if(!isHit){
        if(shotsTaken < 10){
            setTimeout(advanceAlien, 4000);
        }
        else{
            gameOver();
        }
    }
    else{
       gameOver();
    }
    
    
}

// adding hard version: alien advances one tenth of canvas when you miss 
function advanceAlien(){
    ypos = ypos + canvasSize/10;
    if(ypos > canvasSize - 100){
        ypos = (canvasSize - 100) + "px";
    }
    xpos = Math.floor(Math.random() * canvasSize);
    console.log(xpos + "  "+ypos);
    alien.style.top = ypos+"px";
    if(xpos > alien.clientWidth){
        alien.style.left = (xpos-alien.clientWidth) + "px";
        xpos = xpos - alien.clientWidth;
    }
    else{
        alien.style.left = xpos + "px";
    }
    
}

// checks to see if alien is hit, then posts a message, link to replay
function gameOver(){
    document.getElementById("fire").style.display = "none";
    if(isHit){
        output.innerHTML= "You've saved the earth from alien attack in just "+shotsTaken+" shots! <a href='game.html'>Play again?</a>";
        
    }
    else{
        alien.style.top = (canvasSize- alien.clientWidth)+"px";
        output.innerHTML= "You've run out of shots! The aliens have taken over earth. <a href='game.html'>Play again?</a>";
        
    }
    
}


// renders + fires the bullet (waits to make sure bullet has completed path before calling other functions) 
// if guess for y position < ship height, only render the bullet immediately in front of the tank
function fireBullet(){
    bullet.style.display = "block";
    if(ship.style.left == "0px"){
        bullet.style.left = bullet.clientWidth/3 + "px";
    }
    else if(ship.style.left == userXpos - alien.clientWidth/2 + "px"){
        bullet.style.left = userXpos - alien.clientWidth/2 + bullet.clientWidth/3 +"px";
    }
    else if(ship.style.left == canvasSize - ship.clientWidth + "px"){
        bullet.style.left = canvasSize - ship.clientWidth + bullet.clientWidth/3 + "px";
    }
    if(userYpos > ship.clientHeight){
        bullet.style.top = canvasSize - userYpos+"px";
        if(!isHit){
            bullet.addEventListener('transitionend', resetBullet, true);
        }
        else{
            bullet.addEventListener('transitionend', alienFlicker, true);   
        }
    }
    else{
        setTimeout(resetBullet, 1000);
    }
    
}

// toggles the bullet invisible and resets the location
function resetBullet(){
    bullet.style.display="none";
    bullet.style.top = canvasSize - (ship.clientHeight*1.5) + "px";
    
}

// toggles gif of hurt alien
function alienFlicker(){
    alien.src = "alien_attack.gif";
    // gif flashes for 2 seconds
    setTimeout(function(){ alien.style.display="none"; }, 2000);
    bullet.style.display = "none";
}
