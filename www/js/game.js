window.game = {};
    /*Implementaion for the Rectangle*/
    (function(){
        function Rectangle(x,y,width,height){
            this.left = x;
            this.top = y;
            this.width = width;
            this.height = height,
            this.right = x + width;
            this.bottom = y + height;
        }
        Rectangle.prototype.set = function(x,y,width /*optional*/,height /*optional*/){
            this.left = x;
            this.top = y;
            this.width = width || this.width;
            this.height = height ||this.height;
            this.right = this.width + this.left;
            this.bottom = this.height + this.top;
        }
        Rectangle.prototype.within = function(rect){
            return (rect.left <= this.left && rect.top <= this.top 
                && rect.right >= this.right && rect.bottom >= this.bottom);
        }

        game.Rectangle = Rectangle;
    })();
    /*Implementation for the Player*/
    (function(){
        function Player(x,y){
            this.x = x;
            this.y = y;

            this.width = 50;
            this.height = 50;

            this.color= null;

            this.speed = 200;

            this.movePoint = false;

            this.id = null;
        }
        
        Player.prototype.setPos = function(x,y,color){
            this.x = x || this.x;
            this.y = y || this.y;
            this.color = color || this.color;
        }

        Player.prototype.update = function(step,widthWorld,heightWorld){
            if(game.controls.left){
                this.x -= this.speed * step;
            }
            if (game.controls.up){
                this.y -= this.speed * step;
            }
            if(game.controls.right){
                this.x += this.speed * step;
            }
            if(game.controls.down){
                this.y += this.speed * step;
            }

            if(this.x - this.width/2 < 0){
                this.x = this.width/2;
            }
            if(this.y - this.height/2 < 0){
                this.y = this.height/2;
            }
            if(this.x + this.width/2 > widthWorld){
                this.x = widthWorld - this.width/2;
            }
            if(this.y + this.height/2 > heightWorld){
                this.y = heightWorld - this.height/2;
            }
        }

        Player.prototype.draw = function(ctx,xCamera,yCamera,color){

            this.color = color || this.color;

            ctx.save();
            ctx.fillStyle = color;
            ctx.fillRect( (this.x - this.width/2) - xCamera,(this.y - this.height/2) - yCamera,this.width,this.height)
            ctx.restore();
        }
        Player.prototype.setDestCoords = function(destX,destY,camX,camY){
            this.destX = destX;
            this.destY = destY;

            /* Transform the Click Coordinates to the Real coordinates*/
            this.destX += camX;
            this.destY += camY;
        }

        Player.prototype.moveToPoint = function(step,camX,camY,ctx){
            if(this.destX > this.x){
                if(this.destX - this.x > this.speed*step)
                    this.x += this.speed * step;
                else if (this.destX - this.x > (this.speed*step)/2)
                    this.x += (this.speed * step) / 2;   
                else
                    this.x = this.destX;
            } else {
                if(this.x - this.destX > this.speed*step)
                    this.x -= this.speed * step;
                else if (this.destX - this.x > (this.speed*step)/2)
                    this.x -= (this.speed * step) / 2;
                else
                    this.x = this.destX;
            }
            if(this.destY > this.y){
                if(this.destY - this.y > this.speed*step)
                    this.y += this.speed * step;
                else if(this.y - this.destY > (this.speed * step)/2)
                    this.y += (this.speed * step) / 2;
                else    
                    this.y = this.destY;
            } else {
                if(this.y - this.destY > this.speed*step)
                    this.y -= this.speed * step;
                else if(this.y - this.destY > (this.speed * step)/2)
                    this.y -= (this.speed * step) / 2;
                else    
                    this.y = this.destY;
            }
            this.draw(ctx,camX,camY);
        }
        Player.prototype.getPos = function(){
            return {PlayerX: this.x, PlayerY: this.y,PlayerSpeed: this.speed}
        }

        game.Player = Player;
    })();
    /*Implementation for the Map*/
    (function(){
        function Map(height,width){

            this.height = height;
            this.width = width;

            this.img = null;
        }

        Map.prototype.generate = function(){
            
            var ctx = document.createElement("canvas").getContext("2d");


            ctx.canvas.width = this.width;
            ctx.canvas.height = this.height;


            var rows = Math.floor(this.width / 55);
            var cols = Math.floor(this.height/ 50);

            ctx.save();
            ctx.fillStyle = createColor();
            for(var i = 0, x = 0; i < rows; x += 55, i++){
                ctx.beginPath();
                for(var j = 0, y = 0; j < cols; y+=50, j++){
                    ctx.rect(x,y,49,49);
                }
                ctx.fillStyle = createColor();
                ctx.fill();
                ctx.closePath();
            }
            ctx.restore();
            this.image = new Image();
			this.image.src = ctx.canvas.toDataURL("image/png");					
			
			// clear ctx
			ctx = null;
            
        }

        Map.prototype.draw = function(ctx,camX,camY){

            var sourceX = camX;
            var sourceY = camY;

            var sourceW = ctx.canvas.width;
            var sourceH = ctx.canvas.height;

            var destX = 0;
            var destY = 0;

            var destW = sourceW;
            var destH = sourceH;

            ctx.drawImage(this.image,sourceX,sourceY,sourceW,sourceH,destX,destY,destW,destH);
        }

        game.Map = Map;
    })();
    /* Implementatin for the Camera*/
    (function(){
        function Camera(x,y,width,height,worldWidth, worldHeight){
            this.x = x;
            this.y = y;

            this.width = width;
            this.height = height;

            this.distWidth = null;
            this.distHeight = null;

            this.follows = null;

            this.cameraPort = new game.Rectangle(this.x,this.y,this.width,this.height);

            this.worldPort = new game.Rectangle(0,0,worldWidth,worldHeight);
        }
        Camera.prototype.follow = function(obj,distWidth,distHeight){
            this.follows = obj;
            this.distWidth = distWidth;
            this.distHeight = distHeight;
        }

        Camera.prototype.update = function(){
            // console.log("in Camera update   ")
            if(this.follows.x - this.x + this.distWidth > this.width){
                this.x = this.follows.x - (this.width - this.distWidth);
            } else if(this.follows.x - this.x - this.distWidth < this.width){
                this.x = this.follows.x - this.distWidth;
            }
            if(this.follows.y - this.y + this.distHeight > this.height){
                this.y = this.follows.y - (this.height - this.distHeight);
            } else if(this.follows.y - this.y - this.distHeight < this.height){
                this.y = this.follows.y - this.distHeight;
            }

            this.cameraPort.set(this.x,this.y);

            if(!this.cameraPort.within(this.worldPort)){
                if(this.cameraPort.left < this.worldPort.left){
                    this.x = this.worldPort.left;
                }
                if(this.cameraPort.top < this.worldPort.top){
                    this.y = this.worldPort.top;
                }
                if(this.cameraPort.right > this.worldPort.right){
                    this.x = this.worldPort.right - this.width;
                }
                if(this.cameraPort.bottom > this.worldPort.bottom){
                    this.y = this.worldPort.bottom - this.height;
                }
            }
        }
        Camera.prototype.getPos = function(){
            return {CameraX: this.x, CameraY: this.y}
        }

        game.Camera = Camera;
    })();
    (function(){
        game.playerlist = [];
        var canvas = document.getElementById("gameCanvas");
        game.gameContext = canvas.getContext("2d");

        var FPS = 50;
		var INTERVAL = 1000/FPS; // milliseconds
		var STEP = INTERVAL/1000 // seconds

        var Room = {
            width: 5000,
            height: 4000,
            Map: new game.Map(5000,4000)
        }
        Room.Map.generate();

        var Player = new game.Player(0,0);
        game.mainPlayer = Player;
        var Camera = new game.Camera(0,0,canvas.width,canvas.height,Room.width,Room.height);
        game.mainCamera = Camera;

        game.mainCamera.follow(game.mainPlayer, canvas.width/2,canvas.height/2);

        function update(){
            if(!game.mainPlayer.movePoint)
                game.mainPlayer.update(STEP,Room.width,Room.height);
            else
                game.mainPlayer.moveToPoint(STEP,game.mainCamera.x,game.mainCamera.y,game.gameContext);
            game.mainCamera.update();
        }
        function draw(){
            game.gameContext.clearRect(0, 0, canvas.width, canvas.height);

            Room.Map.draw(game.gameContext,game.mainCamera.x,game.mainCamera.y);
            game.mainPlayer.draw(game.gameContext,game.mainCamera.x,game.mainCamera.y,"red");
            console.log(game.mainPlayer.x,game.mainPlayer.y,game.mainCamera.x,game.mainCamera.y);
        }
        function positionUpdate(){
            var updateObj = {};
            updateObj.Player = game.mainPlayer.getPos();
            updateObj.Camera = game.mainCamera.getPos();
            

        }
        function applyUpdate(art,object){
            if(art == "connect"){
                addnewPlayer();
            } else if (art == "positionupdate"){
                
            }
        }

        function gameLoop(){
            update();
            draw();
            positionUpdate();
            game.updatePlayers();
        }
        var runningId = -1;
		
		game.play = function(){	
			if(runningId == -1){
				runningId = setInterval(function(){
					gameLoop();
				}, INTERVAL);
				console.log("play");
			}
		}
		
		game.togglePause = function(){		
			if(runningId == -1){
				game.play();
			}
			else 
			{
				clearInterval(runningId);
				runningId = -1;
				console.log("paused");
			}
		}	
        game.moveOnClicke = function(e){
            game.mainPlayer.setDestCoords(e.clientX,e.clientY,Camera.x,Camera.y);
            game.mainPlayer.movePoint = true;
        }
        game.stopAutoMove = function(){
            game.mainPlayer.movePoint = false;
        }
    })();
    game.controls = {
        left:false,
        right:false,
        up:false,
        down:false
    }
    game.updatePlayers = function(){
        for(let i in game.playerlist){
            game.playerlist[i].draw(game.gameContext,game.mainCamera.x,game.mainCamera.y,"red");
        }
    }

    window.addEventListener("keydown", function(e){
		switch(e.keyCode)
		{
			case 37: // left arrow
                game.controls.left = true;
                game.stopAutoMove();
				break;
			case 38: // up arrow
                game.controls.up = true;
                game.stopAutoMove();
				break;
			case 39: // right arrow
                game.controls.right = true;
                game.stopAutoMove();
				break;
			case 40: // down arrow
                game.controls.down = true;
                game.stopAutoMove();
				break;
		}
	}, false);

	window.addEventListener("keyup", function(e){
		switch(e.keyCode)
		{
			case 37: // left arrow
                game.controls.left = false;
				break;
			case 38: // up arrow
                game.controls.up = false;
				break;
			case 39: // right arrow
			    game.controls.right = false;
				break;
			case 40: // down arrow
                game.controls.down = false;
				break;
			case 80: // key P pauses the game
                game.togglePause();
			 	break;		
		}
    }, false);

    game.gameContext.canvas.addEventListener("click", function(e){
        game.stopAutoMove();
        game.moveOnClicke(e);
    })
    
    function createColor(){
        var c = "#"
        for(var i = 0; i < 6;i++){
            var n = Math.floor((Math.random() * 15));
            switch(n){
                case 10:
                    c += "a";
                    break;
                case 11: 
                    c += "b";
                    break;
                case 12: 
                    c += "c";
                    break;
                case 13: 
                    c += "d";
                    break;
                case 14:
                    c += "e";
                    break;
                case 15:
                    c += "f";
                    break;
                default:
                    c += n;
                    break;
            }
        }
        return c;
    }

    window.onload = function(){game.play();}
// (function(){function }