class Player {

    constructor(game, position) {
        Object.assign(this, { game, position});
        this.SpriteSheet = ASSET_MANAGER.getAsset("./sprites/Player_Block.png");
        console.log("New Player");
        this.velocity = { x: 225, y: 0 };
        this.onGround = false;

        this.removeFromWorld = false;
        this.isAlive = true;
        this.gameWin = false;

        this.blockAnimation = new Animator(this.SpriteSheet,
            0, 0,
            512, 512,
            1, 1,
            0,
            false, true);

        this.updateBB();

    }


    update() {

        //console.log(this.position.x);

        const TICK = this.game.clockTick;

        
        if (this.isAlive && !this.gameWin) {
            //console.log(this.position.x | 0);
            if (this.position.x > 15000) {
                console.log("WIN");
                this.gameWin = true;
            }

            if (this.position.y > 1000) this.die(); //Die below map 

            // --- CONTROLS ----------------------------------
            if ((this.game.keys[' '] || this.game.mouseDown) && this.onGround) {
                //if (this.fireSpace) {
                    this.velocity.y = PLAYER_JUMP;
                    this.onGround = false;
                    //this.fireSpace = false;
                //}
            } 
            //else if (!this.game.keys[' ']) {
            //     this.fireSpace = true;
            // }

            // --- PHYSICS -----------------------------------
            this.velocity.y += PLAYER_PHYSICS.ACC_FALL * TICK;  

            // max speed calculation for vertical
            if (this.velocity.y >= PLAYER_PHYSICS.MAX_FALL) this.velocity.y = PLAYER_PHYSICS.MAX_FALL;
            if (this.velocity.y <= -PLAYER_PHYSICS.MAX_FALL) this.velocity.y = -PLAYER_PHYSICS.MAX_FALL;

            this.position.x += this.velocity.x * TICK * PHYSIC_SCALE;
            this.position.y += this.velocity.y * TICK * PHYSIC_SCALE;

            this.updateBB();
            this.collisionChecker();

        } else { //Game ended from death or win
            if (this.game.keys['r']) {

                this.game.restartGame();
                
                
            }
        }


        

    
    }

    updateBB() {
        this.lastBB = this.BB;

        this.BB = new BoundingBox(
            this.position.x, 
            this.position.y, 
            PARAMS.BLOCKWIDTH, 
            PARAMS.BLOCKWIDTH);
    }


    draw(ctx) {

        if (PARAMS.DEBUG) {
            //Draw the BB
            ctx.strokeStyle = 'blue';
            ctx.strokeRect(this.BB.x - this.game.camera.x, this.BB.y - this.game.camera.y, this.BB.width, this.BB.height);
        }

        let blocks = ASSET_MANAGER.getAsset("./sprites/Block_Tileset.png");

        ctx.drawImage(blocks,
            0, 1536, //source from sheet
            1920, 512,
            this.position.x - this.game.camera.x - 512 / 1.5, this.game.camera.y + 589,
            1920 * PARAMS.SCALE * 3,
            512 * PARAMS.SCALE);

        this.blockAnimation.drawFrame(
            this.game.clockTick, ctx, 
            this.position.x - this.game.camera.x, 
            this.position.y - this.game.camera.y, 
            PARAMS.SCALE, false);

    }

    collisionChecker() {
        this.game.entities.forEach(entity => {
            if (this !== entity && entity.BB && this.BB.collide(entity.BB)) { //Collision

                if (this.velocity.y > 0) { //falling

                    if ((entity instanceof Tile) && this.lastBB.bottom <= entity.BB.top) {
                        this.position.y = entity.BB.top - this.BB.height;
                        this.velocity.y = 0;
                        this.onGround = true;
                        this.updateBB();
                        if (entity.isKillBox) {
                            this.die();
                        }
                        return;
                    }

                }
                if (this.velocity.y < 0) { //Jumping

                    if ((entity instanceof Tile) && this.lastBB.top >= entity.BB.bottom) {
                        console.log("Collide top of tile");
                        this.position.y = entity.BB.bottom;
                        this.velocity.y = 0;
                        this.updateBB();
                        return;

                    }
                }

                //Other cases for hitting tile
                if ((entity instanceof Tile)) {

                    if (this.BB.right >= entity.BB.left
                        && this.BB.bottom > entity.BB.top
                        && this.velocity.x > 0) {  //Touching left side

                        console.log("Touching left");
                        this.position.x = entity.BB.left - this.BB.width;
                        this.die();


                    }

                }


            }
        });
    };

    die() {
        this.isAlive = false;
        console.log("GAME OVER");
    }

}