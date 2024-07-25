addLayer("G", {
    name: "Galaxy", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "G", // This appears on the layer's node. Default is the id with the first letter capitalized
    effectDescription() {
        let effect = player[this.layer].points.add(2).mul(player[this.layer].points).add(1)
        return ("<br>Boosting your previous resources by " + format(effect) + "x")
    },
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked() {return hasUpgrade('CO', 21)},
		points: new Decimal(0),
    }},
    hotkeys: [{
        key: "ctrl+m", description: "Ctrl + M: Galaxy Reset", onPress() {if(canReset(this.layer)) doReset(this.layer)},
        unlocked() {return hasUpgrade('CO', 21)},
    }],
    color: "purple",
    requires() {return new Decimal("1e2500")}, // Can be a function that takes requirement increases into account
    nodeStyle() { return {
        'width': '150px',
        'height': '150px',
        'font-size': '70px',
        'font-family': 'Trebuchet',
        'border': '4px solid #41056b'
    }},
    resource: "Galaxies", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.002, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "ctrl+c", description: "Ctrl + C: Reset for Companies", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    upgrades: {
        11: {
            title: "Everything from the beggining",
            description: "Boost your Points by Galaxies",
            cost: new Decimal(1),
            effect() {
                let effect = player[this.layer].points.mul(player[this.layer].points.mul(3)).add(20).pow(1.2)
                return effect
            },
            effectDisplay() {
                return format(upgradeEffect('G', 11)) +"x"
            },
            style() {
                return {'width': '200px', 'border-radius': '0', 'border': '2px solid #6d09b5', 'background-color': 'purple'}
            }
        },
        12: {
            title: "Serious Dedication",
            description: "Mechanic Parts let you build something",
            cost: new Decimal(5),
            style() {
                return {'width': '200px', 'border-radius': '0', 'border': '2px solid #6d09b5', 'background-color': 'purple'}
            }
        }
    },
    infoboxes: {
        Lore5: {
            title: "Log V",
            body() {return "Jacorb: So.. you are here.. Well I am surprised.. Anyways you are here I am not going to send"
                + " you with my reinforcements yet... Because something bad happened but you don't have to worry about.."
                + " Okay I won't bother you anymore go get stronger!"
            }
        }
    },
    tabFormat: {
        "Main": {
            content: [
                "main-display",
                ["prestige-button",
                    function() {return true},
                    {'background-color': 'purple', 'width': '250px', 'border': '2px solid #41056b', 'border-radius': '0'}
                ],
                "blank",
                ["display-text", 
                    function() {return "[Row 1 Upgrades]"},
                    {'color': '#6d09b5', 'font-size': '22px'}
                ],
                "blank",
                "upgrades",
                "blank",
                ["infobox",
                    function() {return "Lore5"}
                ]
            ],
        }
    },
    layerShown() {if(hasUpgrade('CO', 21)) return true}
})