GameEngine = Class.extend({
		canvasHeight: 600,
		canvasWidth: 800,
		loadTime: 0,
		monsterLoadTime: 0,
		maxMonsters: 2,
		
		init: function() {
			//start up all the engine components as globally scoped objects. They aren't singletons but what are you gonna do?
			inputHandler = new InputHandler();
			map = new Map();
			collisionDetector = new CollisionDetector();
			unitManager = {units: [], monsters: [], selectedUnit: 0, buildTimes: [200, 500], buildIndex: 0, monsterCount: 0, runnerCount: 0, blockerCount: 0,
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
						this.selectedUnit -= 1;
					}
					this.units.splice(removalIndex, 1);
					if(this.units.length > 0) {
						this.units[this.selectedUnit].setSelectedColor();
					}
				}
			}
				// this is the type of guy you have to keep alive.
				unitManager.units.push(new Runner());
				unitManager.units[unitManager.selectedUnit].setSelectedColor();
		},
		
		update: function() {
				inputHandler.handleInput();

				//var path = findPath(map.getTile(0, 0), map.getTile(10, 10));
				//console.log(path.length);
				
				this.monsterLoadTime += 1;
				if(this.monsterLoadTime == 600 && unitManager.monsterCount <= this.maxMonsters) {
					if(unitManager.monsterCount % 2 == 1) {
						unitManager.monsters.push(new Lurker());
					}else {
						unitManager.monsters.push(new Berserker());
					}
				}
				this.loadTime += 1;
				if(this.loadTime >= unitManager.buildTimes[unitManager.buildIndex]) {
					switch(unitManager.buildIndex) {
						case 0:
							unitManager.units.push(new Blocker());
						break;
						case 1:
							unitManager.units.push(new Runner());
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
					collisionDetector.nudgePlayer(unitManager.units[unitManager.selectedUnit]);
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
			canvas.font = "32px verdana, sans-serif";
			var messages = [];
			messages.push("Way to go!! But the Princess is. . . Nah, I'm messin' with ya. good show.");
			canvas.fillStyle = "#76BBBF";
			canvas.fillText(messages[0], 20, this.canvasHeight / 2);
		},
		
		step: function() {
		//Game Loop (internal function is messy)
			gameEngine.update();
			gameEngine.render();
		}
		

});