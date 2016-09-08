var g_levels = [];

/*
var arr = [];

//i hverri röð fær brick random staðsetningu.
function randomBrickPosition(){
	var brickPosition = Math.random()*12; //bætum 1 við ut af veggjum
	brickPosition = Math.round(brickPosition)
	return brickPosition; //teiknum brick a eftirfarandi staðsetningu
}

//hver brick fær akveðna lengd her.
function randomBrickLength(position){
	var brickWidth;
	if(position <= 11){
		brickWidth = (Math.random()*3)+3;
	}else{
		brickWidth = 4;
	}
	brickWidth = Math.round(brickWidth);
	return brickWidth; //gefum brick random lengd
}

for (i = 0; i < 30; i++) { //hæðin
	arr[i] = [];
	var brickPosition = randomBrickPosition();
	var lengthOfBrick = 0;
    for (j = 0; j < 16; j++) { //width
    	console.log(j+"  "+brickPosition);
	  	if (brickPosition === j) {
			lengthOfBrick = randomBrickLength(j); //segir til um hvar næsti brick á að byrja að teiknast
		}
		if(lengthOfBrick > 0 && Math.random() < 0.02){
			arr[i][j] = 2;
		}else if(lengthOfBrick > 0){
			arr[i][j] = 1;
		}else{
			arr[i][j] = 0;
		}
		lengthOfBrick--;
 	}

}

g_levels.push(arr);
*/



function addBricks(){

	g_levels[0].push(
	[0,0,0,1,2,0,0,0,0],
	[0,1,1,1,1],
	[1,1,1,1,0,0,0,2,1],
	[0,0,0,0,0,1,1,1,1,1,1,1],
	[0,0,1,1],
	[0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1],
	[0,0,0,0,0,0,1,1,1,1],
	[0,0,0,1,1,1,1],
	[1,1,1,1],
	[0,0,1,1,1,1],
	[1,1,1,1],
	[0,0,0,1,1,1,1,1,1],
	[0,1,1,1,1],
	[1,1,1,2],
	[0,0,0,0,0,1,1,1,1,1,1,1],
	[0,0,1,1],
	[0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1],
	[0,0,0,0,0,0,1,1,1,1],
	[0,0,0,1,1,1,1],
	[1,1,1,1],
	[0,0,1,1,1,1],
	[1,1,1,1],
	[0,0,0,1,1,1,1,1,1],
	[0,1,1,1,1],
	[1,1,1,1],
	[0,0,0,0,0,1,1,1,1,1,1,1],
	[0,0,1,1],
	[0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1],
	[0,0,0,0,0,0,1,1,1,1],
	[0,0,0,1,1,1,1],
	[1,1,1,1],
	[0,0,1,1,1,1],
	[1,1,1,1],
	[0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1],
	[0,0,0,0,0,0,1,1,1,1],
	[0,0,0,1,1,1,1],
	[1,1,1,1],
	[0,0,0,1,1,1,1,1,1],
	[1,1,1,1],
	[1,1,1,1]

	);
	entityManager.generateBricks();

}



g_levels.push([
[0,0,0,1,2,0,0,0,0],
[0,1,1,1,1],
[1,1,1,1,0,0,0,2,1],
[0,0,0,0,0,1,1,1,1,1,1,1],
[0,0,1,1],
[0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1],
[0,0,0,0,0,0,1,1,1,1],
[0,0,0,1,1,1,1],
[1,1,1,1],
[0,0,1,1,1,1],
[1,1,1,1],
[0,0,0,1,1,1,1,1,1],
[0,1,1,1,1],
[1,1,1,2],
[0,0,0,0,0,1,1,1,1,1,1,1],
[0,0,1,1],
[0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1],
[0,0,0,0,0,0,1,1,1,1],
[0,0,0,1,1,1,1],
[1,1,1,1],
[0,0,1,1,1,1],
[1,1,1,1],
[0,0,0,1,1,1,1,1,1],
[0,1,1,1,1],
[1,1,1,1],
[0,0,0,0,0,1,1,1,1,1,1,1],
[0,0,1,1],
[0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1],
[0,0,0,0,0,0,1,1,1,1],
[0,0,0,1,1,1,1],
[1,1,1,1],
[0,0,1,1,1,1],
[1,1,1,1],
[0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1],
[0,0,0,0,0,0,1,1,1,1],
[0,0,0,1,1,1,1],
[1,1,1,1],
[0,0,0,1,1,1,1,1,1],
[1,1,1,1],
[1,1,1,1]

]);
