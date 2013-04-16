/**
	Input handling
*/ 
InputHandler = Class.extend({

keyState: [256],
ctrlLock: false,
shiftLock:false,
selectedUnit: 0,

init: function() {
	document.getElementById('canvas').addEventListener('keydown', this.onKeyDown);
	document.getElementById('canvas').addEventListener('keyup', this.onKeyUp);
},

onKeyDown: function(event) {	
	//override the hotkeys for my controls in the browser. I don't know how to handle interrupts, so there you go. 
	if(event.altKey){
		event.preventDefault();
	}
	if(event.shiftKey) {
		event.preventDefault();
	}

	inputHandler.keyState[event.keyCode] = true;
},

onKeyUp: function(event) {
	inputHandler.keyState[event.keyCode] = false;
},

//using frame-based movement for now, seems sufficient for one player client side game
handleInput: function() {
	
	if(unitManager.units[unitManager.selectedUnit]) {
		//handle arrow key input
		if (inputHandler.keyState[37]) {
			unitManager.units[unitManager.selectedUnit].move("left");
		} if (inputHandler.keyState[39]) {
			unitManager.units[unitManager.selectedUnit].move("right");
		} if (inputHandler.keyState[38]) {
			unitManager.units[unitManager.selectedUnit].move("up");
		} if (inputHandler.keyState[40]) {
			unitManager.units[unitManager.selectedUnit].move("down");
		} if (inputHandler.keyState[17]) {
			//toggle between units. The lock says, "no you can't make it like Christmas up in here son! One unit per press!"
			if(!this.ctrlLock) {
				unitManager.units[unitManager.selectedUnit].resetColor();
				unitManager.selectedUnit = (unitManager.selectedUnit + 1) % unitManager.units.length;
				//set the color of the selected unit to something flashy
				unitManager.units[unitManager.selectedUnit].setSelectedColor();
				this.ctrlLock = true;
			}
		} if(!inputHandler.keyState[17]) {
			//we released the ctrl key, so turn off the lock, until next time. . . 
			this.ctrlLock = false;
		}if(unitManager.units[unitManager.selectedUnit].hasAbility) {
			//building walls and other fun stuff.	
			if (inputHandler.keyState[16] && !this.shiftLock) {
				//if one of the arrow keys is pressed in combination with Shift, make some walls then kill off the unit
				//for your own safety.
				//using ASCII values for the keys.
				if(inputHandler.keyState[39]) {
					this.shiftLock = true;
					map.constructWalls(unitManager.units[unitManager.selectedUnit].getCenter(), "right");
					unitManager.removeSelected();
				}else if (inputHandler.keyState[37]) {
					this.shiftLock = true;
					map.constructWalls(unitManager.units[unitManager.selectedUnit].getCenter(), "left");
					unitManager.removeSelected();
				}else if (inputHandler.keyState[38]) {
					this.shiftLock = true;
					map.constructWalls(unitManager.units[unitManager.selectedUnit].getCenter(), "up");
					unitManager.removeSelected();
				}else if (inputHandler.keyState[40]) {
					this.shiftLock = true;
					map.constructWalls(unitManager.units[unitManager.selectedUnit].getCenter(), "down");
					unitManager.removeSelected();
				}
			} if(!inputHandler.keyState[16]) {
			//we released the Shift key, so turn off the lock, until next time. . . 
			this.shiftLock = false;
			}
		}
		
		/*if (inputHandler.keyState[16] && inputHandler.keyState[39]) {
			
		}*/
		
		
	}	
		if (inputHandler.keyState[49]) {
			//number 1 selects unit type 1
			unitManager.buildIndex = 0;
		} if (inputHandler.keyState[50]) {
			//number 2 selects unit type 2
			unitManager.buildIndex = 1;
		} 
		
}

});

