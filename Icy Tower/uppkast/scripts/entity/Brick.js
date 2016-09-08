  // =====
// BRICK
// =====

'use strict';

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function Brick(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    // Default sprite
    //this.sprite = g_sprites.brick;

    this._width = BRICK_SIZE;
    this._height = 20;
    this._lifeSpan = 10000/ NOMINAL_UPDATE_INTERVAL - this.cy ;
    this._dropThresh = (10000 / NOMINAL_UPDATE_INTERVAL) / 3;
    this._fadeThresh = (10000 / NOMINAL_UPDATE_INTERVAL) / 5;
    this._yVel = 0;
}

Brick.prototype = new Entity(true);

/*Rock.prototype.randomisePosition = function () {
    // Rock randomisation defaults (if nothing otherwise specified)
    this.cx = this.cx || Math.random() * g_canvas.width;
    this.cy = this.cy || Math.random() * g_canvas.height;
    this.rotation = this.rotation || 0;
};*/

Brick.prototype.update = function (du) {

    g_world_time +=du / NOMINAL_UPDATE_INTERVAL;
    spatialManager.unregister(this);
    console.log("worldltime "+ g_world_time);
    this.cy = this.cy + this._yVel;


    if (g_world_time >= this._lifeSpan){
     return entityManager.KILL_ME_NOW;
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
    ctx.save();
    //ctx.translate(0, worldManager.getOffsetY());


    if (this._lifeSpan < this._dropThresh) {

        this._yVel = 1;

        if(this._lifeSpan < this._fadeThresh){

            ctx.globalAlpha = this._lifeSpan / this._fadeThresh;
        }
}
        this.sprite.drawCentredAt2(
            ctx, 0, 0, 20, 20, this.getPos().posX, this.getPos().posY, this._width, this._height, 0
        );

    ctx.restore();
};
