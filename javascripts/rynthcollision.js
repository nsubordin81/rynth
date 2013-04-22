CollisionDetector = Class.extend({
	collisionTest: function(object1, object2) {
		if(object1.rightSide() > object2.leftSide() && object1.leftSide() < object2.rightSide() && object1.bottomSide() > object2.topSide() && object1.topSide() < object2.bottomSide()) {
			return true;
		} else { return false; }
	},
	nudgePlayer: function(unit) {
		var surroundingTiles = map.getSurroundingTiles(unit.getCenter());
		for(var i = 0; i < surroundingTiles.length; i++) {
			if(surroundingTiles[i].isWall && this.collisionTest(surroundingTiles[i], unit)) {
				//get the row and column of the tile the selected unit is occupying
				var currentTileRC = map.getOccupiedTile(unit.getCenter());
				//get the row and column of the tile we are processing in the loop TODO change the function name for getOccupiedTile it is being used more generally.
				var indexedTileRC = map.getOccupiedTile(surroundingTiles[i].getCenter());
				//if unit is in the tile to the right of the indexedTile, push the unit to the right.
				var c = indexedTileRC[0];
				var r = indexedTileRC[1];
				
				if(c < currentTileRC[0]) {
					unit.fixPosition("right", map.getTile(c, r).rightSide());
				}
				//same as before, but now the unit is in the Tile to the left
				if(c > currentTileRC[0]) {
					unit.fixPosition("left", map.getTile(c, r).leftSide());
				}
				//same as before, bu- . . . you get the idea
				if(r > currentTileRC[1]) {
					unit.fixPosition("up", map.getTile(c, r).topSide());
				}
				//etc.
				if(r < currentTileRC[1]) {
					unit.fixPosition("down", map.getTile(c, r).bottomSide());
				}
				
			
			}	
		}
	}, 
	performCollisions: function() {
	
		//check if we just won the game
		if(unitManager.units[unitManager.selectedUnit].type == "runner" && this.collisionTest(unitManager.units[unitManager.selectedUnit], map.getGoalTile())) {
			//console.log("setting " + gameEngine.win + " to true");
			gameEngine.win = true;
		}
	
		//loop through the unit array, check for monster hits
		var updatedUnits = unitManager.units.slice(0);
		for(var i = 0; i < unitManager.units.length; i++) {
			for(var j = 0; j < unitManager.monsters.length; j++) {
				if(this.collisionTest(unitManager.units[i], unitManager.monsters[j])) {
					if(unitManager.units[i].type == "runner") {
						updatedUnits.splice(i, 1);
						//if selectedUnit was zero here we would be going negative, so clamp that
						if(unitManager.selectedUnit != 0) {
							unitManager.selectedUnit--;
						}
						unitManager.runnerCount--;
					}
					if(unitManager.units[i].type == "blocker") {
						updatedUnits.splice(i, 1);
						if(unitManager.selectedUnit != 0) { 
							unitManager.selectedUnit--;
						}
						unitManager.blockerCount--;
					}
				}
			}
		}
		//update array with missing elements
		unitManager.units = updatedUnits;
		if(unitManager.units.length > 0) {
			unitManager.units[unitManager.selectedUnit].setSelectedColor();
		}
		//check if we just lost the game
		if(unitManager.runnerCount == 0) {
			gameEngine.lose = true;
		}
	
	},
	checkBounds: function(unit) {
		if(unit.x > map.numColumns * map.tileDim - unit.width) {
			unit.x = map.numColumns * map.tileDim - unit.width;
		} else if(unit.x < 0) {
			unit.x = 0;
		}
		if(unit.y > map.numRows * map.tileDim - unit.height) {
			unit.y = map.numRows * map.tileDim - unit.height;
		} else if(unit.y < 0) {
			unit.y = 0;
		}
	}


});