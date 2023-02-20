class SceneManager {
    constructor(game) {
        this.game = game;

        this.game.player = null;
        this.game.camera = this;

        //Toggle which level to load
        this.level = 0;

        this.loadLevel();

    }


    loadLevel() {
        this.createPlayer();
        console.log("Loading Level");
        if (this.level === 0) {
            
            new LevelGenerator(this.game);
            let bg = ASSET_MANAGER.getAsset("./sprites/background.png");
            this.game.addEntity(new Background(bg));
        }


    }

    createPlayer() {
        let position = {
            x: 800,
            y: 350,
        }
        console.log("Spawning Player at: " + position.x + ", " + position.y);
        let player = new Player(gameEngine, position);
        this.game.addEntity(player);
        this.game.player = player;
    }

    showDeathScreen(ctx) {
        let width = 400;
        let height = 100;

        let offscreenCanvas = document.createElement('canvas');
        offscreenCanvas.width = width;
        offscreenCanvas.height = height;
        let offscreenCtx = offscreenCanvas.getContext('2d');
        offscreenCtx.imageSmoothingEnabled = false;


        offscreenCtx.fillStyle = "White";
        offscreenCtx.fillRect(0, 0, width, height);

        offscreenCtx.fillStyle = "black";
        offscreenCtx.font = "bold 25px serif";
        offscreenCtx.textBaseline = "top";
        offscreenCtx.fillText("Press 'R' to restart", width / 4, height / 2);
        

        ctx.drawImage(offscreenCanvas,
            (PARAMS.CANVAS_WIDTH / 2) - (width / 2), (PARAMS.CANVAS_HEIGHT / 2) - (height),
            width, height);
    }

    update() {
        
        
        
        let midpointX = PARAMS.CANVAS_WIDTH / 2 - PARAMS.BLOCKWIDTH / 2;
        let midpointY = PARAMS.CANVAS_HEIGHT / 2 - PARAMS.BLOCKWIDTH / 2;

        //ACTIVE CAMERA
        this.x = this.game.player.position.x - midpointX;
        //this.y = this.game.player.position.y - midpointY;

        // this.x = 0;
        this.y = -100;


    }

    draw(ctx) {
        if (!this.game.player.isAlive) {
            console.log("showing death screen");
            this.showDeathScreen(ctx);
        }
    }
}