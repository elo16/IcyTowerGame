// ================
// BACKGROUND STUFF
// ================

'use strict';

/* jshint browser: true, devel: true, globalstrict: true */
/* global g_OffSet: false */


/*
 0        1         2         3         4         5         6         7         8
 12345678901234567890123456789012345678901234567890123456789012345678901234567890
 */

function Background(descr) {
    this.setup(descr);
}

Background.prototype = new Entity(true);
Background.prototype.backY = 0;
Background.prototype.backVelY = 2;

Background.prototype.update = function (du) {
    //Þessi lina lætur skjainn færast a akveðnum hraða, a eftir að 
    //implementa þetta svo það virki fyrir bakrunninn.
    this.backY = (this.backY+this.backVelY*du) % g_canvas.height;
    //ATH hægt að lata þetta uppfæra skjainn á ákveðnum hraða.

};

Background.prototype.render = function (ctx) {
    //var prevfillStyle = ctx.fillStyle;
	g_OffSet += g_viewY;
	ctx.save();
	//console.log("g_OffSet "+(g_OffSet));
	//ctx.translate(0, -g_OffSet);
    var pattern = ctx.createPattern(g_images.backgroundImage, "repeat");
    ctx.fillStyle = pattern;
	//Background
    ctx.fillRect(BRICKFIELD_GUTTER, 0, ctx.canvas.width - BRICKFIELD_GUTTER, ctx.canvas.height);
    pattern = ctx.createPattern(g_images.wallImage, "repeat");
    ctx.fillStyle = pattern;
	//Left Wall
    ctx.fillRect(0, 0, BRICKFIELD_GUTTER, ctx.canvas.height);
	//Right Wall
    ctx.fillRect(ctx.canvas.width - BRICKFIELD_GUTTER, 0, BRICKFIELD_GUTTER, ctx.canvas.height);
	
	ctx.restore();
    //ctx.fillStyle = prevfillStyle;
};
