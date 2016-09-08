/*

spatialManager.js

A module which handles spatial lookup, as required for...
e.g. general collision detection.

*/

'use strict';

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

var spatialManager = {

// "PRIVATE" DATA

_nextSpatialID : 1, // make all valid IDs non-falsey (i.e. don't start at 0)

_entities : [],

// "PRIVATE" METHODS
//
// <none yet>


// PUBLIC METHODS

getNewSpatialID : function() {
    return this._nextSpatialID++;
},

reset: function() {
    this._nextSpatialID = 1;
    this._entities = [];
},

register: function(entity) {
    var spatialID = entity.getSpatialID();
    this._entities[spatialID] = entity;
},

unregister: function(entity) {
    var spatialID = entity.getSpatialID();
    delete this._entities[spatialID];
},

findEntityInRangeCircle: function(posX, posY, radius) {
    var e, distance, limit;
    for (var i = 0; i != this._entities.length; i++) {
        e = this._entities[i];

        if (e) {
            if (e.isRectangle()) {
                // TODO: Not needed in this game.
            } else {
                distance = util.distSq(posX, posY, e.getPos().posX, e.getPos().posY);
                limit = util.square(radius + e.getRadius());

                if (distance < limit) {
                    return e;
                }
            }
        }
    }

    return false;
},

findEntityInRangeRect: function(posX, posY, nextX, nextY, width, height) {
    var e, distance, limit;
    var Ax1, Ax2, Ay1, Ay2;
    var Bx1, Bx2, By1, By2;
    for (var i = 0; i != this._entities.length; i++) {
        e = this._entities[i];

        if (e && e.isCollidable()) {
            if (e.isRectangle()) {
                Ax1 = e.getCollisionPos().posX - (e.getCollisionWidth() / 2);
                Ax2 = Ax1 + e.getCollisionWidth();
                Ay1 = e.getCollisionPos().posY -  (e.getCollisionHeight() / 2);
                Ay2 = Ay1 + e.getCollisionHeight();

                Bx1 = posX - (width / 2);
                Bx2 = Bx1 + width;

                if (nextY && nextY > posY) {
                    By1 = posY -  (height / 2);
                    By2 = nextY -  (height / 2) + height;
                } else if (nextY) {
                    By1 = nextY -  (height / 2);
                    By2 = posY -  (height / 2) + height;
                } else {
                    By1 = posY -  (height / 2);
                    By2 = By1 + height;
                }

                if (Ax1 < Bx2 && Ax2 > Bx1 && Ay1 < By2 && Ay2 > By1) {
                    return e;
                }
            } else {
                // TODO: Not needed in this game.
            }
        }
    }

    return false;
},

render: function(ctx) {
    var oldStyle = ctx.strokeStyle;
    ctx.strokeStyle = "red";
    
    for (var ID in this._entities) {
        var e = this._entities[ID];

        if (e.isRectangle()) {
            util.strokeBox(ctx, e.getCollisionPos().posX - (e.getCollisionWidth() / 2), e.getCollisionPos().posY -  (e.getCollisionHeight() / 2), e.getCollisionWidth(), e.getCollisionHeight());
        } else {
            util.strokeCircle(ctx, e.getPos().posX, e.getPos().posY, e.getRadius());
        }
    }
    ctx.strokeStyle = oldStyle;
}

};
