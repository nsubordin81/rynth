				*****RYNTH*****
		a game of strategy and unfair advantages by Taylor Bird
		created for my cs255 course on html5 game programming

	all original code in this game is licensed under the Creative Commons by-nc-sa license http://creativecommons.org/licenses/by-nc-sa/3.0/us/. Hopefully someday I will be able to legally change that to a more software specific form of license without adversely affecting any reuse already in progre
ss.

The external code used in this project includes:
 
Simple Javascript Inheritance By John Resig 
http://ejohn.org/ 
MIT Licensed

and 

A* Pathfinding for HTML5 Canvas Tutorial by Christer (McFunkypants) Kaitila
http://www.mcfunkypants.com
http://twitter.com/McFunkypants
"Permission is granted to use this source in any
way you like, commercial or otherwise. Enjoy!"

There are references to this code where it appears

Background

The inspiration for my game came from a couple of different places. First the idea of level editing in games and how immersive I always found that. Like in Civilization, Tony Hawk's Pro Skater, or StarCraft where you had the control over the level design. I thought that might be a novel concept for a game if it could be worked into the mechanics of the game itself. The idea of on the fly creation of resources and greater interaction with the environment around the player is a frontier that I haven't seen developed in games to the extent that I would like, so Rynth is my chance to try and demo how cool it could be. I believe having this component to a game adds some more control and creativity to the playing experience that you can't have with just a B.F.G. or some such thing.

I originally kind of envisioned it from the perspective of game bosses, how they must have these crews of henchmen contractors setting up their intricate lairs to foil the hero. So I was thinking of some kind of role reversal platformer where you are the toadstools or whatever plotting against the protagonist, coming up with traps, that sort of thing. But that was getting too ambitious and if there is one thing I learned from this course it is that javascript will beat me up and take my lunch money, so I am happy to have a product at all ; ).

Story

What I tried for instead is a one player game , set in a dungeon/labyrinth. Let me set up the premise:

To be really original, let's go with a hypothetical set in some dystopian future where the society is ruled by some totalitarian regime. I'm sure nobody has done that before and it certainly hasn't been trending of late <cough, cough="">. Anyway, this regime needs to maintain order/instill fear, and it also has to make political decisions. So how can they efficiently handle both and still finish up in time to catch their evening programming? 

Along comes evil corporation Y, and they say "Look no further, Rynth is the solution." 
Need to punish thought criminals or settle a bet between high government officials? How about limiting that population size and giving people something violent to dissipate their emotions that might otherwise be focused at overthrowing you? Rynth can do all this and more! This groundbreaking intimidation system streamlines all of that tedious mass arresting , property seizing and example making which, lets face it, is a huge time sink for tyrants, right out of your hands and onto the imposing teletrons you installed everywhere.

So how does it work? Glad you asked! Say you are nervous because Bob Everyman didn't recite the last four paragraphs of the official credo with quite the gusto that his brainwashing used to demand. With the latest in quantum transport tech, you can "upload" Bob Everyman straight from his home into Rynth. The reach of the Rynth Acquisition Module (RAM) spans your entire police-state. How do know where Bob is? Turns out the legacy devices people have been walking around with for centuries since before the revolution are practically non functional if not broadcasting their location at all times, and old habits die hard.

So now Bob find himself in the arena. New entrants to the arena are assigned a role, either as a runner or a blocker. Runners are the key to determining the outcome. If all of the runners perish, the Rynth broadcast is over and any people left alive in the arena or queued up to enter it are vaporized. However, if the runner triggers the kill switch, the Rynth broadcast ends happily, everyone gets to live.

As a runner, Bob knows from watching previous Rynth broadcasts that if he makes it to the golden tile, he and all the captives with him are free. But, then there are the Beasts. Two lumbering masses of muscle and rage which have his number (and the number of all the other runners). Charging for the tile is suicide, Bob needs a better way. So he waits for blockers. If someone enters the arena as a blocker, they are issued an energy scooter for speed and a construction/destruction matrix. activating the matrix will transform the material around the blocker by either adding or removing solid matter. Activating the matrix also means the blocker is transported back into the queue of entrants. And so it goes, the blockers provide cover for the runners and things continue until either the kill switch is triggered or all of the runners perish.

In other news, evil Coporation Y is pleased to announce its plan to create "multi-Rynth: resolve conflicts with other nations by having your citizens duke it out with theirs." When the new hardware is ready, you will be notified on your private line.

Controls

You control the citizens that are dropped into the labyrinth, you can assign their roles and control their individual movements and a blocker's activation of her/his construction/destruction matrix
 
Ctrl - toggle back and forth between your units
direction keys - uh, move
shift + a direction key - if you are a blocker (green square), you can build walls around you in the direction you point. If there is already a wall there, part of it will go away. Be mindful, there are some places where you can't build walls.
number keys 1 and 2 control what type of unit you are building . 1 loads blockers, 2 runners

there are some memory leaks methinks. . . don't play too long or your browser will crash. good luck surviving long enough to worry about that Muahahahahaha!

OK!