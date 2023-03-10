const gameEngine = new GameEngine();
const ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./sprites/Block_Tileset.png");
ASSET_MANAGER.queueDownload("./sprites/Player_Block.png");
ASSET_MANAGER.queueDownload("./sprites/background.png");


ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");

	PARAMS.BLOCKWIDTH = PARAMS.BITWIDTH * PARAMS.SCALE;
	PARAMS.CANVAS_WIDTH = canvas.width;
	PARAMS.CANVAS_HEIGHT = canvas.height;

	let x = new SceneManager(gameEngine);
	gameEngine.addEntityToFront(x);
	gameEngine.sceneManager = x;

	ctx.imageSmoothingEnabled = true;


	gameEngine.init(ctx);

	gameEngine.start();
});
