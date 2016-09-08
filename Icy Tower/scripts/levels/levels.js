var g_levels = [];



function generateLevels(){

	lvl1();
	lvl2();
	lvl3();
	lvl4();
	//lvl5();
	lvl6();

	for (var i = 0; i < 20; i++) {
		lvl6();
	}

}

generateLevels();