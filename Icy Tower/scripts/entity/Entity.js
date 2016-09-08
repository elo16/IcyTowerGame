// ======
// ENTITY
// ======
/*

Provides a set of common functions which can be "inherited" by all other
game Entities.

JavaScript's prototype-based inheritance system is unusual, and requires 
some care in use. In particular, this "base" should only provide shared
functions... shared data properties are potentially quite confusing.

*/

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


function Entity(isRectangle) {

/*
    // Diagnostics to check inheritance stuff
    this._entityProperty = true;
    console.dir(this);
*/

    this._isRectangle = isRectangle;

}

Entity.prototype.setup = function (descr) {

    // Apply all setup properies from the (optional) descriptor
    for (var property in descr) {
        this[property] = descr[property];
    }
    
    // Get my (unique) spatial ID
    this._spatialID = spatialManager.getNewSpatialID();
    
    // I am not dead yet!
    this._isDeadNow = false;
};

Entity.prototype.setPos = function (cx, cy) {
    this.cx = cx;
    this.cy = cy;
};

Entity.prototype.getPos = function () {
    return {posX : this.cx, posY : this.cy};
};

Entity.prototype.getRadius = function () {
    return 0;
};

Entity.prototype.getWidth = function () {
    return 0;
};

Entity.prototype.getHeight = function () {
    return 0;
};

Entity.prototype.getCollisionPos = function () {
    return this.getPos();
};

Entity.prototype.getCollisionHeight = function () {
    return this.getHeight();
};

Entity.prototype.getCollisionWidth = function () {
    return this.getWidth();
};

Entity.prototype.isCollidable = function() {
    return true;
};

Entity.prototype.getSpatialID = function () {
    return this._spatialID;
};

Entity.prototype.kill = function () {
    this._isDeadNow = true;
};

Entity.prototype.isDeadNow = function() {
    return this._isDeadNow;
};

Entity.prototype.isRectangle = function() {
    return this._isRectangle;
};

Entity.prototype.getType = function() {
    return false;
};

Entity.prototype.findHitEntity = function (nextX, nextY) {
    var pos = this.getCollisionPos();

    if (this.isRectangle()) {
        return spatialManager.findEntityInRangeRect (
            pos.posX, pos.posY, nextX, nextY, this.getCollisionWidth(), this.getCollisionHeight()
        );
    } else {
        return spatialManager.findEntityInRangeCircle(
            pos.posX, pos.posY, this.getRadius()
        );
    }
};

// This is just little "convenience wrapper"
Entity.prototype.isColliding = function (nextX, nextY) {
    return this.findHitEntity(nextX, nextY);
};
