var UNIT = 26,
    CANVAS_HEIGHT = UNIT * 20,
    CANVAS_WIDTH = UNIT * 10,
    BLOCK_WIDTH = UNIT - 2,
    INTERVAL = 570, // 570
    tetriminoPool = [],
    isGameOver = false,
    refreshIntervalId,
    ctx,
    ctx2,
    activeTetrimino,
    count = 0,
    LEFT = 37,
    SPACE = 32,
    RIGHT = 39,
    DOWN = 40,
    X = 88,
    Z = 90,
    darkGray = "#272822",
    canvasElem,
    sidekickElem,
    score = 0,
    onDeckTetrimino = new Tetrimino(true);

function restartGame() {
    canvasElem.style.opacity = "1";
    score = 0;
    onDeckTetrimino = new Tetrimino(true);
    tetriminoPool.length = 0;
    refreshIntervalId = setInterval(updateActive, INTERVAL);
    isGameOver = false;
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx2.clearRect(0, 0, ctx2.canvas.width, ctx2.canvas.height);
    spawnTetrimino();
    setUpSidekickText();
}

function updateActive() {
    if (! isGameOver) {
        activeTetrimino.update();
    }
}

function spawnTetrimino() {
    if (! isGameOver) {
        activeTetrimino = new Tetrimino();
        tetriminoPool.push(activeTetrimino);

        onDeckTetrimino = new Tetrimino(true);
        onDeckTetrimino.clearOnDeck();
        onDeckTetrimino.drawOnDeck();
    }
}

function clearFullLines() {
    var currentLine = 19, // starting at the bottom
        currentY,
        blocksToBeCleared = [],
        totalLinesCleared = 0;

    while (currentLine >= 0) {
        currentY = UNIT * currentLine;

        for (var i = 0; i < tetriminoPool.length; i++) {
            for (var j = 0; j <= 3; j++) {
                if (tetriminoPool[i].blocks[j].y === currentY) {
                    blocksToBeCleared.push(tetriminoPool[i].blocks[j]);
                }
            }
        }

        if (blocksToBeCleared.length === 10) {
            clearLine(blocksToBeCleared, currentY);
            totalLinesCleared++;
        } else {
            currentLine--;
        }

        blocksToBeCleared.length = 0;
    }

    if (totalLinesCleared > 0) {
        if (totalLinesCleared >= 4) {
            score += 10 * totalLinesCleared + 10;
        } else {
            score += 10 * totalLinesCleared;
        }

        updateScore();
    }
}

function clearLine(blocks, currentY) {
    var blocksToBeMovedDown = [];

    for (var i = 0; i < blocks.length; i++) {
        blocks[i].clear();
        blocks[i].y += UNIT;
    }

    for (i = 0; i < tetriminoPool.length; i++) {
        for (var j = 0; j <= 3; j++) {
            if (tetriminoPool[i].blocks[j].y < currentY) {
                blocksToBeMovedDown.push(tetriminoPool[i].blocks[j]);
            }
        }
    }

    for (i = 0; i < blocksToBeMovedDown.length; i++) {
        blocksToBeMovedDown[i].clear();
    }

    for (i = 0; i < blocksToBeMovedDown.length; i++) {
        blocksToBeMovedDown[i].y += UNIT;
        blocksToBeMovedDown[i].draw();
    }
}

function handleKeyDown(event) {
    if (isGameOver) {
        restartGame();
        return;
    }

    switch (event.keyCode) {
        case LEFT:
            activeTetrimino.shiftHorizontally(-1);
            break;
        case RIGHT:
            activeTetrimino.shiftHorizontally(1);
            break;
        case SPACE:
            activeTetrimino.dropToGhostLocation();
            break;
        case DOWN:
            activeTetrimino.drop();
            break;
        case X:
            activeTetrimino.rotate("CW");
            break;
        case Z:
            activeTetrimino.rotate("CCW");
            break;
    }
}

function setUpSidekickText() {
    var textWidth;

    ctx2.font = "22px Menlo, Consolas, Monaco, Lucida Console, " +
                "Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, " +
                "Courier New, monospace, serif";
    ctx2.fillStyle = "#FFF";

    textWidth = ctx2.measureText("Up next").width;
    ctx2.fillText("Up next", sidekickElem.width / 2 - textWidth / 2, 35);

    textWidth = ctx2.measureText("Score").width;
    ctx2.fillText("Score", sidekickElem.width / 2 - textWidth / 2, 200);

    updateScore();
}

function updateScore() {
    var textWidth;

    ctx2.clearRect(0, 210, sidekickElem.width, 70);

    ctx2.font = "28px Menlo, Consolas, Monaco, Lucida Console, " +
                "Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, " +
                "Courier New, monospace, serif";
    ctx2.fillStyle = "#FFF";

    textWidth = ctx2.measureText(score).width;
    ctx2.fillText(score, sidekickElem.width / 2 - textWidth / 2, 238);
}

function doGameOver() {
    var string1 = "GAME",
        string2 = "OVER",
        string3 = "Press any key to restart",
        textWidth;

    clearInterval(refreshIntervalId);

    canvasElem.style.opacity = "0.7";

    ctx.shadowColor = darkGray;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.fillStyle = "#FFF";
    ctx.font =  "bold 90px Menlo, Consolas, Monaco, Lucida Console, " +
                "Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, " +
                "Courier New, monospace, serif";

    textWidth = ctx.measureText(string1).width;
    ctx.fillText(string1, CANVAS_WIDTH / 2 - textWidth / 2, 230);

    textWidth = ctx.measureText(string2).width;
    ctx.fillText(string2, CANVAS_WIDTH / 2 - textWidth / 2, 330);

    ctx.font = "16px Menlo, Consolas, Monaco, Lucida Console, " +
            "Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, " +
            "Courier New, monospace, serif";

    textWidth = ctx.measureText(string3).width;
    ctx.fillText(string3, CANVAS_WIDTH / 2 - textWidth / 2, 380);

    ctx.shadowColor = "rgba(0, 0, 0, 0)"; // reset to default
}

document.addEventListener("DOMContentLoaded", function() {
    canvasElem = document.getElementById("tetris");
    sidekickElem = document.getElementById("sidekick");

    ctx = canvasElem.getContext("2d");
    ctx2 = sidekickElem.getContext("2d");

    window.addEventListener("keydown", handleKeyDown, true);

    refreshIntervalId = setInterval(updateActive, INTERVAL);

    spawnTetrimino();
    setUpSidekickText();
}, false);
