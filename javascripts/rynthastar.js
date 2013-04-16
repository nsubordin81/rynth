//pulled and modified from the following source:

// A* Pathfinding for HTML5 Canvas Tutorial
// by Christer (McFunkypants) Kaitila
// http://www.mcfunkypants.com
// http://twitter.com/McFunkypants

// Based on Edsger Dijkstra's 1959 algorithm and work by:
// Andrea Giammarchi, Alessandro Crugnola, Jeroen Beckers,
// Peter Hart, Nils Nilsson, Bertram Raphael

// Permission is granted to use this source in any
// way you like, commercial or otherwise. Enjoy!
	
findPath = function(pathStart, pathEnd) {
		
		// shortcuts for speed
		var	abs = Math.abs;
		var	max = Math.max;
		var	pow = Math.pow;
		var	sqrt = Math.sqrt;
		
		// keep track of the world dimensions
    // Note that this A-star implementation expects the world array to be square: 
	// it must have equal height and width. If your game world is rectangular, 
	// just fill the array with dummy values to pad the empty space.
	var worldWidth = map.tiles.length;
	var worldHeight = map.tiles[0].length;
	var worldSize =	worldWidth * worldHeight;
	
		var distanceFunction = function(current, end) {
			return abs(current[0] - end[0]) + Math.abs(current[1] - end[1]);
		}
	
		var findNeighbours = function(){}; //starts out empty
		//my take on it, integrates with my code.
		function Neighbours(tileCenter) {
			//I only want my NPCs to be able to go up and down, back and forth. 
			var tooManyNeighbours = map.getSurroundingTiles(tileCenter);
			var fillerup = [];
			for(var i = 0; i < tooManyNeighbours.length; i++) {
				if(tooManyNeighbours[i].walkable) {
					//eliminate diagonal tiles
					var neighborCenter = tooManyNeighbours[i].getIndicies();
					var tileRC = map.getOccupiedTile(tileCenter);
					if(neighborCenter[0] == tileRC[0] || neighborCenter[1] == tileRC[1]) {
						fillerup.push(tooManyNeighbours[i]);
					}
				}
			
			}
			return fillerup;
		
		}
		
		function Node(Parent, Point) {
		
			var newNode = {
				Parent: Parent,
				value:Point.x + (Point.y * worldWidth),
				heuristic: 0,
				score: 0
				};
				return newNode;
			}
		
	var calculatePath = function() {
	
		var mypathStart = Node(null, {x:pathStart[0], y:pathStart[1]});
		var mypathEnd = Node(null, {x:pathEnd[0], y:pathEnd[1]});
		
		//could hold all of the tiles
		var AStar = new Array(worldSize);
	
		var Open = [mypathStart];
		//list of closed Nodes
		var Closed = [];
		//list of the final output array
		var result = [];
		// reference to a Node (that is nearby)
		var myNeighbours;
		//reference to a Node (that we are considering now)
		var myNode;
		//reference to a Node (that starts a path in question)
		var myPath;
		// temp integer variables used in the calculations
		var length, max, min, i, j;
		//iterate through the opoen list until none are left
		while(length = Open.length)
		{
			max = worldSize;
			min = -1;
			for(i = 0; i < length; i++)
			{
				if(Open[i].score < max)
				{
					max = Open[i].score;
					min = i;
				}
			}
			//grab the next node and remove it from Open array
			myNode = Open.splice(min, 1)[0];
			// is it the destination node?
			if(myNode.value === mypathEnd.value)
			{
				myPath = Closed[Closed.push(myNode) - 1];
				do
				{
					result.push([myPath.x, myPath.y]);
				}
				while (myPath = myPath.Parent);
				// clear the working arrays
				AStar = Closed = Open = [];
				// we want to return start to finish
				result.reverse();
			}
			else // not the destination
			{
		// find which nearby nodes are walkable
				myNeighbours = Neighbours(myNode.x, myNode.y);
				// test each one that hasn't been tried already
				for(i = 0, j = myNeighbours.length; i < j; i++)
				{
					myPath = Node(myNode, myNeighbours[i]);
					if (!AStar[myPath.value])
					{
						// estimated cost of this particular route so far
						myPath.g = myNode.g + distanceFunction(myNeighbours[i], myNode);
						// estimated cost of entire guessed route to the destination
						myPath.f = myPath.g + distanceFunction(myNeighbours[i], mypathEnd);
						// remember this new path for testing above
						Open.push(myPath);
						// mark this node in the world graph as visited
						AStar[myPath.value] = true;
					}
				}
				// remember this route as having no more untested options
				Closed.push(myNode);
			}
		} // keep iterating until the Open list is empty
		return result;
	}

	// actually calculate the a-star path!
	// this returns an array of coordinates
	// that is empty if no path is possible
	return calculatePath();

} // end of findPath() function

