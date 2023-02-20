class Player {

    constructor(game, position) {
        Object.assign(this, { game, position});
        this.SpriteSheet = ASSET_MANAGER.getAsset("./sprites/Player_Block.png");
        console.log("New Player");
        this.velocity = { x: 3.6, y: 0 };
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

        
        if (this.isAlive && !this.gameWin) {
            //console.log(this.position.x | 0);
            if (this.position.x > 12000) {
                console.log("WIN");
                this.gameWin = true;
            }

            if (this.position.y > 1000) this.die(); //Die below map 

            // --- CONTROLS ----------------------------------
            if (this.game.keys[' '] && this.onGround) {
                this.velocity.y = PLAYER_JUMP;
                this.onGround = false;
                
            }

            this.position.x += this.velocity.x


            // --- PHYSICS -----------------------------------
            const TICK = this.game.clockTick;
                            
            this.velocity.y += PLAYER_PHYSICS.MAX_FALL * TICK;
            this.velocity.y += GRAVITY;
            this.position.y += this.velocity.y * TICK;

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