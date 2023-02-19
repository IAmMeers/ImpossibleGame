class Background {
    constructor(image) {
        Object.assign(this, { image});
        this.x = 0;
        this.y = 0;
        this.width = image.width * 1;
        this.height = image.height * 1;

        this.speed = scrollSpeed * this.speedModifier;

    }

    update() {

    }

    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        //ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
        
    }
}