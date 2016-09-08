/*

entityManager.js

A module which handles arbitrary entity-management for "Asteroids"


We create this module as a single global object, and initialise it
with suitable 'data' and 'methods'.

"Private" properties are denoted by an underscore prefix convention.

*/


"use strict";


// Tell jslint not to complain about my use of underscore prefixes (nomen),
// my flattening of some indentation (white), or my use of incr/decr ops 
// (plusplus).
//
/*jslint nomen: true, white: true, plusplus: true*/


var entityManager = {

// "PRIVATE" DATA

_guys   : [],
_bricks : [],
_back : [],
_powerUp : [],
lengthOfArray : 0,

// "PRIVATE" METHODS

_forEachOf: function(aCategory, fn) {
    for (var i = 0; i < aCategory.length; ++i) {
        fn.call(aCategory[i]);
    }
},

// PUBLIC METHODS

// A special return value, used by other objects,
// to request the blessed release of death!
//
KILL_ME_NOW : -1,

// Some things must be deferred until after initial construction
// i.e. thing which need `this` to be defined.
//
deferredSetup : function () {
    this._categories = [this._back,this._bricks,this._guys, this._powerUp];
},

init: function() {
    this.generateBricks();
    this.generateBack();
    this.generatePowerUp();
},

generateGuy : function(descr) {
    this._guys.push(new Guy(descr));
},

generateBricks : function(){
    for (var i = 0; i != g_levels.length; i++) {
        for (var j = this.lengthOfArray; j != g_levels[i].length; j++) {
            for (var k = 0; k != g_levels[i][j].length; k++) {
                if (g_levels[i][j][k] === 1 || g_levels[i][j][k] === 2) {
                    if (g_levels[i][j][k] === 2) {
                        this._powerUp.push(new powerUps({
                        cx: BRICKFIELD_GUTTER + (BRICK_SIZE * k) + (BRICK_SIZE / 2),
                        cy: (g_canvas.height - 120) - (100 * j)-40,
                        isStar : true,
                        ice : false
                        })); 
                    };
           
                        console.log((g_canvas.height - 120) - (100 * j));
                    //console.log(BRICKFIELD_GUTTER +" "+BRICK_SIZE/2+" "+k);
                    if( j > 15 && j < 30){
                        this._bricks.push(new Brick({
                            cx: BRICKFIELD_GUTTER + (BRICK_SIZE * k) + (BRICK_SIZE / 2),
                            cy: (g_canvas.height - 120) - (100 * j),
                            sprite : g_sprites.bricksice,
                            isBrick : true,
                            ice : true

                        }));
                    }
                    if(j <= 15){
                        this._bricks.push(new Brick({
                        cx: BRICKFIELD_GUTTER + (BRICK_SIZE * k) + (BRICK_SIZE / 2),
                        cy: (g_canvas.height - 120) - (100 * j),
                        sprite : g_sprites.brick,
                        isBrick : true,
                        ice : false
                        }));
                    }
                    if(j >= 30){
                        this._bricks.push(new Brick({
                        cx: BRICKFIELD_GUTTER + (BRICK_SIZE * k) + (BRICK_SIZE / 2),
                        cy: (g_canvas.height - 120) - (100 * j),
                        sprite : g_sprites.grass,
                        ice : false,
                        isBrick : true
                        }));
                    }

                } 
                
            }
        }
        
        this.lengthOfArray = g_levels[0].length; 
    }
},

generateBack : function(descr){
    this._back.push(new Background(descr));
},

generatePowerUp : function(descr){
    this._powerUp.push(new powerUps(descr));
},

resetGuy: function() {
    this._forEachOf(this._guys, Guy.prototype.reset);
},

toggleRocks: function() {
    this._bShowRocks = !this._bShowRocks;
},

update: function(du) {
    for (var c = 0; c < this._categories.length; ++c) {

        var aCategory = this._categories[c];
        var i = 0;

        while (i < aCategory.length) {
            var status = aCategory[i].update(du);

            if (status === this.KILL_ME_NOW) {
                // remove the dead guy, and shuffle the others down to
                // prevent a confusing gap from appearing in the array
                aCategory.splice(i,1);
            }
            else {
                ++i;
            }
        }
    }
},

render: function(ctx) {
    var debugX = 10, debugY = 100;
    //Funny     ctx.save();
    //ctx.translate(0, g_viewY);
    for (var c = 0; c < this._categories.length; ++c) {

        var aCategory = this._categories[c];
            
        for (var i = 0; i < aCategory.length; ++i) {

            aCategory[i].render(ctx);
            //debug.text(".", debugX + i * 10, debugY);

        }
        debugY += 10;
    }
    //Funny ctx.restore();
}

};

// Some deferred setup which needs the object to have been created first
entityManager.deferredSetup();

