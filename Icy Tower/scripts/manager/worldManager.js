/*

worldManager.js

*/


'use strict';


// Tell jslint not to complain about my use of underscore prefixes (nomen),
// my flattening of some indentation (white), or my use of incr/decr ops
// (plusplus).
//
/*jslint nomen: true, white: true, plusplus: true*/


var worldManager = {

// "PRIVATE" DATA

_game_status: 0,
_g_last_highest_brick: 0,
_g_highest_brick: 0,
_offset_y: 0,
_started: false,

// "PRIVATE" METHODS

// PUBLIC METHODS
deferredSetup : function () {

},

init: function() {

},

update: function(du) {
  //if (this._started) this._offset_y += (du / 3);
},

render: function(ctx) {

},

reset: function() {
    this._started = false;
    this._offset_y = 0;
    this._g_highest_brick = 0;
    this._g_last_highest_brick = 0;
},

getGameStatus: function() {
    return this._game_status;
},

setGameStatus: function(s) {
    this._game_status = s;
},

mousePressed: function() {
    if (this._game_status < 2) {
      if (g_mouseX > worldManager.startScreenButtonSpecs().x &&
           g_mouseX < worldManager.startScreenButtonSpecs().x + worldManager.startScreenButtonSpecs().w &&
           g_mouseY > worldManager.startScreenButtonSpecs().y &&
           g_mouseY < worldManager.startScreenButtonSpecs().y + worldManager.startScreenButtonSpecs().y) {
          this._game_status = 2;
          stopIntro();
          mainSong.currentTime = 0;
          startMain(); 
      }
    } if (this._game_status === 3) {
        stopMain(); //stops main song
        intro.currentTime = 0;
        startIntro();
        this.reset();
        entityManager.reset();
		Score.prototype.reset(); //resettar t.d. world time inni score.
        g_startDrop = false;
        spatialManager.reset();
        this._game_status = 1;
    }
},

startScreenButtonSpecs: function() {
     return {
         w: (550 * (g_canvas.width / 1000)),
         h: (130 * (g_canvas.height / 1000)),
         x: 20 * (g_canvas.width / 1000),
         y:  800 * (g_canvas.height / 1000)
     };
},

moveDown: function(du) {
   this._offset_y += du;
},

moveUp: function(du) {
   this._offset_y -= du;
},

getOffsetY: function() {
    return this._offset_y;
},

hasMoved: function() {
    return this._offset_y > 0;
},

start: function() {
    this._started = true
}
};

// Some deferred setup which needs the object to have been created first
worldManager.deferredSetup();

