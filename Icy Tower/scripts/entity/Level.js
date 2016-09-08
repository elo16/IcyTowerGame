'use strict';

/* jshint browser: true, devel: true, globalstrict: true */

/*
 0        1         2         3         4         5         6         7         8
 12345678901234567890123456789012345678901234567890123456789012345678901234567890
 */

// A generic contructor which accepts an arbitrary descriptor object
function Level(descr) {
    // Common inherited setup logic from Entity
    this.setup(descr);
    // Jumping animated sprite for future use.
    this.randomisePosition();
    this.width = 50;
};

Level.prototype = new Entity();

Level.prototype.randomisePosition = function () {
    this.cx = this.cx || Math.random() * g_canvas.width;
    this.cy = g_canvas.height - this._SpatialID * 10;
    };
    
Level.prototype.render = function(ctx){
    ctx.fillRect(this.cx, this.cy, this.width, 10);
}