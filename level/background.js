class Background {
    constructor(image) {
        Object.assign(this, { image});
        this.x = 0;
        this.y = 0;
        this.width = image.width;
        this.height = image.height;

    }

    update() {

    }

    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);

    }
}