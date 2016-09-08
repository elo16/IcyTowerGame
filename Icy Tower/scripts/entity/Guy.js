// ==========
// SHIP STUFF
// ==========

'use strict';

/* jshint browser: true, devel: true, globalstrict: true */
/*global Audio: false */

/*
 0        1         2         3         4         5         6         7         8
 12345678901234567890123456789012345678901234567890123456789012345678901234567890
 */

// A generic contructor which accepts an arbitrary descriptor object
function Guy(descr) {
    // Common inherited setup logic from Entity
    this.setup(descr);

    this._spriteWidth = 40;
    this._spriteHeight = 64;
    this._width = this._spriteWidth * 1.5;
    this._height = this._spriteHeight * 1.5;
    //animated sprites
    this.jumpingSprite = new AnimatedSprite(g_images.guyJumpingImage, this._spriteWidth, this._spriteHeight, this._width, this._height, 0, [0]);
    this.standStillSprite = new AnimatedSprite(g_images.guyStandstillImage, this._spriteWidth, this._spriteHeight, this._width, this._height, 0.1, [0, 1, 2, 3, 4, 5]);
    this.runningRightSprite = new AnimatedSprite(g_images.guyRunningImage, this._spriteWidth, this._spriteHeight, this._width, this._height, 0.15, [0, 1, 2, 3]);
    this.runningLeftSprite = new AnimatedSprite(g_images.guyRunningImage, this._spriteWidth, this._spriteHeight, this._width, this._height, 0.15, [4, 5, 6, 7]);

    this._isJumping = false;
    this._jumpForce = -16;
    this._maxSpeed = 8;
    this.direction = 0;
    this.iceBricks = false; //ef true þa rennur gæjinn
    this.guyColliding = 0;
}

Guy.prototype = new Entity(true);

Guy.prototype.KEY_LEFT   = 37;
Guy.prototype.KEY_RIGHT  = 39;
Guy.prototype.higherJump = 0;

Guy.prototype.KEY_UP = 38;
Guy.prototype.KEY_JUMP = ' '.charCodeAt(0);

// Initial, inheritable, default values
Guy.prototype.cx = 200;
Guy.prototype.cy = 500;
Guy.prototype.velX = 0;
Guy.prototype.velY = 0;
Guy.prototype.numSubSteps = 1;
Guy.prototype.scream = new Audio("scripts/sounds/falling.ogg");
Guy.prototype.jumpSound = new Audio("scripts/sounds/jump_mid.ogg");
Guy.prototype._powerUp = 0;
Guy.prototype._duration = 60;
Guy.prototype._powerText = "";
var textHigher = 60;

Guy.prototype.update = function (du) {
    spatialManager.unregister(this);	
    if (g_startDrop) {
    	g_worldtime +=du;
    }
    if (this.isDeadNow()) {
        return entityManager.KILL_ME_NOW;
    }

    if (!g_mute && this.velY < -17) {
        this.jumpSound.play();
    }

    // Perform movement substeps
    var steps = this.numSubSteps;
    var dStep = du / steps;
    for (var i = 0; i < steps; ++i) {
        this.computeSubStep(dStep);
    }

    if (this.isJumping()) {
        this.jumpingSprite.update(du);
    } else {
        if (this.direction === 0) this.standStillSprite.update(du);
        if (this.direction === -1) this.runningLeftSprite.update(du);
        if (this.direction === 1) this.runningRightSprite.update(du);
    }

    if(this._powerUp === 2){
        Score.prototype.PowerMultiplier = true;
        this._duration -= du/3;
        if(this._duration <= 0){
            this._powerUp = 0;
            this._duration = 60;
            Score.prototype.PowerMultiplier = false;
        }
    }

    spatialManager.register(this);
};

Guy.prototype.computeSubStep = function (du) {
    var thrust = this.computeThrustMag();
    this.computeJumpMag();

    // Apply thrust directionally, based on our rotation
    var accelX = thrust;
    var accelY = 0;

    // Apply gravity
    accelY += consts.NOMINAL_GRAVITY+g_viewY;

    this.applyAccel(accelX, accelY, du);
};

var NOMINAL_THRUST = 0.2;

Guy.prototype.computeThrustMag = function () {

    var thrust = 0;
    if (keys[this.KEY_RIGHT]) {
        thrust += NOMINAL_THRUST;
        this.direction = 1;
    }
    if (keys[this.KEY_LEFT]) {
        thrust -= NOMINAL_THRUST;
        this.direction = -1;
    }

    return thrust;
};

Guy.prototype.computeJumpMag = function () {

    if (!this.isJumping() && Math.abs(this.velX) > 6) {
        this.higherJump = 2;
    }else if(Math.abs(this.velX) <= 6){
        this.higherJump = 0;
    }

    var checkIfJump = false;
    if (g_debug) {
        checkIfJump = true;
    }else{
        checkIfJump = (Math.abs(this.velY) < 8 || this.guyColliding.isBrick);
    }
    
    if ((keys[this.KEY_JUMP]||keys[this.KEY_UP]) && !this.isJumping() && checkIfJump) {
        this.velY = this._jumpForce - (Math.abs(this.velX/4)+this.higherJump);
        this.higherJump = 0;

        this._isJumping = !g_debug;

        Score.prototype.colorS = "blue";

        if (this._powerUp === 3) {
            this._duration -= Math.round(50/2);
            
            if (this._duration <= 0) {
                this._powerUp = 0;
                this._duration = 60;
                this._isJumping = !g_debug;
            }else{
                this._isJumping = false;
            }
        }

    }
        
};

Guy.prototype.applyAccel = function (accelX, accelY, du) {
    // u = original velocity
    var oldVelX = this.velX;
    var oldVelY = this.velY;

    // v = u + at
    this.velX += accelX * du;
    if (this._powerUp === 1) { //Floats upwards
        this.velY = this._jumpForce/2;
        this._duration -= du;
        if(this._duration <= 0){
            this._powerUp = 0;
            this._duration = 60;
            this.velY = 0;
		}
	} else {
        this.velY += accelY * du;
    }

    if (this._powerUp > 0 ) {
        textHigher -= du; 
    }else{
        textHigher = 60;
    }


    // v_ave = (u + v) / 2
    var aveVelX = (oldVelX + this.velX) / 2;
    var aveVelY = (oldVelY + this.velY) / 2;

    aveVelX = aveVelX > this._maxSpeed ? this._maxSpeed : aveVelX;
    aveVelX = aveVelX < -this._maxSpeed ? -this._maxSpeed : aveVelX;

    // s = s + v_ave * t
    var nextX = this.cx + aveVelX * du;
    var nextY = this.cy + aveVelY * du;
	
    // bounce
    var minY = this._height / 2;
    var maxY = g_canvas.height - minY;

    //var minX = this.sprite.width / 3;  //utfærum miðað við veggina.
    var minX = 75;
    var maxX = g_canvas.width - minX;

    var collidingWith = this.isColliding(nextX, nextY + (this._height / 2) - this.getCollisionHeight());
    var collidingWithStar = this.isColliding(this.cx, this.cy);
    this.guyColliding = this.isColliding(nextX, nextY + (this._height / 2) - this.getCollisionHeight());
    //COLLIDES WITH ICE

    if (collidingWith && collidingWith.getType() === consts.BRICK_TYPES.ICE) {
        this.iceBricks = true;
        Brick.dropSpeed = 2;
    } else if (collidingWith.isBrick) {
        this.iceBricks = false;
    }

    if (collidingWith.isBrick) {
    	this._jumpForce = -14;
        var adjustedHeight = Math.round((-collidingWith.cy + g_canvas.height)/100)*10; //Muliply of 10
        console.log(worldManager._g_highest_brick);
        if(adjustedHeight > worldManager._g_highest_brick && this.velY > 0){ //ATH fyrsti brick dettur um leið og world managerinn hreyfist
            worldManager._g_last_highest_brick = worldManager._g_highest_brick;
            worldManager._g_highest_brick = Math.round(adjustedHeight);
        }
    }


    //-- Makes him go slower and stop if key left or right key is not held down.
    if (!this.iceBricks) {
        if(this.velX >= 0 && !keys[this.KEY_RIGHT]){
            this.velX *= consts.NOMINAL_FRICTION;

            if (this.velX < 0.1) {
                this.velX = 0;
                this.direction = 0;
            }
        }

        if(this.velX <= 0 && !keys[this.KEY_LEFT]) {
            this.velX *= consts.NOMINAL_FRICTION;

            if (this.velX > -0.1) {
                this.velX = 0;
                this.direction = 0;
            }
        }
    }

	
    if (nextY > maxY && !worldManager.hasMoved()) {
        this.velY = 0;
        aveVelY = this.velY;
        this.cy = maxY;
        this._isJumping = false;
    }

    if(this.cx > maxX || nextX < minX){
        this.velX *= -0.8;
        aveVelX = this.velX;
    } else if(nextX > maxX || nextX < minX){
        this.velX *= -0.8;
        aveVelX = this.velX;
    }

    //COLLIDES WITH WHITE BRICKS
    if (collidingWith && collidingWith.getType() === consts.BRICK_TYPES.WHITE) {
        collidingWith._lifeSpan = 1000;
        collidingWith._fadeThresh = 3;
    }

    if (worldManager.hasMoved()) {
    	g_startDrop = true;
    }

  
    //Collidar við stjörnu(powerUp)
    if (collidingWithStar&& collidingWithStar.isStar) {
		
        var collidedStar = this.isColliding(this.cx, this.cy);
        posStarY = collidingWithStar.getCollisionPos().posY;
        posStarX = collidingWithStar.getCollisionPos().posX;
        this._powerUp = collidedStar.getPower();
		this._powerText = collidedStar._powerText[this._powerUp-1];
        g_powerText = this._powerText;
		this._duration = 50;
        collidedStar._isDeadNow = true;
        Score.prototype.colorS = "yellow";
    }

    //Collidar við brick.
    if (aveVelY >= 0 && collidingWith && !collidingWith.isStar) {
        this._isJumping = false;
        this.velY = 0;
        this.cy = collidingWith.getCollisionPos().posY - (collidingWith.getCollisionHeight() / 2) - (this.getHeight() / 2);
    } else {
        this.cy += du * aveVelY;
    }

    this.cx += du * aveVelX;

    // If they guy is above a certain threshold we must push the world down.
    if (this.cy < (g_canvas.height - 300)) {
        worldManager.moveDown( - (this.cy - (g_canvas.height - 300)) / 30);
    }

    // The guy is above a certain position. Start the timers on the bricks.
    if (this.cy < (g_canvas.height - 400)) {
        worldManager.start();
    }

    guyVelY = this.velY;

    // Game over?
    if (worldManager.hasMoved() && this.cy > g_canvas.height + 100) {
        if (!g_mute) {
            this.scream.play(); 
        }
        worldManager.setGameStatus(3);
    }	
};

Guy.prototype.isJumping = function() {
    return this._isJumping;
};

Guy.prototype.getRadius = function () {
    return (this._width / 2) * 0.9;
};

Guy.prototype.getWidth = function () {
    return this._width;
};

Guy.prototype.getHeight = function () {
    return this._height;
};

Guy.prototype.getCollisionPos = function () {
    return {posX : this.getPos().posX, posY : this.getPos().posY + (this._height / 2) - (this.getCollisionHeight() / 2)};
};

Guy.prototype.getCollisionWidth = function () {
    return this.getWidth() - 20;
};

Guy.prototype.getCollisionHeight = function () {
    return 1;
};

Guy.prototype.halt = function () {
    this.velX = 0;
    this.velY = 0;
};

Guy.prototype.render = function (ctx) {
	ctx.save();
    /*
	if(this._duration <= 50){
        ctx.font="bold 40px Arial";
        ctx.fillStyle = 'blue';
        ctx.fillText(this._powerText,g_canvas.width/3 - 25,g_canvas.height/3);
    }
    */
    g_duration = this._duration;
    if (this.isJumping()) {
        this.jumpingSprite.render(ctx, this.cx, this.cy, 0);
    } else {
        if (this.direction === 0) this.standStillSprite.render(ctx, this.cx, this.cy, 0);
        if (this.direction === -1) this.runningLeftSprite.render(ctx, this.cx, this.cy, 0);
        if (this.direction === 1) this.runningRightSprite.render(ctx, this.cx, this.cy, 0);
    }
	ctx.restore();
};




