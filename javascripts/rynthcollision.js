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
	
		//loop through the unit array, check for monster hits and winning the game
		for(var i = 0; i < unitManager.units.length; i++) {
			if(unitManager.units[i].type == "runner" && this.collisionTest(map.getGoalTile(), unitManager.units[i])) {
				gameEngine.winScreen();
			}
		
		}
	
	
	}


});