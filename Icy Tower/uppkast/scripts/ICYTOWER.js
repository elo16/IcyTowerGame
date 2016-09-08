// =========
// ASTEROIDS
// =========
/*

A sort-of-playable version of the classic arcade game.


HOMEWORK INSTRUCTIONS:

You have some "TxODO"s to fill in again, particularly in:

spatialManager.js

But also, to a lesser extent, in:

Rock.js
Bullet.js
Ship.js


...Basically, you need to implement the core of the spatialManager,
and modify the Rock/Bullet/Ship to register (and unregister)
with it correctly, so that they can participate in collisions.

*/

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

var g_canvas = document.getElementById("myCanvas");
var g_ctx = g_canvas.getContext("2d");

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// ====================
// CREATE INITIAL GUY
// ====================

function createGuy() {

    entityManager.generateGuy({
        cx : 200,
        cy : g_canvas.height - 100
    });
    
}

// =============
// GATHER INPUTS
// =============

function gatherInputs() {
    // Nothing to do here!
    // The event handlers do everything we need for now.
}


// =================
// UPDATE SIMULATION
// =================

// We take a very layered approach here...
//
// The primary `update` routine handles generic stuff such as
// pausing, single-step, and time-handling.
//
// It then delegates the game-specific logic to `updateSimulation`


// GAME-SPECIFIC UPDATE LOGIC

function updateSimulation(du) {
    
    processDiagnostics();
    
    if (worldManager.getGameStatus() < 2) {
       if (g_mouseX > worldManager.startScreenButtonSpecs().x &&
           g_mouseX < worldManager.startScreenButtonSpecs().x + worldManager.startScreenButtonSpecs().w &&
           g_mouseY > worldManager.startScreenButtonSpecs().y &&
           g_mouseY < worldManager.startScreenButtonSpecs().y + worldManager.startScreenButtonSpecs().y) {
            document.body.style.cursor = 'pointer';
            worldManager.setGameStatus(1.5);
       } else {
            document.body.style.cursor = 'default';
            worldManager.setGameStatus(1);
       }
    } else if (worldManager.getGameStatus() === 2) {
        worldManager.update(du);
        entityManager.update(du);

        // Prevent perpetual jumping!
        eatKey(Guy.prototype.KEY_JUMP);
        eatKey(Guy.prototype.KEY_UP);
    } else if (worldManager.getGameStatus() === 3) {

    }
}

// GAME-SPECIFIC DIAGNOSTICS

var g_allowMixedActions = true;
var g_renderSpatialDebug = false;

var KEY_MIXED   = keyCode('M');
var KEY_SPATIAL = keyCode('X');

var KEY_HALT  = keyCode('H');
var KEY_RESET = keyCode('R');

var KEY_0 = keyCode('0');

var KEY_1 = keyCode('1');
var KEY_2 = keyCode('2');

var KEY_K = keyCode('K');

function processDiagnostics() {
    if (eatKey(KEY_SPATIAL)) g_renderSpatialDebug = !g_renderSpatialDebug;
}


// =================
// RENDER SIMULATION
// =================

// We take a very layered approach here...
//
// The primary `render` routine handles generic stuff such as
// the diagnostic toggles (including screen-clearing).
//
// It then delegates the game-specific logic to `gameRender`


// GAME-SPECIFIC RENDERING

function renderSimulation(ctx) {

    if (worldManager.getGameStatus() < 2) {
        ctx.drawImage(worldManager.getGameStatus() === 1 ? g_images.startScreen : g_images.startScreen2, 0, 0, 1000, 1000, 0, 0, g_canvas.width, g_canvas.height);

        if (g_renderSpatialDebug) {
            var oldStyle = ctx.strokeStyle;
            ctx.strokeStyle = "red";
            // Splash image is originally 1000px, scale the box (using the same methods as in the mouse
            // detection, instead of ctx.scale)
            util.strokeBox(ctx,
                           worldManager.startScreenButtonSpecs().x1,
                           worldManager.startScreenButtonSpecs().y1,
                           worldManager.startScreenButtonSpecs().w,
                           worldManager.startScreenButtonSpecs().h);
            ctx.strokeStyle = oldStyle;
        }
    } else if (worldManager.getGameStatus() === 2) {
        worldManager.render(ctx);
        entityManager.render(ctx);
        //drawEveryBrick(ctx);
        if (g_renderSpatialDebug) {
            var oldStyle = ctx.strokeStyle;
            ctx.strokeStyle = "red";
            util.strokeBox(ctx, BRICKFIELD_GUTTER, 0, BRICKFIELD_WIDTH, g_canvas.height);
            ctx.strokeStyle = oldStyle;

            spatialManager.render(ctx);

        }
    } else if (worldManager.getGameStatus() === 3) {
        ctx.drawImage(g_images.gameOverScreen, 0, 0, 1000, 1000, 0, 0, g_canvas.width, g_canvas.height);
        ctx.fillStyle = 'red';
        ctx.font = 'bold 20pt Arial';
        ctx.strokeStyle = 'black';
        ctx.textAlign = 'center';
        ctx.lineWidth = 4;
        ctx.strokeText('0', g_canvas.width / 2, 440);
        ctx.fillText('0', g_canvas.width / 2, 440);
    }
}


// =============
// PRELOAD STUFF
// =============

var g_images = {};

function requestPreloads() {

    var requiredImages = {
        guyStandstillImage   : "assets/guy_standstill.png",
        guyRunningImage   : "assets/guy_running.png",
        guyJumpingImage   : "assets/guy_jumping.png",
        backgroundImage : "https://notendur.hi.is/~ybb1/42_Bricks_Dk.png",
        wallImage : "https://notendur.hi.is/~ybb1/brick_wall_tiled_perfect.png",
        bricks1 : "assets/brickSprites/bricks1.png",
        star : "assets/star2.png",
        bricksice : "assets/brickSprites/bricksice.png",
        grass : "assets/brickSprites/grass.png",
        startScreen: "assets/start-screen.png",
        startScreen2: "assets/start-screen2.png",
        gameOverScreen: "assets/game-over-screen.png"
    };

    imagesPreload(requiredImages, g_images, preloadDone);
}

var g_sprites = {};

function preloadDone() {
    g_sprites.brick = new Sprite(g_images.bricks1);
    g_sprites.star = new Sprite(g_images.star);
    g_sprites.bricksice = new Sprite(g_images.bricksice);
    g_sprites.grass = new Sprite(g_images.grass);
    entityManager.init();

    createGuy();

    main.init();
}

// Kick it off
requestPreloads();
