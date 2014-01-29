function Tetrimino(isOnDeck) {
    if (isOnDeck !== undefined && isOnDeck) {
        this.type = this.chooseTetriminoType();
        this.blocks = this.initializeBlocks(); // block with index 1 acts as the
        this.offsetOnDeckBlocks();             // "pivot" block (except for "I")
        this.position = 1; // range of 1-4
    } else {
        this.isActive = true;
        this.type = onDeckTetrimino.type;
        this.blocks = this.initializeBlocks();           // block with index 1 acts as the
        this.ghostBlocks = this.getGhostLocation(false); // "pivot" block (except for "I")
        this.position = 1; // range of 1-4
    }
}

Tetrimino.prototype.update = function() {
    if (this.isActive) {
        if (this.collidesVertically(this.blocks)) {
            clearFullLines();
            if (this.hasHitCeiling()) {
                isGameOver = true;
                doGameOver();
            }

            this.isActive = false;
            spawnTetrimino();
        } else {
            this.clear();
            this.reposition(0, UNIT);
        }
    }

    if (! isGameOver) {
        this.draw();
    }
};

Tetrimino.prototype.reposition = function(xDelta, yDelta, blocks) {
    if (blocks === undefined) {
        blocks = this.blocks;
    }

    for (var i = 0; i <= 3; i++) {
        blocks[i].x += xDelta;
        blocks[i].y += yDelta;
    }
};

Tetrimino.prototype.clear = function() {
    for (var i = 0; i <= 3; i++) {
        this.blocks[i].clear();
    }
};

Tetrimino.prototype.clearGhost = function() {
    for (var i = 0; i <= 3; i++) {
        this.ghostBlocks[i].clear();
    }
};

Tetrimino.prototype.clearOnDeck = function() {
    ctx2.clearRect(0, UNIT * 3, ctx.canvas.width, UNIT * 2);
};

Tetrimino.prototype.collidesVertically = function(blocks, isInTetriminoPool) {
    var tetriminoPoolLength;

    if (isInTetriminoPool !== undefined && ! isInTetriminoPool) {
        tetriminoPoolLength = tetriminoPool.length;
    } else {
        tetriminoPoolLength = tetriminoPool.length - 1;
    }

    if (! this.hasHitFloor(blocks)) {
        for (var i = 0; i <= 3; i++) { // each block of active tetrimino
            for (var j = 0; j < tetriminoPoolLength; j++) { // check all tets except for current
                for (var k = 0; k <= 3; k++) { // each block of another tetrimino
                    if (tetriminoPool[j].blocks[k].y === blocks[i].y + UNIT &&
                        tetriminoPool[j].blocks[k].x === blocks[i].x) {
                        return true;
                    }
                }
            }
        }
    } else {
        return true;
    }

    return false;
};

Tetrimino.prototype.willIntersect = function(blocks) {
    if (this.willHitWall(blocks) || this.willHitFloor(blocks)) {
        return true;
    }

    for (var i = 0; i <= 3; i++) { // each block of active tetrimino
        for (var j = 0; j < tetriminoPool.length - 1; j++) { // check all tets except for current
            for (var k = 0; k <= 3; k++) { // each block of another tetrimino
                if (tetriminoPool[j].blocks[k].y === blocks[i].y &&
                    tetriminoPool[j].blocks[k].x === blocks[i].x) {
                    return true;
                }
            }
        }
    }

    return false;
};

// Tetrimino.prototype.hasCollidedHorizontally = function() {
//     return this.collidesHorizontally(this.blocks);
// };

// Tetrimino.prototype.hasCollidedVertically = function() {
//     return this.collidesVertically(this.blocks);
// };

Tetrimino.prototype.hasHitFloor = function(blocks) {
    for (var i = 0; i <= 3; i++) {
        if (blocks[i].y >= CANVAS_HEIGHT - UNIT) {
            return true;
        }
    }

    return false;
};

Tetrimino.prototype.willHitFloor = function(blocks) {
    for (var i = 0; i <= 3; i++) {
        if (blocks[i].y >= CANVAS_HEIGHT) {
            return true;
        }
    }

    return false;
};

Tetrimino.prototype.willHitWall = function(blocks) {
    for (var i = 0; i <= 3; i++) {
        if (blocks[i].x <= -1 || blocks[i].x >= CANVAS_WIDTH) {
            return true;
        }
    }

    return false;
};

Tetrimino.prototype.hasHitCeiling = function() {
    for (var i = 0; i <= 3; i++) {
        if (this.blocks[i].y <= 0) {
            return true;
        }
    }

    return false;
};
Tetrimino.prototype.chooseTetriminoType = function() {
    var type = Math.floor(Math.random() * 7) + 1,
        name;

    switch (type) {
        case 1:
            name = "I";
            break;
        case 2:
            name = "O";
            break;
        case 3:
            name = "T";
            break;
        case 4:
            name = "S";
            break;
        case 5:
            name = "Z";
            break;
        case 6:
            name = "J";
            break;
        case 7:
            name = "L";
            break;
    }

    return name;
};

Tetrimino.prototype.initializeBlocks = function() {
    var blocks = [],
        fillColor;

    switch (this.type) {
        case "I":
            fillColor = "#68D8EE"; // light blue
            blocks.push(new Block(UNIT * 3, -UNIT, fillColor)); // 0123
            blocks.push(new Block(UNIT * 4, -UNIT, fillColor));
            blocks.push(new Block(UNIT * 5, -UNIT, fillColor));
            blocks.push(new Block(UNIT * 6, -UNIT, fillColor));
            break;
        case "O":
            fillColor = "#E7DB75"; // yellow
            blocks.push(new Block(UNIT * 4, -UNIT, fillColor)); // 01
            blocks.push(new Block(UNIT * 5, -UNIT, fillColor)); // 23
            blocks.push(new Block(UNIT * 4, 0, fillColor));
            blocks.push(new Block(UNIT * 5, 0, fillColor));
            break;
        case "T":
            fillColor = "#AE82FE"; // purple
            blocks.push(new Block(UNIT * 3, 0, fillColor)); //  3
            blocks.push(new Block(UNIT * 4, 0, fillColor)); // 012
            blocks.push(new Block(UNIT * 5, 0, fillColor));
            blocks.push(new Block(UNIT * 4, -UNIT, fillColor));
            break;
        case "S":
            fillColor = "#A6E12D"; // green
            blocks.push(new Block(UNIT * 3, 0, fillColor)); //  23
            blocks.push(new Block(UNIT * 4, 0, fillColor)); // 01
            blocks.push(new Block(UNIT * 4, -UNIT, fillColor));
            blocks.push(new Block(UNIT * 5, -UNIT, fillColor));
            break;
        case "Z":
            fillColor = "#F92772"; // red
            blocks.push(new Block(UNIT * 5, 0, fillColor)); // 32
            blocks.push(new Block(UNIT * 4, 0, fillColor)); //  10
            blocks.push(new Block(UNIT * 4, -UNIT, fillColor));
            blocks.push(new Block(UNIT * 3, -UNIT, fillColor));
            break;
        case "J":
            fillColor = "#344CEB"; // dark blue
            blocks.push(new Block(UNIT * 3, 0, fillColor)); // 3
            blocks.push(new Block(UNIT * 4, 0, fillColor)); // 012
            blocks.push(new Block(UNIT * 5, 0, fillColor));
            blocks.push(new Block(UNIT * 3, -UNIT, fillColor));
            break;
        case "L":
            fillColor = "#FE9721"; // orange
            blocks.push(new Block(UNIT * 3, 0, fillColor)); //   3
            blocks.push(new Block(UNIT * 4, 0, fillColor)); // 012
            blocks.push(new Block(UNIT * 5, 0, fillColor));
            blocks.push(new Block(UNIT * 5, -UNIT, fillColor));
            break;
    }

    return blocks;
};

// direction: "CCW" or "CW"
Tetrimino.prototype.rotate = function(direction) {
    if (this.type === "O") {
        return;
    }

    var testBlocks = this.initializeBlocks(), // set test blocks to position 1
        destinationPosition,
        xOffset,
        yOffset;

    // move test blocks to the location of the active tetrimino
    if (this.type === "I") {
        var iPivotLocation = this.getIPivotLocation();

        xOffset = iPivotLocation[0] - testBlocks[1].x; // current position minus
        yOffset = iPivotLocation[1] - testBlocks[1].y; // the original position
    } else {
        xOffset = this.blocks[1].x - testBlocks[1].x; // current position minus
        yOffset = this.blocks[1].y - testBlocks[1].y; // the original position
    }

    for (var i = 0; i <= 3; i++) {
        testBlocks[i].x += xOffset;
        testBlocks[i].y += yOffset;
    }

    if (direction === "CW") {
        destinationPosition = this.incrementPosition();
    } else if (direction === "CCW") {
        destinationPosition = this.decrementPosition();
    }

    switch (this.type) {
        case "I":
            switch (destinationPosition) {
                case 1:
                    break;
                case 2:
                    testBlocks[0].x += UNIT * 2;
                    testBlocks[0].y += -UNIT;
                    testBlocks[1].x += UNIT;
                    testBlocks[2].y += UNIT;
                    testBlocks[3].x += -UNIT;
                    testBlocks[3].y += UNIT * 2;
                    break;
                case 3:
                    testBlocks[0].y += UNIT;
                    testBlocks[1].y += UNIT;
                    testBlocks[2].y += UNIT;
                    testBlocks[3].y += UNIT;
                    break;
                case 4:
                    testBlocks[0].x += UNIT;
                    testBlocks[0].y += -UNIT;
                    testBlocks[2].x += -UNIT;
                    testBlocks[2].y += UNIT;
                    testBlocks[3].x += -UNIT * 2;
                    testBlocks[3].y += UNIT * 2;
                    break;
            }
            break;
        case "T":
            switch (destinationPosition) {
                case 1:
                    break;
                case 2:
                    testBlocks[0].x += UNIT;
                    testBlocks[0].y += UNIT;
                    break;
                case 3:
                    testBlocks[3].y += UNIT * 2;
                    break;
                case 4:
                    testBlocks[2].x += -UNIT;
                    testBlocks[2].y += UNIT;
                    break;
            }
            break;
        case "S":
            switch (destinationPosition) {
                case 1:
                    break;
                case 2:
                    testBlocks[0].x += UNIT * 2;
                    testBlocks[3].y += UNIT * 2;
                    break;
                case 3:
                    testBlocks[0].y += UNIT;
                    testBlocks[2].y += UNIT * 2;
                    testBlocks[3].y += UNIT;
                    break;
                case 4:
                    testBlocks[2].y += UNIT * 2;
                    testBlocks[3].x += -UNIT * 2;
                    break;
            }
            break;
        case "Z":
            switch (destinationPosition) {
                case 1:
                    break;
                case 2:
                    testBlocks[2].y += UNIT * 2;
                    testBlocks[3].x += UNIT * 2;
                    break;
                case 3:
                    testBlocks[0].y += UNIT;
                    testBlocks[2].y += UNIT * 2;
                    testBlocks[3].y += UNIT;
                    break;
                case 4:
                    testBlocks[0].x += -UNIT * 2;
                    testBlocks[3].y += UNIT * 2;
                    break;
            }
            break;
        case "J":
            switch (destinationPosition) {
                case 1:
                    break;
                case 2:
                    testBlocks[0].x += UNIT;
                    testBlocks[0].y += UNIT;
                    testBlocks[2].y += -UNIT;
                    testBlocks[3].x += UNIT;
                    break;
                case 3:
                    testBlocks[3].x += UNIT * 2;
                    testBlocks[3].y += UNIT * 2;
                    break;
                case 4:
                    testBlocks[0].y += UNIT;
                    testBlocks[2].x += -UNIT;
                    testBlocks[2].y += UNIT;
                    testBlocks[3].x += UNIT;
                    break;
            }
            break;
        case "L":
            switch (destinationPosition) {
                case 1:
                    break;
                case 2:
                    testBlocks[0].x += UNIT;
                    testBlocks[0].y += UNIT;
                    testBlocks[2].y += UNIT;
                    testBlocks[3].x += -UNIT;
                    break;
                case 3:
                    testBlocks[3].x += -UNIT * 2;
                    testBlocks[3].y += UNIT * 2;
                    break;
                case 4:
                    testBlocks[0].y += -UNIT;
                    testBlocks[2].x += -UNIT;
                    testBlocks[2].y += UNIT;
                    testBlocks[3].x += -UNIT;
                    break;
            }
            break;
    }

    if (! this.willIntersect(testBlocks)) {
        this.clearGhost();
        this.clear();
        this.blocks = testBlocks;
        this.position = destinationPosition;
        this.draw();
    }
};

Tetrimino.prototype.incrementPosition = function() {
    var newPosition = this.position + 1;

    if (newPosition === 5) {
        newPosition = 1;
    }

    return newPosition;
};

Tetrimino.prototype.decrementPosition = function() {
    var newPosition = this.position - 1;

    if (newPosition === 0) {
        newPosition = 4;
    }

    return newPosition;
};

Tetrimino.prototype.getIPivotLocation = function() {
    var x, y;

    switch (this.position) {
        case 1:
        case 4:
            x = this.blocks[1].x;
            y = this.blocks[1].y;
            break;
        case 2:
            x = this.blocks[1].x - UNIT;
            y = this.blocks[1].y;
            break;
        case 3:
            x = this.blocks[1].x;
            y = this.blocks[1].y - UNIT;
            break;
}

    return [x, y];
};

Tetrimino.prototype.draw = function() {
    this.drawGhost();

    for (var i = 0; i <= 3; i++) {
        this.blocks[i].draw();
    }
};

Tetrimino.prototype.drawOnDeck = function() {
    for (var i = 0; i <= 3; i++) {
        this.blocks[i].drawOnDeck();
    }
};

Tetrimino.prototype.clone = function() {
    var newBlocks = [],
        currentBlock;

    for (var i = 0; i <= 3; i++) {
        currentBlock = this.blocks[i];

        newBlocks.push(
            new Block(
                currentBlock.x,
                currentBlock.y,
                currentBlock.color
            )
        );
    }

    return newBlocks;
};

Tetrimino.prototype.cloneGhostBlocks = function() {
    var newBlocks = [],
        currentBlock;

    for (var i = 0; i <= 3; i++) {
        currentBlock = this.ghostBlocks[i];

        newBlocks.push(
            new Block(
                currentBlock.x,
                currentBlock.y,
                currentBlock.color
            )
        );
    }

    return newBlocks;
};

Tetrimino.prototype.shiftHorizontally = function(direction) {
    var testBlocks = this.clone();
    this.reposition(UNIT * direction, 0, testBlocks);

    if (! this.willIntersect(testBlocks)) {
        this.clearGhost();
        this.clear();
        this.blocks = testBlocks;
        this.draw();
    }
};

Tetrimino.prototype.drop = function() {
    var testBlocks = this.clone();
    this.reposition(0, UNIT, testBlocks);

    if (! this.willIntersect(testBlocks)) {
        this.clear();
        this.blocks = testBlocks;
        this.draw();
    } else {
        this.update();
    }
};

Tetrimino.prototype.getGhostLocation = function(isInTetriminoPool) {
    var ghostBlocks = this.clone();

        var tetriminoPoolLength;

    if (isInTetriminoPool !== undefined && ! isInTetriminoPool) {
        while (! this.collidesVertically(ghostBlocks, isInTetriminoPool)) {
            for (i = 0; i <= 3; i++) {
                ghostBlocks[i].y += UNIT;
            }
        }
    } else {
        while (! this.collidesVertically(ghostBlocks)) {
            for (i = 0; i <= 3; i++) {
                ghostBlocks[i].y += UNIT;
            }
        }
    }

    return ghostBlocks;
};

Tetrimino.prototype.drawGhost = function() {
    var testBlocks = this.getGhostLocation(),
        ghostCollidesWithActiveTetrimino = false;

    for (var i = 0; i <= 3; i++) {
        for (var j = 0; j <= 3; j++) {
            if (testBlocks[i].x === this.blocks[j].x && testBlocks[i].y === this.blocks[j].y) {
                ghostCollidesWithActiveTetrimino = true;
            }
        }
    }

    if (! ghostCollidesWithActiveTetrimino) {
        this.ghostBlocks = testBlocks;

        for (i = 0; i <= 3; i++) {
            this.ghostBlocks[i].draw(true);
        }
    }
};

Tetrimino.prototype.dropToGhostLocation = function() {
    this.clear();
    this.blocks = this.cloneGhostBlocks();
    this.update();
};

Tetrimino.prototype.offsetOnDeckBlocks = function() {
    if (! (this.type === "I" || this.type === "O")) {
        for (var i = 0; i <= 3; i++) {
            this.blocks[i].x += UNIT / 2;
        }
    }
};
