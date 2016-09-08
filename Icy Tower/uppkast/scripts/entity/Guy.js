// ==========
// SHIP STUFF
// ==========

'use strict';

/* jshint browser: true, devel: true, globalstrict: true */

/*
 0        1         2         3         4         5         6         7         8
 12345678901234567890123456789012345678901234567890123456789012345678901234567890
 */

// A generic contructor which accepts an arbitrary descriptor object
function Guy(descr) {
    // Common inherited setup logic from Entity
    this.setup(descr);

    this.rememberResets();

    this._spriteWidth = 40;
    this._spriteHeight = 64;
	this._brickHeight = 25;
    this._width = this._spriteWidth * 1.5;
    this._height = this._spriteHeight * 1.5;

    // Jumping animated sprite for future use.
    this.jumpingSprite = new AnimatedSprite(g_images.guyJumpingImage, this._spriteWidth, this._spriteHeight, this._width, this._height, 0, [0]);

    this.standStillSprite = new AnimatedSprite(g_images.guyStandstillImage, this._spriteWidth, this._spriteHeight, this._width, this._height, 0.1, [0, 1, 2, 3, 4, 5]);
    this.runningRightSprite = new AnimatedSprite(g_images.guyRunningImage, this._spriteWidth, this._spriteHeight, this._width, this._height, 0.15, [0, 1, 2, 3]);
    this.runningLeftSprite = new AnimatedSprite(g_images.guyRunningImage, this._spriteWidth, this._spriteHeight, this._width, this._height, 0.15, [4, 5, 6, 7]);

    this._isJumping = false;
    this._jumpForce = -16;
    this._maxSpeed = 8;
    this.direction = 0;
    this.heightOfBricks = -2520;
};

Guy.prototype = new Entity(true);

Guy.prototype.rememberResets = function () {
    // Remember my reset positions
    this.reset_cx = this.cx;
    this.reset_cy = this.cy;
    this.reset_rotation = this.rotation;
};

Guy.prototype.KEY_LEFT   = 37; //'A'.charCodeAt(0);
Guy.prototype.KEY_RIGHT  = 39; //'D'.charCodeAt(0);

Guy.prototype.KEY_UP = 38;
Guy.prototype.KEY_JUMP = ' '.charCodeAt(0);

// Initial, inheritable, default values
Guy.prototype.rotation = 0;
Guy.prototype.cx = 200;
Guy.prototype.cy = 500;
Guy.prototype.velX = 0;
Guy.prototype.velY = 0;
Guy.prototype.numSubSteps = 1;
Guy.prototype.gameStarted = false;

Guy.prototype.update = function (du) {
    spatialManager.unregister(this);

    if (this.isDeadNow()) {
        return entityManager.KILL_ME_NOW;
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
    
    if ((keys[this.KEY_JUMP]||keys[this.KEY_UP]) && !this.isJumping()) {
        this.velY = this._jumpForce - Math.abs(this.velX/2.5);
        this._isJumping = true;
    }
    
};

Guy.prototype.applyAccel = function (accelX, accelY, du) {
    // u = original velocity
    var oldVelX = this.velX;
    var oldVelY = this.velY;

    // v = u + at
    this.velX += accelX * du;
    this.velY += accelY * du;

    // v_ave = (u + v) / 2
    var aveVelX = (oldVelX + this.velX) / 2;
    var aveVelY = (oldVelY + this.velY) / 2;

    aveVelX = aveVelX > this._maxSpeed ? this._maxSpeed : aveVelX;
    aveVelX = aveVelX < -this._maxSpeed ? -this._maxSpeed : aveVelX;

    // s = s + v_ave * t
    var nextX = this.cx + aveVelX * du;
    var nextY = this.cy + aveVelY * du;

	//
	var yDeadZone = 0.4*g_canvas.height;
	
    // bounce
    var minY = this._height / 2;
    var maxY = g_canvas.height - minY;

    //var minX = this.sprite.width / 3;  //utfærum miðað við veggina.
    var minX = 75;
    var maxX = g_canvas.width - minX;

    var collidingWith = this.isColliding(nextX, nextY + (this._height / 2) - this.getCollisionHeight());
    var collidingWithStar = this.isColliding(this.cx, this.cy);


    //-- Makes him go slower and stop if key left or right key is not held down.
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

	//Move the viewport, deadzone c.a. 250
	if(this.gameStarted === true){ //this.cy < 0.4*g_canvas.height &&
		if (this.cy < yDeadZone/2 ){
			g_viewY = 1.5*consts.NOMINAL_GRAVITY;
		} else if (this.cy < yDeadZone){
			g_viewY = consts.NOMINAL_GRAVITY*0.8;
		} else if (this.cy < 2*yDeadZone ){
			g_viewY = consts.NOMINAL_GRAVITY/2;
		} else {
			g_viewY = 0;
		}
	} else {
		g_viewY = 0;
	}
	if(!(g_viewY === 0)){
		this.yDeadZone = yDeadZone + g_viewY;
	}
    /*if ((this.cy < yDeadZone) && this.gameStarted === true) {
		g_viewY = consts.NOMINAL_GRAVITY;
		//this.yDeadZone = yDeadZone + g_viewY;
		//console.log("asdf: "+g_viewY);
    } else {
		//Anchor for now
		
	}*/
		
	
    // Use the "push-up" method instead of moving to last location.
    if (nextY > maxY && !worldManager.hasMoved()) {
        this.velY = 0;
		//this.gameStarted = true;

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

  
    //Collidar við stjörnu(powerUp)
    if (collidingWithStar&& collidingWithStar.isStar) {
        this.isColliding(this.cx, this.cy)._isDeadNow = true;
    };

    //Collidar við brick.
    if (aveVelY >= 0 && collidingWith && !collidingWith.isStar) {
        this._isJumping = false;
        this.velY = 0;
        this.cy = collidingWith.getCollisionPos().posY - (collidingWith.getCollisionHeight() / 2) - (this.getHeight() / 2);
    } else {
        this.cy += du * aveVelY;
    }

    this.cx += du * aveVelX;

    if (this.heightOfBricks > collidingWith.cy) {
        addBricks();
        this.heightOfBricks -= 3000;
    };

    //ATH: Ma bæta við einhverskonar pushup method svo hann lendir alltaf a rettum stað.
    //if(aveVelY >=0 && Bricks.isColliding(this.cx,this.cy)){
	//	var temp = Bricks.isColliding(this.cx,this.cy);
    //    this.cx += du * aveVelX;
//		this.nextY = temp;
		
  //      this.velY = 0;
    //    aveVelY = this.velY;
      //  this._isJumping = false;
        //console.log("checkaði");
    //}
    //else{
        // s = s + v_ave * t
        //console.log("checkaði ekki");
        //this.cx += du * aveVelX;
        //this.cy += du * aveVelY;
    //}

    if (this.cy < (g_canvas.height - 300)) {
        worldManager.moveDown(du * - (this.cy - (g_canvas.height - 300)) / 50);
    }

    if (this.cy < (g_canvas.height - 400)) {
        worldManager.start();
    }

    // Game over?
    if (worldManager.hasMoved() && this.cy > g_canvas.height + 100) {
        this.reset();
        worldManager.reset();
        worldManager.setGameStatus(3);
    }
};

Guy.prototype.isJumping = function() {
    return this._isJumping;
}

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

Guy.prototype.reset = function () {
    this.setPos(this.reset_cx, this.reset_cy);
    this.rotation = this.reset_rotation;
    this._isJumping = false;

    this.halt();
};

Guy.prototype.halt = function () {
    this.velX = 0;
    this.velY = 0;
};

Guy.prototype.render = function (ctx) {
	ctx.save();
    if (this.isJumping()) {
        this.jumpingSprite.render(ctx, this.cx, this.cy, 0);
    } else {
        if (this.direction === 0) this.standStillSprite.render(ctx, this.cx, this.cy, 0);
        if (this.direction === -1) this.runningLeftSprite.render(ctx, this.cx, this.cy, 0);
        if (this.direction === 1) this.runningRightSprite.render(ctx, this.cx, this.cy, 0);
    }
	ctx.restore();
};
