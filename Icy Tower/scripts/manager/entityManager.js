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
_score : [],

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
    this._categories = [this._back,this._bricks,this._guys, this._powerUp, this._score];
},

init: function() {
    this.generateBricks();
    this.generateBack();
    this.generatePowerUp();
	this.generateScore();
    this.generateGuy();
},

reset: function() {
    this._forEachOf(this._categories, function() { this.splice(0, this.length) });
    g_levels.splice(0, g_levels.length);
    generateLevels();
    this.init();
},

generateGuy : function(descr) {
   this._guys.push(new Guy({
        cx : 200,
        cy : g_canvas.height - 100
    }));
},

generateBricks : function(){
    var levelSprites = [false, g_sprites.brick, g_sprites.bricksice, g_sprites.whiteBricks,g_sprites.grass];

    for (var i = 0; i != g_levels.length; i++) {
        for (var j = 0; j != g_levels[i].length; j++) {
            console.log(j);
            for (var k = 0; k != g_levels[i][j].length; k++) {
                if (g_levels[i][j][k] > 0) {
                    this._bricks.push(new Brick({
                        cx: BRICKFIELD_GUTTER + (BRICK_SIZE * k) + (BRICK_SIZE / 2),
                        cy: (g_canvas.height - 120) - (100 * j) - (i * g_levels[i].length * 100),
                        sprite : levelSprites[g_levels[i][j][k]] ? levelSprites[g_levels[i][j][k]] : levelSprites[1],
                        isBrick : true,
                        type: g_levels[i][j][k]
                    }));

                }
                
                if (Math.random() < 0.01) {
                    this._powerUp.push(new powerUps({
                        cx: BRICKFIELD_GUTTER + (BRICK_SIZE * k) + (BRICK_SIZE / 2),
                        cy: (g_canvas.height - 120) - (100 * j) - (i * g_levels[i].length * 100)-30,
                        isStar : true,
                        type: g_levels[i][j][k]
                    }));
                }
            }
        }
    }
},

generateBack : function(descr){
    this._back.push(new Background(descr));
},

generatePowerUp : function(descr){
    this._powerUp.push(new powerUps(descr));
},

generateScore : function(descr){
    this._score.push(new Score(descr));
},

update: function(du) {
    for (var c = 0; c < this._categories.length; ++c) {

        var aCategory = this._categories[c];
        var i = 0;

        while (i < aCategory.length) {
            var status = aCategory[i].update(du);

            if (status === this.KILL_ME_NOW) {
                //console.log('kill');

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
    for (var c = 0; c < this._categories.length; ++c) {
        var aCategory = this._categories[c];
            
        for (var i = 0; i < aCategory.length; ++i) {
            aCategory[i].render(ctx);
        }
    }
}

};

entityManager.deferredSetup();

