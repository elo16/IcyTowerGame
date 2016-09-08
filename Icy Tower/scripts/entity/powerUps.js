function powerUps(descr) {
	this.setup(descr);
    this._power = Math.round(Math.random()*2+1);
	this.sprite = g_sprites.star;
	this._width = g_sprites.star.width;
    this._height = g_sprites.star.height;
    this._powerText = ['Superjump!', 'Double Points!', 'Double Jump'];
}

powerUps.prototype = new Entity(true);



powerUps.prototype.getPower = function () {
    return this._power;
};

powerUps.prototype.update = function (du) {
    spatialManager.unregister(this);
    if (this.isDeadNow()) {
        return entityManager.KILL_ME_NOW;
    }
    spatialManager.register(this);

};

powerUps.prototype.getPos = function () {
    return {posX : this.cx, posY : this.cy + worldManager.getOffsetY()};
};

powerUps.prototype.getWidth = function () {
    return this._width;
};

powerUps.prototype.getHeight = function () {
    return this._height;
};

powerUps.prototype.getType = function() {
    return this.type;
};

powerUps.prototype.getCollisionPos = function () {
   return {posX : this.getPos().posX, posY : this.getPos().posY - (this._height / 2) + (this.getCollisionHeight() / 2)};
};

powerUps.prototype.getCollisionWidth = function () {
    return this.getWidth();
};

powerUps.prototype.getCollisionHeight = function () {
    return this._height;
};


powerUps.prototype.render = function(ctx){
	ctx.save();
    this.sprite.drawCentredAt2(
        ctx, 0, 0, this._width, this._height, this.getPos().posX, this.getPos().posY, this._width, this._height, 0
    );
	
    ctx.restore();

};
