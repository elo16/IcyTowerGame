// ============
// ANIMATED SPRITE
// ============

'use strict';

/* jshint browser: true, devel: true, globalstrict: true */

/*
 0        1         2         3         4         5         6         7         8
 12345678901234567890123456789012345678901234567890123456789012345678901234567890
 */


// Construct a "sprite" from the given `image`,
//
function AnimatedSprite(image, width, height, displayWidth, displayHeight, speed, frames) {
    this.image = image;
    this.width = width;
    this.height = height;
    this.displayWidth = displayWidth;
    this.displayHeight = displayHeight;
    this.frames = frames;
    this.speed = speed;

    this._frameIndex = 0;
}

AnimatedSprite.prototype.update = function (du) {
    this._frameIndex += this.speed * du;
};

AnimatedSprite.prototype.render = function (ctx, cx, cy, rotation) {
    ctx.save();
    var frame = Math.floor(this._frameIndex) % this.frames.length;
    ctx.translate(-this.displayWidth / 2, -this.displayHeight / 2);
    ctx.drawImage(this.image,
        this.frames[frame] * this.width, 0,
        this.width, this.height,
        cx, cy,
        this.displayWidth, this.displayHeight);
    ctx.restore();
};