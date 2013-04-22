/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
// Inspired by base2 and Prototype
(function(){
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
 
  // The base Class implementation (does nothing)
  this.Class = function(){};
 
  // Create a new Class that inherits from this class
  Class.extend = function(prop) {
    var _super = this.prototype;
   
    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;
   
    // Copy the properties over onto the new prototype
    for (var name in prop) {
      // Check if we're overwriting an existing function
      prototype[name] = typeof prop[name] == "function" &&
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;
           
            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = _super[name];
           
            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);        
            this._super = tmp;
           
            return ret;
          };
        })(name, prop[name]) :
        prop[name];
    }
   
    // The dummy class constructor
    function Class() {
      // All construction is actually done in the init method
      if ( !initializing && this.init )
        this.init.apply(this, arguments);
    }
   
    // Populate our constructed prototype object
    Class.prototype = prototype;
   
    // Enforce the constructor to be what we expect
    Class.prototype.constructor = Class;
 
    // And make this class extendable
    Class.extend = arguments.callee;
   
    return Class;
  };
})();

			BoundedObject = Class.extend({
				x: 0,
				y: 0,
				width: 0,
				height: 0,
				leftSide: function() {
					return this.x;
				},
				rightSide: function() {
					return this.x + this.width;
				},
				topSide: function() {
					return this.y;
				},
				bottomSide: function() {
					return this.y + this.height;
				},
				fixPosition: function(direction, value) {
					switch(direction) {
						case "left":
							this.x = value - this.width;
						break;
						case "right":
							this.x = value;
						break;
						case "up":
							this.y = value - this.height;
						break;
						case "down":
							this.y = value;
						break;
						default:
						break;
					
					}
				}
			});
			//frame based movement. . .  won't hold up in the big leagues.
			Unit = BoundedObject.extend({
				x: 400,
				y: 560,
				width: 30,
				height: 30,
				speed: 5,
				color: "#439032",
				selectedColor: "#F9E0C1",
				defaultColor: "#439032",
				hasAbility: false,
				getCenter: function() {
					var temp = [];
					temp.push(this.x + this.width / 2);
					temp.push(this.y + this.height / 2);
					return temp;
				},
				resetColor: function() {this.color = this.defaultColor;},
				draw: function() {
					canvas.fillStyle = this.color;
					canvas.fillRect(this.x, this.y, this.width, this.height);
				},
				move: function(direction) {
					//remember, top left is zero, so bigger y == down, smaller y == up.
					switch(direction) {
						case "up":
							this.y -= this.speed;
							break;
						case "down":
							this.y += this.speed;
							break;
						case "left":
							this.x -= this.speed;
							break;
						case "right":
							this.x += this.speed;
							break;
						default:
							break;
					};
				},
				setSelectedColor: function() {
					this.color = this.selectedColor;
				}
			});
			
			Blocker = Unit.extend({
				hasAbility: true,
				type: "blocker",
				draw: function() { 
					this._super(); 
				}
			});
			
			Runner = Unit.extend({
				color: "#5073D4",
				defaultColor: "#5073D4", 
				width: 10,
				speed: 2,
				type: "runner",
				draw: function() { 
					this._super(); 
					canvas.fillRect(this.x, this.y, this.width, this.height);
				}
			});
			//the move function uses 40 as a constant for tile width. This will need to be fixed!!	
			Monster = Unit.extend({
				collided: false,
				width: 35,
				height: 35,
				speed: 4,
				x: 400,
				y: 0,
				target: [10,14],
				intervalId: 0,
				path: [],
				init: function() {
					var self = this;
					this.intervalId = setInterval(
					function() {self.startChasing.call(self);}, 300
					);
				},
				searchForPrey: function(preyLocation) {
					//put in the locations of the monster and the objective in world tile coordinates. Take off the first path because it is the current location.
					this.path = findPath([Math.floor(this.x / map.tileDim),Math.floor(this.y / map.tileDim)], preyLocation);
					//remove first element because it makes the monsters jittery (they keep going back to the beginning of their path.)
					this.path.splice(0,1);
				},
				move: function() {
					var offset = this.speed / 2;
					if(this.path.length > 0) {
						var goal = this.path[0];
						if(this.x > goal[0] * map.tileDim + offset) {
							this._super("left");
						} else if(this.x < goal[0] * map.tileDim - offset) {
							this._super("right");
						} else if(this.y > goal[1] * map.tileDim + offset) {
							this._super("up");
						} else if(this.y < goal[1] * map.tileDim - offset) {
							this._super("down");
						}
						//make target a range and not a single pixel, to prevent endless headbanging
						if(((this.x >= goal[0] * map.tileDim - offset && this.x <= goal[0] * map.tileDim + offset) && (this.y >= goal[1] * map.tileDim - offset && this.y <= goal[1] * map.tileDim + offset)) || this.collided)
						{
							//we arrived at goal, reset goal
							this.path.shift();
							//if we got here because we hit something reset colllided flag
							this.collided = false;
						}
						
					}else {
						//pathfinder didn't find a result, push a random location on the map
						var randomX = Math.floor((Math.random() * 20));
						var randomY = Math.floor((Math.random() * 15));
						this.path.push([randomX, randomY]);
					}
				},
				fixPosition: function(dir, pos) {
					this._super(dir, pos);
					this.collided = true;
				},
				startChasing: function() {
					this.searchForPrey(unitManager.closestRunnerToPos(this.target));
				},
				stopChasing: function() {
					clearInterval(intervalId);
				}
			});
				
			Lurker = Monster.extend({
				type: "lurker",
				color: "#000000",
				target: [10,0]
			});
			
			Berserker = Monster.extend({
				type: "Berserker",
				color: "#DE140A"
			});
			//holy cow this thing is a mess! Never will I ever try to have my tiles represented as actual entities again.
			//and so much abuse of the global scope, it is like you can't look away.
			Map = Class.extend({
				tiles: [],
				tileDim: 40,
				numColumns: 20,
				numRows: 15,
				wallCount: 0,
				init: function() {
					//fill up the tiles array with meaningful position info.
					for(var i = 0; i < this.numColumns; i++) {
							this.tiles[i] = [];
						for(var j = 0; j < this.numRows; j++) {
							var t = new Tile();
							t.x = i * t.width;
							t.y = j * t.height;
					
							this.tiles[i][j] = t;
						}
					}
					goalTile = this.getGoalTile();
					goalTile.color = "#F8F900";
				},
				getTile: function(col, row) {
					return this.tiles[col][row];
				},
				getOccupiedTile: function(unitCenter) {
					//returns a 2 item array with the coordinates of the tile.
					return [Math.floor(unitCenter[0]/this.tileDim), Math.floor(unitCenter[1]/this.tileDim)];
				},
				getGoalTile: function() {
					return this.tiles[Math.floor(this.numColumns/2)][0];
				},
				getSurroundingTiles: function(unitCenter) {
					//returns actual Tile objects surrounding the currently occupied tile.
					var tileRC = this.getOccupiedTile(unitCenter);
					
					var col = tileRC[0];
					var row = tileRC[1];
					
				 var cornerResult = this.isCorner(tileRC);
				 var edgeResult = this.isEdge(tileRC);
				 var resultArray = [];	
				 
					
					if(cornerResult != "nope") {
						switch(cornerResult) {
							case "topleft":
								resultArray.push(this.tiles[col][row + 1]);
								resultArray.push(this.tiles[col + 1][row]);
								resultArray.push(this.tiles[col + 1][row + 1]);
								return resultArray;
							case "topright":
								resultArray.push(this.tiles[col - 1][row]);
								resultArray.push(this.tiles[col][row + 1]);
								resultArray.push(this.tiles[col - 1][row + 1]);
								return resultArray;
							case "bottomleft":
								resultArray.push(this.tiles[col][row - 1]);
								resultArray.push(this.tiles[col + 1][row]);
								resultArray.push(this.tiles[col + 1][row - 1]);
								return resultArray;
							case "bottomright":
								resultArray.push(this.tiles[col - 1][row]);
								resultArray.push(this.tiles[col][row - 1]);
								resultArray.push(this.tiles[col - 1][row - 1]);
								return resultArray;
								break;
							default:
								break;
						
						};
					}else if(edgeResult != "nope") {
						switch(edgeResult) {
							case "top":
								resultArray.push( this.tiles[col - 1][row]);
								resultArray.push(this.tiles[col + 1][row]);
								resultArray.push(this.tiles[col - 1][row + 1]);
								resultArray.push(this.tiles[col][row + 1]);
								resultArray.push(this.tiles[col + 1][row + 1]);
								return resultArray;
							case "bottom":
								resultArray.push(this.tiles[col - 1][row]);
								resultArray.push(this.tiles[col + 1][row]);
								resultArray.push(this.tiles[col - 1][row - 1]);
								resultArray.push(this.tiles[col][row - 1]);
								resultArray.push(this.tiles[col + 1][row - 1]);
								return resultArray;
							case "left":
								resultArray.push(this.tiles[col][row - 1]);
								resultArray.push(this.tiles[col][row + 1]);
								resultArray.push(this.tiles[col + 1][row - 1]);
								resultArray.push(this.tiles[col + 1][row]);
								resultArray.push(this.tiles[col + 1][row + 1]);
								return resultArray;
							case "right":
								resultArray.push(this.tiles[col][row - 1]);
								resultArray.push(this.tiles[col][row + 1]);
								resultArray.push(this.tiles[col - 1][row - 1]);
								resultArray.push(this.tiles[col - 1][row]);
								resultArray.push(this.tiles[col - 1][row + 1]);
								return resultArray;
							default:
								return;
						};
					
					}else {  
						//normal case, 8 bordering this.tiles 
							resultArray.push(this.tiles[col - 1][row - 1]);
							 resultArray.push(this.tiles[col][row - 1]);
							 resultArray.push(this.tiles[col + 1][row - 1]);
							 resultArray.push(this.tiles[col - 1][row]);
							 resultArray.push(this.tiles[col + 1][row]);
							 resultArray.push(this.tiles[col - 1][row + 1]);
							 resultArray.push(this.tiles[col][row + 1]);
							 resultArray.push(this.tiles[col + 1][row + 1]);
							return resultArray;
					}
				},
				isCorner: function(tile) {
					//this only works because the rows and columns of the grid are all the same, but that is the way it should be for this game. Hrrrumph!
					if(tile[0] == 0 && tile[1] == 0) {
						return "topleft";
					}else if(tile[0] == this.tiles.length - 1 && tile[1] == 0) {
						return "topright";
					}else if(tile[0] == 0 && tile[1] == this.tiles[0].length - 1) {
						return "bottomleft";
					}else if(tile[0] == this.tiles.length - 1 && tile[1] == this.tiles[0].length - 1) {
						return "bottomright";
					}else {
						return "nope";
					}
				},
				isEdge: function(tile) {
					 if(this.isCorner(tile) != "nope") {
						return "nope";
					 }else {
						if(tile[0] == 0) {
							return "left";
						}else if(tile[0] == this.tiles.length - 1){
							return "right";
						}else if(tile[1] == 0){
							return "top";
						}else if(tile[1] == this.tiles[0].length - 1){
							return "bottom";
						}else {
							return "nope";
						}
					 }
				},
				constructWalls: function(location, direction) {
					var tileRC = this.getOccupiedTile(location);
					//the indices of the tile the player is currently on
					var t_c = tileRC[0];
					var t_r = tileRC[1];
					//inner functions save me writing out two extra for-loops
					var horiz = function(x, y) {
						if(this.tiles[x][y].isWall) {
							this.tiles[x][y].unMakeWall();
						}else{
						for(var i = x - 1; i <= x + 1; i++){
							if(i > 0 && i < map.numColumns && y > 0 && y < map.numRows) { 
								this.tiles[i][y].makeWall();
							}
						}
						}
					}
					
					var vert = function(x, y) {
						if(this.tiles[x][y].isWall) {
							this.tiles[x][y].unMakeWall();
						}else{
						for(var i = y - 1; i <= y + 1; i++) {
							if(i > 0 && i < map.numColumns && y > 0 && y < map.numRows) { 
								this.tiles[x][i].makeWall();
							}
						}
						}
					}
					
					switch(direction) {
						case "up":
							horiz.call(this, t_c, t_r - 1); 
						break;
						case "down":
							horiz.call(this, t_c, t_r + 1);
						break;
						case "left":
							vert.call(this, t_c - 1, t_r);
						break;
						case "right":
							vert.call(this, t_c + 1, t_r);
						break;
					
					}
				},
			
			});
			
			Tile = BoundedObject.extend({
				color: "#BCB6AB",
				x: 0,
				y: 0,
				width: 40,
				height: 40,
				isWall: false,
				walkable: true,
				getCenter: function() {
					var temp = [];
					temp.push(this.x + this.width / 2);
					temp.push(this.y + this.height / 2);
					return temp;
				},
				getIndicies: function() {
					return [Math.floor(this.x/this.width), Math.floor(this.y/this.height)];
				},
				equals: function(otherTile) {
					return this.x == otherTile.x && this.y == otherTile.y;
				},
				makeWall: function() {
					this.isWall = true;
					//can't use this tile in the path
					this.walkable = false;
					this.wallCount++;
				},
				unMakeWall: function() {
					this.isWall = false;
					this.walkable = true;
					this.cost = 0;
					this.wallCount--;
				},
				draw: function() {
					if(this.isWall) {
						canvas.fillStyle = this.color;
						canvas.fillRect(this.x, this.y, this.width, this.height);
					} else {
						canvas.strokeStyle = this.color;
						canvas.strokeRect(this.x, this.y, this.width, this.height);
					}
				}
			});
			