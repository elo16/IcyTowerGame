// =====
// BRICK
// =====

'use strict';

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic constructor which accepts an arbitrary descriptor object
function Brick(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    this._width = BRICK_SIZE;
    this._height = 20;
    //this._dropTimeDiff = 100;
    this.dropSpeed = 0.25; //fer i 0 þegar hann collidar við is.

    this._lifeSpan =( 10000 / NOMINAL_UPDATE_INTERVAL) - this.cy; //- this._dropTimeDiff;

    this._dropThresh = this._lifeSpan / 3;
    this._fadeThresh = this._lifeSpan / 5;
    this._yVel = 0;

}

Brick.prototype = new Entity(true);



Brick.prototype.update = function (du) {
if(g_worldtime >= g_timeThresh){    //every g_timeThresh (30seconds) the dropspeed increases  
    Word = Math.floor(util.randRange(0,Score.prototype.CheerWords.length));  
    g_timeThreshMultiplier += 0.25;
    g_timeThresh += (30 * SECS_TO_NOMINALS); //adds 30 secs to the speed up timelimit
   // console.log("g_timeThreshMultiplier er : "+ g_timeThreshMultiplier);
    HurryUpText = true;
} 

if(g_startDrop){
    spatialManager.unregister(this);
    this._lifeSpan -= du + (this.dropSpeed*g_timeThreshMultiplier);
    this.cy = this.cy + this._yVel;

    if (this._lifeSpan < 0){


        return entityManager.KILL_ME_NOW;
    }
}
 /*
    if (this.isDeadNow()) {
        return entityManager.KILL_ME_NOW;
    }
*/
    spatialManager.register(this);

};


Brick.prototype.getPos = function () {
    return {posX : this.cx, posY : this.cy + worldManager.getOffsetY()};
};

Brick.prototype.getWidth = function () {
    return this._width;
};

Brick.prototype.getHeight = function () {
    return this._height;
};

Brick.prototype.getType = function() {
    return this.type;
},

Brick.prototype.isCollidable = function() {
    return this.getPos().posY > 0 && this.getPos().posY < g_canvas.height;
};

Brick.prototype.isRenderable = function() {
    return this.isCollidable();
};

Brick.prototype.getCollisionPos = function () {
    return {posX : this.getPos().posX, posY : this.getPos().posY - (this._height / 2) + (this.getCollisionHeight() / 2)};
};

Brick.prototype.getCollisionWidth = function () {
    return this.getWidth();
};

Brick.prototype.getCollisionHeight = function () {
    return 1;
};

Brick.prototype.render = function (ctx) {
    if (this.isRenderable()) {
        ctx.save();

        if (this._lifeSpan < this._dropThresh) {

            this._yVel = 1;

            if(this._lifeSpan < this._fadeThresh){
                ctx.globalAlpha = this._lifeSpan / this._fadeThresh;
                this._yVel += consts.NOMINAL_GRAVITY;
            }
        }

        this.sprite.drawCentredAt2(
            ctx, 0, 0, 20, 20, this.getPos().posX, this.getPos().posY, this._width, this._height, 0
        );

        ctx.restore();
    }
};
