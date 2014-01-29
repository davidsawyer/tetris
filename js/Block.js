function Block(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
}

Block.prototype.draw = function(isGhostBlock) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.rect(this.x, this.y, BLOCK_WIDTH, BLOCK_WIDTH);
    ctx.closePath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = darkGray;
    ctx.stroke();
    ctx.fill();

    if (isGhostBlock !== undefined && isGhostBlock) {
        ctx.beginPath();
        ctx.fillStyle = darkGray;
        ctx.rect(this.x + 2, this.y + 2, BLOCK_WIDTH - 4, BLOCK_WIDTH - 4);
        ctx.closePath();
        ctx.fill();
    } else {

    }
};

Block.prototype.drawOnDeck = function(isGhostBlock) {
    ctx2.beginPath();
    ctx2.fillStyle = this.color;
    ctx2.rect(this.x - UNIT * 2, this.y + UNIT * 4, BLOCK_WIDTH, BLOCK_WIDTH);
    ctx2.closePath();
    ctx2.lineWidth = 1;
    ctx2.strokeStyle = darkGray;
    ctx2.stroke();
    ctx2.fill();
};

Block.prototype.clear = function() {
    ctx.clearRect(this.x, this.y, UNIT, UNIT);
};
