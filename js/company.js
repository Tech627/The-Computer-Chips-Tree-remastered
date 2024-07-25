addLayer("CO", {
    name: "Company", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "CO", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked() {if(hasUpgrade('M', 23)) return true},
		points: new Decimal(0),
    }},
    color: "#FFD700",
    requires() {
        let requirement = new Decimal(1e100)
        if(hasUpgrade('M', 24)) {
            requirement = requirement.div(upgradeEffect('M', 24))
        }
        if(hasUpgrade('C', 31)) {
            requirement = requirement.div(upgradeEffect('C', 31))
        }
        if(hasUpgrade('B', 14)) {
            requirement = requirement.div(upgradeEffect('B', 14))
        }
        requirement = requirement.div(player.G.points.add(2).mul(player.G.points).add(1))
        return requirement
    }, // Can be a function that takes requirement increases into account
    resource: "Companies", // Name of prestige currency
    baseResource: "Computer Chips", // Name of resource prestige is based on
    baseAmount() {return player.C.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 2, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {
        key: "ctrl+c", description: "Ctrl + C: Reset for Companies", onPress(){if (canReset(this.layer)) doReset(this.layer)},
        unlocked() {return hasUpgrade('M', 23)}
        },
    ],
    branches: ['C'],
    resetsNothing() {return true},
    upgrades: {
        11: {
            title: "Mechanic Companies",
            description: "Decrease the Mechanic parts cost",
            cost: new Decimal(3),
            effect() {
                let effect = player[this.layer].points.add(1).mul(player[this.layer].points.pow(0.7)).pow(10).add(1)
                return effect
            },
            effectDisplay() {
                return "/" + format(upgradeEffect('CO', 11))
            },
            style() {
                return {'width': '200px', 'backgroundColor': "gold", 'border-radius': '0', 'font-size': '12px'}
            },
        },
        12: {
            title: "Company Production",
            description: "Boost the 1st Computer Chips upgrade",
            cost: new Decimal(4),
            effect() {
                let effect = player[this.layer].points.add(1).mul(player[this.layer].points.pow(0.1)).pow(0.05).add(1)
                return effect
            },
            effectDisplay() {
                return format(upgradeEffect('CO', 12)) + "x"
            },
            style() {
                return {'width': '200px', 'backgroundColor': "gold", 'border-radius': '0', 'font-size': '12px'}
            },
            unlocked() {if(hasUpgrade('CO', 11)) return true}
        },
        13: {
            title: "Company Unlocker 1",
            description: "Unlock the 2nd Computer Chips Challenge",
            cost: new Decimal(10),
            style() {
                return {'width': '200px', 'backgroundColor': "gold", 'border-radius': '0', 'font-size': '12px'}
            },
            unlocked() {if(hasUpgrade('CO', 12)) return true}
        },
        14: {
            title: "Quality of life 5",
            description: "Auto-Get Companies",
            cost: new Decimal(20),
            style() {
                return {'width': '200px', 'backgroundColor': "gold", 'border-radius': '0', 'font-size': '12px'}
            },
            unlocked() {if(hasUpgrade('CO', 13)) return true}
        },
        15: {
            title: "Boosters?",
            description: "Unlock a new 2nd row layer",
            cost: new Decimal(40),
            style() {
                return {'width': '200px', 'backgroundColor': "gold", 'border-radius': '0', 'font-size': '12px'}
            },
            unlocked() {if(hasChallenge('M', 11)) return true}
        },
        21: {
            title: "Galaxy Unlocker",
            description: "Unlock the Galaxy layer",
            cost: new Decimal(90),
            style() {
                return {'width': '200px', 'backgroundColor': "gold", 'border-radius': '0', 'font-size': '12px'}
            },
            unlocked() {if(hasChallenge('C', 14)) return true}
        }
    },
    infoboxes: {
        lore3: {
            title: "Log III",
            body() {return "Jacorb: Here you are.. Companies.. They can help a man a lot, and even create some interesting stuff."
                + " anyways I wish you good luck on your journey and I hope you reach the next layer fast..."
            },
        },
    },
    tabFormat: {
        "Main": {
            content: [
                "main-display",
                ["prestige-button",
                    function() {return true},
                    {'width': '250px', 'background-color': 'gold', 'border-radius': '0', 'border': '2px solid white'}
                ],
                "blank",
                "milestones",
                "blank",
                "upgrades",
                "blank",
                ["infobox",
                    function() {return "lore3"}
                ]
            ]
        }
    },
    autoPrestige() {if(hasUpgrade('CO', 14)) return true},
    layerShown() {if(hasUpgrade('M', 23)) return true}
})