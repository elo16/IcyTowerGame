// ===========
// SCORE STUFF
// ===========

'use strict';

/* jshint browser: true, devel: true, globalstrict: true */
/*global g_worldtime*/
/*global g_timeThreshMultiplier*/
/*global g_timeThresh*/

/*
 0        1         2         3         4         5         6         7         8
 12345678901234567890123456789012345678901234567890123456789012345678901234567890
 */


function Score(descr) {
    this.cx = g_canvas.height - 50;
	this.cy = 45;
	this.textUp = 0;
	//this.colorS = "blue";
}
 	
Score.prototype = new Entity(true);
Score.prototype.text = 0;
Score.prototype.lastUpdate = 0;
Score.prototype.Multiplier = 1;
Score.prototype.colorS = "blue";
Score.prototype.HurryUpXSpeed = 0;
Score.prototype.HurryUpYSpeed = 0;
Score.prototype.HurryUpDir = 2;	
var HurryUpText = false;
Score.prototype.CheerWords = ["I BELIEVE IN YOU !", "BRICKS ARE GETTING CLOSER","THIS IS YOUR MOMENT !", "YOU CAN DO THIS !", "FOCUS !", "TRY HARDER !", "YOU ARE AMAZING !", "CLIMB HIGHER !", "THE PRINCESS IS AT THE TOP !", "COMON BABY, JUMP !", "HURRY, YOUR MAKING PROGRESS !", "HURRY, JUST A FEW MORE STEPS !", "YOUR GOOD !", "WHAT A JUMPER !", "AMAZING JUMP KNOWLEDGE !", "LOOKING GOOD CHAMP !","FANTASTIC !"];
var Word = -1;

Score.prototype.reset = function() {
    g_worldtime = 0;
    g_timeThreshMultiplier = 1;
    g_timeThresh = 30 * SECS_TO_NOMINALS;
   	HurryUpText = false;
   	this.colorS = "blue";
   	this.Multiplier = 1;
   	this.lastUpdate = 0;
   	this.HurryUpXSpeed = 0;
   	this.HurryUpYSpeed = 0;
   	this.HurryUpDir=2;
   	this.text = 0;
};

Score.prototype.render = function (ctx) {
	
	ctx.save();
	ctx.globalAlpha = 0.8;
	if (g_debug) {
		ctx.font="bold 18px Comic Sans MS";
        ctx.textAlign="center";
        ctx.fillStyle = "red";
        ctx.fillText("DEBUG MODE ON",85,20);
	}
	//SCORE AND MULTIPIER
	ctx.font="bold 55px Comic Sans MS";
	ctx.textAlign="right";
	var grd = ctx.createRadialGradient(600, 0, 90, 20, 200, 90);
	grd.addColorStop(0, this.colorS);
	grd.addColorStop(0.4, "white");
	ctx.fillStyle = grd;
	ctx.fillText(this.text,this.cx,this.cy);
	ctx.fillText(Score.prototype.text.toString(),this.cx,this.cy);
	if (Score.prototype.Multiplier > 1 && Score.prototype.Multiplier <= 3) {
		ctx.font="bold 44px Comic Sans MS";
	}else if(Score.prototype.Multiplier >= 4){
		ctx.font="bold 54px Comic Sans MS";
	}else{
		ctx.font="bold 36px Comic Sans MS";
	}
	ctx.fillText(Score.prototype.Multiplier.toString()+'x',this.cx,this.cy+50);
	ctx.restore();
	
	if(HurryUpText){
		//CHEERWORDS
        ctx.save();
        ctx.font="bold 24px Comic Sans MS";
        ctx.globalAlpha = 0.8;
        ctx.textAlign="center";
        ctx.fillStyle = "#6EB1FF";
        ctx.fillText("HURRY UP "+this.CheerWords[Word],g_canvas.width/2 + this.HurryUpXSpeed ,(g_canvas.height-400)-this.HurryUpYSpeed);
		ctx.restore();
	}


	//POWERUP TEXT
	if(g_duration <= 50){
		ctx.save();
		ctx.font="bold 25px Comic Sans MS";
		ctx.fillStyle = '#FEFF9B';
		ctx.globalAlpha = 0.4;
		ctx.textAlign = "center";
		ctx.fillText(g_powerText,posStarX,posStarY+g_OffSet-20+textHigher);
		ctx.restore();
	}
};

Score.prototype.update = function (du) {
	var flooredY = Math.round(worldManager._offset_y/30);
	if(flooredY > this.text) {
		Score.prototype.text = flooredY;
	}

	if (worldManager._g_highest_brick === 0){
		Score.prototype.lastUpdate = 0;
		Score.prototype.Multiplier = 1;
	}
	//guyVelY er velocityY a guy.
	//if(Math.abs(guyVelY) > -0.5)
	var heightDifference = worldManager._g_highest_brick - worldManager._g_last_highest_brick;

	if(heightDifference > 10){
		Score.prototype.Multiplier = heightDifference/10;
	} else if(heightDifference === 10) {
		Score.prototype.Multiplier = 1;
	}
	if(Score.prototype.PowerMultiplier){
		Score.prototype.Multiplier *= 2;
	}
	if(worldManager._g_highest_brick > Score.prototype.lastUpdate) {
		Score.prototype.lastUpdate = worldManager._g_highest_brick;
		Score.prototype.text += heightDifference * Score.prototype.Multiplier;
	}
	
if(HurryUpText === true){
	    
	    this.HurryUpYSpeed +=1.5;
	    
	    
	    if(g_canvas.width/2 +this.HurryUpXSpeed <= g_canvas.width/4 - 50){
	    	this.HurryUpDir = 2;
	    }
		if(g_canvas.width/2 +this.HurryUpXSpeed >= g_canvas.width/4 + 50){
		    this.HurryUpDir = -2;
		}
		
        this.HurryUpXSpeed += this.HurryUpDir;
		

        if(g_canvas.height - this.HurryUpYSpeed < 0 ){
                this.HurryUpYSpeed = 10;
                HurryUpText = false;

         }
}

};


