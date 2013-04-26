GameEngine = Class.extend({
		canvasHeight: 600,
		canvasWidth: 800,
		loadTime: 0,
		monsterLoadTime: 0,
		maxMonsters: 2,
		win: false,
		lose: false,
		
		init: function() {
			//start up all the engine components as globally scoped objects. They aren't singletons but what are you gonna do?
			inputHandler = new InputHandler();
			map = new Map();
			collisionDetector = new CollisionDetector();
			unitManager = {units: [], monsters: [], selectedUnit: 0, buildTimes: [150, 500], buildIndex: 0, monsterCount: 0, runnerCount: 0, blockerCount: 0,
				buildingWhat: function() { 
					switch(this.buildIndex){
						case 0:
							return "blocker";
							break;
						case 1:
							return "runner";
							break;
						default:
							return "blocker";
					};
				},
				removeSelected: function() {
					var removalIndex = this.selectedUnit;
					if(this.selectedUnit != 0) {
						this.selectedUnit--;
					}
					this.units.splice(removalIndex, 1);
					if(this.units.length > 0) {
						this.units[this.selectedUnit].setSelectedColor();
					}
				},
				closestRunnerToPos: function(pos) {
					var closest = [0, 0];
					//start with a negative distance so we know we haven't found one yet.
					var closestDistance = -1;
					//var startPos = [10, 14];
					
					//Wayne's World, "position 1 to position 2, position 1 to position 2"
					var dist = function(pos1, pos2) {
						var abs = Math.abs;
						return abs(pos1[0] - pos2[0]) + abs(pos1[1] - pos2[1]);
					}
					
					for(var i = 0; i < this.units.length; i++) {
						if(this.units[i].type == "runner") {
							//find out if this runner is the one that is closest to the start position. use a max function and then set closest to it if it is
							var currentUnitPos = map.getOccupiedTile(this.units[i].getCenter());
							var distance = dist(pos, currentUnitPos);
							if(closestDistance == -1 || closestDistance > distance) {
								closestDistance = distance;
								closest = currentUnitPos;
							}
						}
					}
					return closest;
				
				}
			}
				// this is the type of guy you have to keep alive. This code starts you with one of them, so if you ever go below that, game over.
				unitManager.units.push(new Runner());
				unitManager.runnerCount++;
				unitManager.units[unitManager.selectedUnit].setSelectedColor();
		},
		
		update: function() {
				inputHandler.handleInput();
				
				this.monsterLoadTime += 1;
				if(this.monsterLoadTime == 200 && unitManager.monsterCount < this.maxMonsters) {
					if(unitManager.monsterCount % 2 == 1) {
						var lurker = new Lurker();
						unitManager.monsters.push(lurker);
						unitManager.monsterCount++;
						this.monsterLoadTime = 0;
					}else {
						var berserker = new Berserker();
						unitManager.monsters.push(berserker);
						unitManager.monsterCount++;
						this.monsterLoadTime = 0;
					}
				}
				this.loadTime++;
				if(this.loadTime >= unitManager.buildTimes[unitManager.buildIndex]) {
					switch(unitManager.buildIndex) {
						case 0:
							unitManager.units.push(new Blocker());
							unitManager.blockerCount++;
						break;
						case 1:
							unitManager.units.push(new Runner());
							unitManager.runnerCount++;
						break;
						default:
						break;
					};
					//if there is only one unit, that is the selected unit, we need to set its color
					if(unitManager.units.length == 1) {
						unitManager.units[unitManager.selectedUnit].setSelectedColor();
					}
					//reset our continuous loading		
					this.loadTime = 0;
				}
				
				//make sure selected unit doesnt run through walls.
				if(unitManager.units.length > 0) {
					collisionDetector.checkBounds(unitManager.units[unitManager.selectedUnit]);
					collisionDetector.nudgePlayer(unitManager.units[unitManager.selectedUnit]);
				}
				
				//move our monsters
				if(unitManager.monsters.length > 0) {
					for(var i = 0; i < unitManager.monsters.length; i++) {
						unitManager.monsters[i].move();
						collisionDetector.checkBounds(unitManager.monsters[i]);
						collisionDetector.nudgePlayer(unitManager.monsters[i]);
						
					}
				}
				
				collisionDetector.performCollisions();
				
			},
		
		render: function() {
				canvas.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
				canvas.fillStyle = "#454545";
				canvas.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
				canvas.fillStyle = "#000000";
				canvas.fillRect(0, this.canvasWidth - 30, this.canvasWidth, this.canvasHeight);
				
				//draw our tiles
				for ( var i = 0; i < map.numColumns; i ++) {
					for(var j = 0; j < map.numRows; j++) {
						map.tiles[i][j].draw();
					}
				}
				
				//draw everyone on our tiles
				for (var i = 0; i < unitManager.units.length; i++) {
				   unitManager.units[i].draw();
				}
				//draw the monsters too, they need some love,
				for (var i = 0; i < unitManager.monsters.length; i++) {
					unitManager.monsters[i].draw();
				}
				canvas.font = "14px verdana, bold, sans-serif";
				canvas.fillStyle = "#76BBBF";
				canvas.fillText("unit under construction: " + unitManager.buildingWhat(), this.canvasWidth - 230, this.canvasHeight - 55);
				canvas.fillText("loadtime: ", this.canvasWidth - 230, this.canvasHeight - 40);
				canvas.fillStyle = "#3AF014";
				canvas.fillRect(this.canvasWidth - 230, this.canvasHeight - 30, (unitManager.buildTimes[unitManager.buildIndex] - this.loadTime)/3, 20);
			},
		
		winScreen: function() {
			canvas.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
			canvas.font = "12px verdana, sans-serif";
			var messages = [];
			messages.push("Way to go!! But the Princess is. . . Nah, I'm messin' with ya. Good show.");
			messages.push("you see a light burning in the distance. . . could this really be the way out? Yes, yes it could.");
			messages.push("How many tries did it take you? I am conducting a poll. write your answer on the computer screen in ink.");
			messages.push("I bet that was easy without all of those distracting graphics getting in the way right? I thought so.");
			messages.push("This game is a metaphor for metaphors. It is a meta-metaphor.");
			messages.push("Hooray!!! you win. Guess what you get? A snarky message from me. What were you expecting? Puppies?");
			messages.push("Long ago, in a. . . Ok, I think that is as much as I can write without getting sued.");
			messages.push("You know how with fortune cookies you can get the same message over and over? Winning this game is kind of like that.");
			messages.push("This is the ninth message I wrote to show you that you beat the game. I ran out of creativity around message five.");
			messages.push("These end of game messages are probably around the same length as tweets. I'm just sayin'. Show Rynth some love.");
			messages.push("In life there are no winners and losers, but in this game you are one. Congratulations/Sorry.");
			messages.push("You did it!");
			messages.push("excelsior!");
			canvas.fillStyle = "#76BBBF";
			canvas.fillText(messages[Math.floor(Math.random() * messages.length)], 5, this.canvasHeight / 2);
		},
		loseScreen: function() {
			canvas.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
			canvas.font = "12px verdana, sans-serif";
			var messages = [];
			messages.push("Well, you lost. Don't worry about it, someone had to. You should feel better now.");
			messages.push("Game Over?          See the question mark? <- That means there is gonna be a sequel.");
			messages.push("If you were following along with the story, this is where the entrants vaporize. You didn't read it? Fine. Be that way.");
			messages.push("You did it! . . . You lost!");
			messages.push("In life there are no winners and losers, but in this game you are one. Congratulations/Sorry.");
			messages.push("I almost didn't write a message just now, because I was so grief stricken by your loss.");
			messages.push("(insert credits here)");
			messages.push("TODO - create a mind blowing animation to comemorate your loss. Keep losing, someday I might have one ready.");
			messages.push("You found the secret genie! Rules are, 3 wishes and you can't wish you didn't just lose.");
			messages.push("Ok, so this time you were dismembered by my giant hulking beast, but please come back soon!");
			canvas.fillStyle = "#76BBBF";
			canvas.fillText(messages[Math.floor(Math.random() * messages.length)], 5, this.canvasHeight / 2);
		},
		
		step: function() {
		//Game Loop (internal function is messy)
		var stopTheTimers = function() {
			for(var i = 0; i < unitManager.monsters.length; i++) {
				unitManager.monsters[i].stopChasing();
			}
		}
		
		if(gameEngine.win) {
			gameEngine.winScreen();
			clearInterval(handleToInterval);
			stopTheTimers();
		}else if(gameEngine.lose) {
			gameEngine.loseScreen();
			clearInterval(handleToInterval);
			stopTheTimers();
		}else {
			gameEngine.update();
			gameEngine.render();
		}
		
		}
		

});