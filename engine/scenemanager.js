class SceneManager {
    constructor(game) {
        this.game = game;

        this.game.camera = this;

        //Toggle which level to load
        this.level = 0;

        this.createPlayer();
        this.loadLevel();

    }


    loadLevel() {

        if (this.level === 0) {
            new LevelGenerator(this.game);
            let bg = ASSET_MANAGER.getAsset("./sprites/background.png");
            this.game.addEntity(new Background(bg));
        }

        // else if (){

        // }


    }

    createPlayer() {
        let position = {
            x: 0,
            y: 350,
        }
        console.log("Spawning Player at: " + position.x + ", " + position.y);
        let player = new Player(gameEngine, position);
        this.game.addEntity(player);
        this.game.player = player;
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

    }
}