let modInfo = {
	name: "The Computer Chips Tree",
	id: "mymod",
	author: "TheGodOfCelestials",
	pointsName: "points",
	modFiles: ["layers.js", "tree.js"],

	discordName: "Incremental Universe",
	discordLink: "https://discord.gg/uQMu2VUuFe",
	initialStartPoints: new Decimal (10), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.2 Release",
	name: "Inflation growth?",
}

let changelog = `<h1>Changelog:</h1><br>
	<h1>v0.2 Release</h2><br>
	- Added new upgrades.<br>
	- Added milestones.<br>
	- Mechanic parts have to be unlocked now.<br>
	- 2nd Computer Chips row upgrades need to be unlocked now.<br>
	- Added a new challenge.<br>
	- Added a 3rd layer.<br>
	- Added upgrades for the 3rd layer.<br>
	- Added 1 row of achievements.<br>
	- Added a discord link for my game.<br>
	<h2>v0.2 Beta</h2><br>
	- Added the 2nd row of Computer Chips upgrades.<br>
	- Added 3 more upgrades to the Mechanic parts.<br>
	- Added the 1st Challenge.<br>
	- Balanced some stuff.<br>
	- Fixed a buyable gain bug.<br>
	- 1st Computer Chips buyable can now only be bought 250 times.<br>
	- Added 3 more Achievements.<br>
	- Nerfed 5th Computer Chips upgrade cost to 30,000.<br>
	- Buffed the 2nd Mechanic parts effect.<br>
	<h2>v0.2 Alpha</h2><br>
	- Extended upgrades columns from 3 to 5.<br>
	- Added a new Prestige Layer.<br>
	- Added 2 upgrades for the new Prestige layer.<br>
	- Added a Computers Chip buyable.<br>
	- Added Achievements tab.<br>
	- Added 4 Achievements.<br>
	<h2>v0.1</h1><br> 
	- Added 1st Prestige layer.<br>
	- Added 1st row of upgrades.`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1)
	if(hasUpgrade('C', 11)) gain = gain.times(upgradeEffect('C', 11))
	if(!inChallenge('C', 12)) {
		if(hasUpgrade('C', 12)) gain = gain.times(upgradeEffect('C', 12))
		if(hasUpgrade('M', 12)) gain = gain.times(upgradeEffect('M', 12))
		if(hasUpgrade('C', 21)) gain = gain.times(upgradeEffect('C', 21))
		if(hasUpgrade('C', 24)) gain = gain.times(upgradeEffect('C', 24))
	}
	if(!inChallenge('C', 11)) {
		if(hasUpgrade('C', 14)) {
			gain = gain.times(buyableEffect('C', 11).mul(getBuyableAmount('C', 11).sub(getBuyableAmount('C', 11).pow(0.9))))
			if(hasChallenge('C', 11)) {
				gain = gain.times(buyableEffect('C', 11).mul(getBuyableAmount('C', 11).sub(getBuyableAmount('C', 11).pow(0.7))))
			}
		}
	}
	if(hasAchievement('AC', 11)) gain = gain.times(1.5)
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("1e10000"))
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}