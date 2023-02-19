//Night time level!

class LevelGenerator {
    constructor(game) {
        Object.assign(this, { game });
   

        this.levelMap = level;
        this.tileSets = {
            "Block_Tileset" : Block_Tileset

        }


        
        let levelData = this.formatLevelData();
        
        this.parseLevelData(levelData);


    };

    //Part 0
    formatLevelData() {
        let levelData = [];
        let layersCount = this.levelMap['layers'].length;
        for(let i = 0; i < layersCount; i++) {
            let layer = this.levelMap['layers'][i];
            
            if (layer["type"] === "tilelayer"){ //Used to draw map and collisions
                let width = layer["width"];
                let rawData = layer["data"];
                
                let FormattedData = [];
                for (let id = 0; id < rawData.length; id += width) {
                    FormattedData.push(rawData.slice(id, id + width));
                }
                levelData.push(FormattedData);
            } else if (layer["type"] === "objectgroup"){ //Used for spawn points / world events
                let objects = layer["objects"];
                objects.forEach(object => {
                    if (object["class"] === "Spawn") {

                        // //These are positional offsets that convert the map coords from tiled to actual in game coords
                        let position = {
                            x: object["x"] * PARAMS.SCALE,
                            y: object["y"] * PARAMS.SCALE,
                        }

                        // if (object["name"] === "Player") {
                        //     console.log("Spawning Player at: " + position.x + ", " + position.y);
                        //     let player = new MasterChief(gameEngine, position);
                        //     this.game.addEntity(player);
                        //     this.game.player = player;
                        // }
                        
                    }
                });
            }
        }
        return levelData;

    };

    //Part 1
    parseLevelData(levelData) {
        let tileSheets = this.levelMap["tilesets"];
        let layersCount = levelData.length;
        //Parse each layer
        
        for(let layerNum = layersCount - 1; layerNum >= 0; layerNum--) {
            let layer = levelData[layerNum];
            //console.log("LAYER: " + layer);

            for (let row = 0; row < layer.length; row++) {
                for(let col = 0; col < layer[row].length; col++) {
                    let GID = layer[row][col];
                    
                    //Find TileSet by the GID
                    let t = 0;
                    while(t < tileSheets.length) {
                        var firstGID = tileSheets[t]["firstgid"];
                        
                        if (GID < firstGID) {
                            break;
                        } 
                        t++;  
                    }
                    
                    //Build Tiles
                    t -= 1;
                    if (t > -1) {
                        let tileSetName = tileSheets[t]["source"];
                        let firstGID = tileSheets[t]["firstgid"];
                        let tileSet = this.tileSets[tileSetName.slice(0,-4)];
                        console.log("Loading Tileset: " + tileSetName.slice(0,-4));
                        let tile = new Tile(this.game, col * PARAMS.BLOCKWIDTH, row * PARAMS.BLOCKWIDTH, tileSet, firstGID, GID);

                        this.game.addEntity(tile);

                    }


                }
            }
            
        }
    };

    

};