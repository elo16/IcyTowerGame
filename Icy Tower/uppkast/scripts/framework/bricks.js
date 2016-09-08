function Bricks(descr) {
this.setup(descr);
    
}

Bricks.prototype = new Entity(true);

Bricks.prototype.width = 50;
Bricks.prototype.height = 25; 

Bricks.prototype.rend = function (ctx) {
    // (cx, cy) is the centre; must offset it for drawing
	ctx.save();
   	//ctx.translate(0, g_viewY);
	ctx.drawImage(g_images.bricks1, 0,0,20,20,this.cx,
                 this.cy,
                 (this.width),
                 (this.height));
    /*var pattern = ctx.createPattern(g_images.bricks1, "repeat");
    ctx.fillStyle = pattern;
    ctx.fillRect(this.cx,
                 this.cy,
                 (this.width),
                 (this.height));*/
    
        ctx.restore();
};


//i hverri röð fær brick random staðsetningu.
function randomBrickPosition(){
	var brickPosition = Math.random()*8+1; //bætum 1 við ut af veggjum
	brickPosition = Math.round(brickPosition)
	return brickPosition; //teiknum brick a eftirfarandi staðsetningu
}

//hver brick fær akveðna lengd her.
function randomBrickLength(position){
	var brickWidth;
	if(position < 10){
		brickWidth = (Math.random()*2)+4;
	}
	brickWidth = Math.round(brickWidth);
	return brickWidth; //gefum brick random lengd
}

var cols =12;
var rows = 6;
var aBrick = [];
var heightBetweenBricks = 100; //skilgreinum hæð á milli bricks.

function starterBricks(){
	for (var i = 0; i < rows; i++) {
		var brickPosition = randomBrickPosition();
		var lengthOfBrick = 0;
		aBrick[i] = [];
		
		for (var j = 1; j < cols-1; j++) { //byrjar i 1 og cols-1 ut af veggjunum.
			
			if (brickPosition === j) {
				lengthOfBrick = randomBrickLength(j); //segir til um hvar næsti brick á að byrja að teiknast
			}
			//Debug comment til að fá bricks allsstaðar
			if(lengthOfBrick > 0){  //allir bricks sem a að teikna
	            aBrick[i].push(new Bricks({
	            cx : j*Bricks.prototype.width,
	            cy : i*heightBetweenBricks,
	            color : "black",
	            lives : 1,
	            brickAlive : true //brickAlive segir til um hverjir eru teiknaðir og hverjir ekki
	        }));
            }else{                  //allir bricks sem a ekki að teikna
            	aBrick[i].push(new Bricks({
	            cx : j*Bricks.prototype.width,
	            cy : i*heightBetweenBricks,
	            color : "blue",
	            lives : 1,
	            brickAlive : false
	            }));

            }
            lengthOfBrick--;  //takmarkar það hvað hver brick getur verið langur.
        }
	}
}

starterBricks();  //makes the bricks

function drawEveryBrick(ctx){
	for (var i = 0; i < rows; i++) {
		var brickRow = aBrick[i];
		if(brickRow){
			for (var j = 0; j < brickRow.length; j++) {
				if (brickRow[j].brickAlive) {
					brickRow[j].rend(ctx);
				};
			}
		}
    }
}


Bricks.prototype.render = function(ctx){
    drawEveryBrick(ctx);
}

Bricks.prototype.update = function(du){
    spatialManager.unregister(this);

    if (this.isDeadNow()) {
        return entityManager.KILL_ME_NOW;
    }

    spatialManager.register(this);
	if(g_viewY > 0){
		var numberOfRows = Math.round(g_OffSet/heightBetweenBricks);
		var brickPosition = randomBrickPosition();
		//console.log("aBrick[0][0].cy "+
		/*if(g_OffSet%heightBetweenBricks==0){
			console.log("Update fired");
			//Henda heilli línu
			aBrick.shift();
			//Búa til nýjan línu aftast
			//
			for (var j = 1; j < cols-1; j++) {
				aBrick[j].push(new Bricks({
					cx : j*Bricks.prototype.width,
					cy : 350,
					color : "blue",
					lives : 1,
					brickAlive : true
					}));
			}
		}*/
		for(var i = 0; i < rows; i++){	
			var brickRow = aBrick[i];
			//Hent ef cy er < 0
			for(var j = 0; j < brickRow.length; j++){
				if(brickRow[j].cy+g_viewY>g_canvas.height){
					console.log("Update fired");
					//Should create a new brick
					/*aBrick[i] = [];
					aBrick[i].push(new Bricks({
					cx : j*Bricks.prototype.width,
					cy : 0+g_viewY,
					color : "blue",
					lives : 1,
					brickAlive : true
					}));*/
					//Færir neðstu línuna efst
					brickRow[j].cy = (0+g_viewY);
				} else {
					//Brick hreyfður um bil frá yDeadZone (g_viewY)
					brickRow[j].cy = (brickRow[j].cy+g_viewY);
				}
			}
		}
	}
}


Bricks.isColliding = function(guyX,guyY){
    for(var i = 0; i < aBrick.length; i++){
		var brickRow = aBrick[i];
		for (var j = 0; j < brickRow.length; j++) {
            if(guyX> brickRow[j].cx && guyX < brickRow[j].cx + Bricks.prototype.width){
                if(guyY > brickRow[j].cy -50 && guyY< brickRow[j].cy + Bricks.prototype.height-50){
                    if(brickRow[j].brickAlive == true){
                    	//console.log("aBrick[i][j].cy er : "+aBrick[i][j].cy+ "Bricks.prototype.height er :  "+Bricks.prototype.height);
                        return brickRow[j].cy;
                    }
                }
            }
        }
    }
    return false;
}
