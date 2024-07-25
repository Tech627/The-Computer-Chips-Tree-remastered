addLayer("C", {
    name: "Computer Chips", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "C", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0), 
    }},
    nodeStyle() {
        return {'background-color': 'black', 'color': 'lime', 'border': '2px solid green'}
    },
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "Computer Chips", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if(!inChallenge('C', 12) || !inChallenge('B', 12)) {
            if(hasUpgrade('C', 13)) mult = mult.times(upgradeEffect('C', 13))
            if(hasAchievement('C', 12)) mult = mult.times(1.1)
            if(hasUpgrade('M', 11)) mult = mult.times(upgradeEffect('M', 11))
            if(hasUpgrade('C', 21)) mult = mult.times(upgradeEffect('C', 21))
            if(hasUpgrade('C', 24)) mult = mult.times(upgradeEffect('C', 24))
        }
        if(clickableEffect('M', 11).gt(1)) {
            mult = mult.add(clickableEffect('M', 11))
        }
        if(inChallenge('M', 11)) {
            mult = mult.pow(0.5)
        }
        if(hasChallenge('M', 11)) {
            mult = mult.times(1e10)
        }
        if(inChallenge('B', 11)) {
            mult = mult.pow(0.1)
        }
        if(hasChallenge('B', 11)) {
            mult = mult.times(1e10)
        }
        if(inChallenge('M', 12)) {
            mult = mult.pow(0.01)
        }
        if(hasChallenge('M', 12)) {
            mult = mult.times(1e25)
        }
        mult = mult.times(player.G.points.add(2).mul(player.G.points).add(1))
        mult = mult.times(player.B.boost.add(player.B.points.add(player.B.points.mul(3)).pow(3).add(1)))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "c", description: "C: Reset for Computer Chips", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    buyables: {
        11: {
            cost(x) { return x = player[this.layer].points.add(1).pow(0.25), new Decimal(100).mul(x)},
            unlocked() { return hasUpgrade('C', 14)},
            title() { return "Generation"},
            display() { return "Points are boosted <br>Amount: " + getBuyableAmount('C', 11)},
            canAfford() { return player[this.layer].points.gte(this.cost)},
            buy() { return player[this.layer].points = player[this.layer].points.sub(this.cost),
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1)),
            buyableEffect(this.layer, this.id), { return: player[this.layer].points.add(this.effect)}},
            purchaseLimit() { return 250},
            effect() {
                let effect = player[this.layer].points.add(1).pow(0.25)
                return effect
            },
            tooltip() {if(hasChallenge('C', 11)) {return "Boost: ((Computer Chips + 1)^0.25)^0.7"}
            return "Boost: (Computer Chips + 1)^0.25"},
            style() {
                return {'border-radius': '0', 'background-color': 'green', 'border': '2px solid lightgreen',
                'color': 'lime', 'font-size': '15px'}
            }
        },
    },
    automate() {
        if(hasUpgrade('M', 15)) {
            if(getBuyableAmount('C', 11).lt(251)) {
                buyBuyable('C', 11)
            }
            return true
        }
    },
    upgrades: {
        doReset(resettingLayer) {
            //"Stage 1, almost always needed, makes resetting this layer not delete your progress"
            if (layers[resettingLayer].row <= layers[this.layer].row) return;
          
            //"Stage 2, track which specific subfeatures you want to keep, e.g. Upgrade 11, Challenge 32, Buyable 12"
            let keptUpgrades = []
            if (player.M.unlocked == true) keptUpgrades.push(15)
            
            //"Stage 3, track which main features you want to keep - all upgrades, total points, specific toggles, etc." 

            //"Stage 4, do the actual data reset"
            layerDataReset(this.layer);
          
            //"Stage 5, add back in the specific subfeatures you saved earlier"
            player[this.layer].upgrades.concat(...keptUpgrades)
        },
        11: {
            title: "Production",
            description: "Gain 1 more point per second",
            cost: new Decimal(3),
            effect() {
                let effect = new Decimal(2)
                if(hasUpgrade('C', 25) && !inChallenge('B', 12)) {
                    effect = new Decimal(2).mul(player.points.pow(0.000001))
                }
                if(hasUpgrade('CO', 12)) {
                    effect = new Decimal(2).add( player[this.layer].points.add(1).mul(player[this.layer].points.pow(0.1)).pow(0.05))
                }
                if(hasChallenge('C', 12)) {
                    effect = new Decimal(2).add( player[this.layer].points.add(1).mul(player[this.layer].points.pow(0.1)).pow(0.1))
                }
                return effect
            },
            effectDisplay() {
                return format(upgradeEffect(this.layer, this.id))
            },
            autoUpgrade() {
                if(hasUpgrade('M', 15)) {
                    buyUpgrade('C', 11)
                    return true
                }
            },
            style() {
                return {'height': '100px', 'width': '200px', 'border-radius': '0', 'font-size': '12px', 'background-color': 'black',
                    'border': '2px solid green', 'color': 'lime'
                }
            }
        },
        12: {
            title: "Booster Chips",
            description: "Gain more points based on Computer Chips",
            cost: new Decimal(10),
            effect() {
                let effect = player[this.layer].points.add(1).pow(0.2)
                if(hasUpgrade('C', 25)) {
                    effect = player[this.layer].points.add(1).pow(0.22)
                }
                return effect
            },
            effectDisplay() {
                return format(upgradeEffect(this.layer, this.id))+"x"
            },
            unlocked() { return hasUpgrade('C', 11) || player.M.layerShown == true},
            autoUpgrade() {
                if(hasUpgrade('M', 15)) {
                    buyUpgrade('C', 12)
                    return true
                }
            },
            style() {
                return {'height': '100px', 'width': '200px', 'border-radius': '0', 'font-size': '12px', 'background-color': 'black',
                    'border': '2px solid green', 'color': 'lime'
                }
            }
        },
        13: {
            title: "Points booster",
            description: "Your points boost Computer Chips gain",
            cost: new Decimal(30),
            effect() {
                let effect = player.points.add(1).pow(0.35)
                if(hasUpgrade('C', 25)) {
                    effect = player[this.layer].points.add(1).pow(0.38)
                }
                return effect
            },
            effectDisplay() {
                return format(upgradeEffect(this.layer, this.id))+"x"
            },
            unlocked() { return hasUpgrade('C', 12) || player.M.layerShown == true},
            autoUpgrade() {
                if(hasUpgrade('M', 15)) {
                    buyUpgrade('C', 13)
                    return true
                }
            },
            style() {
                return {'height': '100px', 'width': '200px', 'border-radius': '0', 'font-size': '12px', 'background-color': 'black',
                    'border': '2px solid green', 'color': 'lime'
                }
            }
        },
        14: {
            title: "Unlocker 1",
            description: "Unlock a buyable",
            cost: new Decimal(100),
            unlocked() { return hasUpgrade('C', 13) || player.M.layerShown == true},
            autoUpgrade() {
                if(hasUpgrade('M', 15)) {
                    buyUpgrade('C', 14)
                    return true
                }
            },
            style() {
                return {'height': '100px', 'width': '200px', 'border-radius': '0', 'font-size': '12px', 'background-color': 'black',
                    'border': '2px solid green', 'color': 'lime'
                }
            }
        },
        15: {
            title: "Unlocker 2",
            description: "Unlock a new layer",
            cost: new Decimal(500),
            unlocked() {return hasUpgrade('C', 14)},
            autoUpgrade() {
                if(hasUpgrade('M', 15)) {
                    buyUpgrade('C', 15)
                    return true
                }
            },
            style() {
                return {'height': '100px', 'width': '200px', 'border-radius': '0', 'font-size': '12px', 'background-color': 'black',
                    'border': '2px solid green', 'color': 'lime'
                }
            }
        },
        21: {
            title: "Mechanic inventions^2",
            description: "Your points and Computer Chips are boosted by Mechanic parts",
            cost: new Decimal(2e8),
            effect() {
                let effect = player.M.points.add(1).mul(player.M.points.pow(2.5)).add(1)
                return effect
            },
            effectDisplay() {
                return format(upgradeEffect('C', 21))+"x"
            },
            autoUpgrade() {
                if(hasUpgrade('M', 15)) {
                    buyUpgrade('C', 21)
                    return true
                }
            },
            unlocked() {if(hasUpgrade('M', 13)) return true},
            style() {
                return {'height': '100px', 'width': '200px', 'border-radius': '0', 'font-size': '12px', 'background-color': 'black',
                    'border': '2px solid green', 'color': 'lime'
                }
            }
        },
        22: {
            title: "Computer parts",
            description: "Your Computer Chips deacrease the cost for Mechanic parts",
            cost: new Decimal(1e29),
            effect() {
                let effect = player.C.points.add(1).mul(player.C.points.sqrt(player.C.points)).pow(0.1)
                return effect
            },
            effectDisplay() {
                return format(upgradeEffect('C', 22)) + "x"
            },
            autoUpgrade() {
                if(hasUpgrade('M', 15)) {
                    buyUpgrade('C', 22)
                    return true
                }
            },
            unlocked() {if(hasUpgrade('M', 13)) return true},
            style() {
                return {'height': '100px', 'width': '200px', 'border-radius': '0', 'font-size': '12px', 'background-color': 'black',
                    'border': '2px solid green', 'color': 'lime'
                }
            }
        },
        23: {
            title: "Unlocker 3",
            description: "Unlock the 1st Challenge",
            cost: new Decimal(1e30),
            autoUpgrade() {
                if(hasUpgrade('M', 15)) {
                    buyUpgrade('C', 23)
                    return true
                }
            },
            unlocked() {if(hasUpgrade('M', 13)) return true},
            style() {
                return {'height': '100px', 'width': '200px', 'border-radius': '0', 'font-size': '12px', 'background-color': 'black',
                    'border': '2px solid green', 'color': 'lime'
                }
            }
        },
        24: {
            title: "Synergy",
            description: "points boost Computer Chips gain and vice versa",
            cost: new Decimal(1e50),
            effect() {
                let effect = player.points.add(1).sqrt(player[this.layer].points.cbrt(player.points)).pow(0.07)
                return effect
            },
            effectDisplay() {
                return format(upgradeEffect('C', 24)) + "x"
            },
            autoUpgrade() {
                if(hasUpgrade('M', 15)) {
                    buyUpgrade('C', 24)
                    return true
                }
            },
            unlocked() {if(hasUpgrade('M', 13)) return true},
            style() {
                return {'height': '100px', 'width': '200px', 'border-radius': '0', 'font-size': '12px', 'background-color': 'black',
                    'border': '2px solid green', 'color': 'lime'
                }
            }
        },
        25: {
            title: "To the past",
            description: "Boost first 3 upgrades of this layer",
            cost: new Decimal(1e70),
            autoUpgrade() {
                if(hasUpgrade('M', 15)) {
                    buyUpgrade('C', 25)
                    return true
                }
            },
            unlocked() {if(hasUpgrade('M', 13)) return true},
            style() {
                return {'height': '100px', 'width': '200px', 'border-radius': '0', 'font-size': '12px', 'background-color': 'black',
                    'border': '2px solid green', 'color': 'lime'
                }
            }       
        },
        31: {
            title: "Company Chips",
            description: "Your Computer Chips reduce the Company requirement",
            cost: new Decimal("1e900"),
            effect() {
                let effect = player[this.layer].points.pow(0.05).add(1)
                return effect
            },
            effectDisplay() {
                return "/" + format(upgradeEffect(this.layer, this.id))
            },
            unlocked() {if(hasChallenge('B', 11)) return true},
            style() {
                return {'height': '100px', 'width': '200px', 'border-radius': '0', 'font-size': '12px', 'background-color': 'black',
                    'border': '2px solid green', 'color': 'lime'
                }
            }   
        }
    },
    challenges: {
        11: {
            name: "You don't need that",
            challengeDescription: "Disable the 1st Computer Chips buyable",
            goalDescription: "5e26 points",
            goal: new Decimal(5e26),
            rewardDescription: "1st buyable effect is much better",
            canComplete() {if(player.points.gte(this.goal)) return true},
            unlocked() {if(hasUpgrade('C', 23)) return true},
            style() {
                return {'border-radius': '0', 'border': '2px solid #33ff33', 'background-color': '#009900'}
            }
        },
        12: {
            name: "Company will help",
            challengeDescription: "Only the 1st Computer Chips upgrade works",
            goalDescription: "1e65 points",
            goal: new Decimal(1e65),
            rewardDescription: "1st Upgrade is better",
            canComplete() {if(player.points.gte(this.goal)) return true},
            unlocked() {if(hasUpgrade('CO', 13)) return true},
            style() {
                return {'border-radius': '0', 'border': '2px solid #33ff33', 'background-color': '#009900'}
            }
        },
        13: {
            name: "A way to the galaxy",
            challengeDescription: "your points gain is ^0.1",
            goalDescription: "1e25 points",
            goal: new Decimal(1e25),
            rewardDescription: "Your points are boosted by 1e20",
            canComplete() {if(player.points.gte(this.goal)) return true},
            unlocked() {if(hasUpgrade('M', 24)) return true},
            style() {
                return {'border-radius': '0', 'border': '2px solid #33ff33', 'background-color': '#009900'}
            }
        },
        14: {
            name: "Maybe worth it?",
            challengeDescription: "First 3 Computer Chips Challenges at once",
            goalDescription: "1e97 Computer Chips",
            goal: new Decimal(1e97),
            rewardDescription: "Unlock a new Booster Challenge and a new tab in Boosters. Along side of this unlock a new Mechanic parts"
            + " Challenge aswell as 1 company upgrade. Your points gain is boosted by 1e15.",
            canComplete() {if(player[this.layer].points.gte(this.goal)) return true},
            unlocked() {if(hasChallenge('B', 11)) return true},
            style() {
                return {'border-radius': '0', 'border': '2px solid #33ff33', 'background-color': '#009900'}
            },
            onEnter() {
                player.points = new Decimal(0)
                player[this.layer].points = new Decimal(0)
            },
        }
    },
    tabFormat: {
        "Main": {
            content: [
                ["main-display",
                    function() {return 'You have ' + format(player[this.layer].points, precision = 2) + " Computers Chips"},
                    {'color': 'lime'}
                ],
                ["prestige-button",
                    function() {return true},
                    {'background-color': 'black', 'border-radius': '0', 'color': 'lime', 'border': '2px solid lime', 'width': '250px'}
                ],
                "blank",
                ["display-text",
                    function() {return 'You have ' + format(player.points) + ' points'}],
                "blank",
                ["toggle", ["c", "beep"]],
                "buyables",
                "blank",
                "upgrades"
            ],
            buttonStyle() {
                return {'background-color': 'black', 'color': 'lime', 'border': '2px solid green', 'border-radius': '0'}
            }
        },
        "Challenges": {
            content: [
                "challenges"
            ],
            buttonStyle() {
                return {'background-image': 'linear-gradient(90deg, silver, gold)', 'color': 'grey', 'border': '2px solid purple',
                'border-radius': '0'}
            },
            unlocked() {if(hasUpgrade('C', 23)) return true}
        },
    },
    passiveGeneration() {if(hasUpgrade('M', 14)) return 1},
    layerShown(){return true}
})
addLayer("AC", {
    name: "Achievements",
    symbol: "AC",
    position: 0,
    startData() {return {
        unlocked: true,
        points: new Decimal(0),
    }},
    color: "#FFFF00",
    resource: "Achievement Points",
    row: "side",
    achievements: {
        11: {
            name: "The Start",
            tooltip: "Get your first Computer Chips upgrade <br> Reward: Points gain is boosted by 1.5x",
            done() {
                if(hasUpgrade('C', 11))
                return true
            },
            onComplete() {
                player[this.layer].points = player[this.layer].points.add(1)
            },
            style() {
                return {'width': '120px', 'border-radius': '0', 'height': '70px', 'background-color': 'black', 'color': 'lime',
                    'border': '2px solid green'
                }
            }
        },
        12: {
            name: "First steps",
            tooltip: "Get the 2nd Computer Chips upgrade. Reward: Your Computer Chips gain is boosted by 1.1x",
            done() {
                if(hasUpgrade('C', 12))
                return true
            },
            onComplete() {
                player[this.layer].points = player[this.layer].points.add(1)
            },
            style() {
                return {'width': '120px', 'border-radius': '0', 'height': '70px', 'background-color': 'black', 'color': 'lime',
                    'border': '2px solid green'
                }
            }
        },
        13: {
            name: "Why Is it not buying?",
            tooltip: "Get the 1st unlocker upgrade.",
            done() {
                if(hasUpgrade('C', 14))
                return true
            },
            onComplete() {
                player[this.layer].points = player[this.layer].points.add(1)
            },
            style() {
                return {'width': '120px', 'border-radius': '0', 'height': '70px', 'background-color': 'black', 'color': 'lime',
                    'border': '2px solid green'
                }
            }
        },
        14: {
            name: "More production",
            tooltip: "Reset for Mechanic Parts",
            done() {
                if(player.M.unlocked = true)
                return true
            },
            onComplete() {
                player[this.layer].points = player[this.layer].points.add(1)
            },
            style() {
                return {'width': '120px', 'border-radius': '0', 'height': '70px', 'background-color': 'silver', 'color': 'black'}
            },
        },
        15: {
            name: "new Inventions",
            tooltip: "Unlock the 2nd row of Computer Chips",
            done() {
                if(hasUpgrade('M', 13)) 
                return true
            },
            onComplete() {
                player[this.layer].points = player[this.layer].points.add(1)
            },
            style() {
                return {'width': '120px', 'border-radius': '0', 'height': '70px', 'background-color': 'black', 'color': 'lime',
                    'border': '2px solid green'
                }
            }
        },
        16: {
            name: "You maybe do need that",
            tooltip: "Do the 1st Computer Chips challenge",
            done() {
                if(hasChallenge('C', 11))
                return true
            },
            onComplete() {
                player[this.layer].points = player[this.layer].points.add(1)
            },
            style() {
                return {'width': '120px', 'border-radius': '0', 'height': '70px', 'background-color': 'black', 'color': 'lime',
                    'border': '2px solid green'
                }
            }
        },
        21: {
            name: "Aren't milestones for that?",
            tooltip: "Get the 3rd Quality of Life upgrade",
            done() {
                if(hasUpgrade('M', 15)) 
                return true
            },
            onComplete() {
                player[this.layer].points = player[this.layer].points.add(1)
            },
            style() {
                return {'width': '120px', 'border-radius': '0', 'height': '70px', 'background-color': 'silver', 'color': 'black'}
            },
        },
        22: {
            name: "Finally",
            tooltip: "Get the 1st milestone of Mechanic parts",
            done() {
                if(hasMilestone('M', 21)) 
                return true
            },
            onComplete() {
                player[this.layer].points = player[this.layer].points.add(1)
            },
            style() {
                return {'width': '120px', 'border-radius': '0', 'height': '70px', 'background-color': 'silver', 'color': 'black'}
            },
        },
        23: {
            name: "The Real Quality of Life",
            tooltip: "Get the 7th Mechanic parts upgrade",
            done() {
                if(hasUpgrade('M', 22)) 
                return true
            },
            onComplete() {
                player[this.layer].points = player[this.layer].points.add(1)
            },
            style() {
                return {'width': '120px', 'border-radius': '0', 'height': '70px', 'background-color': 'silver', 'color': 'black'}
            },
        },
        24: {
            name: "We got Company",
            tooltip: "Unlock Company",
            done() {
                if(hasUpgrade('M', 23)) 
                return true
            },
            onComplete() {
                player[this.layer].points = player[this.layer].points.add(1)
            },
            style() {
                return {'width': '120px', 'border-radius': '0', 'height': '70px', 'background-color': 'gold', 'color': 'black'}
            },
        },
        25: {
            name: "Launching more new parts",
            tooltip: "Buy the 2nd Company upgrade",
            done() {
                if(hasUpgrade('CO', 12)) 
                return true
            },
            onComplete() {
                player[this.layer].points = player[this.layer].points.add(1)
            },
            style() {
                return {'width': '120px', 'border-radius': '0', 'height': '70px', 'background-color': 'gold', 'color': 'black'}
            },
        },
        26: {
            name: "New Invention^2",
            tooltip: "Buy the 3rd Company upgrade",
            done() {
                if(hasUpgrade('CO', 13)) 
                return true
            },
            onComplete() {
                player[this.layer].points = player[this.layer].points.add(1)
            },
            style() {
                return {'width': '120px', 'border-radius': '0', 'height': '70px', 'background-color': 'gold', 'color': 'black'}
            },
        },
        31: {
            name: "Company got big plans",
            tooltip: "Finish the 2nd Computer Chips challenge",
            done() {
                if(hasChallenge('C', 12)) 
                return true
            },
            onComplete() {
                player[this.layer].points = player[this.layer].points.add(1)
            },
            style() {
                return {'width': '120px', 'border-radius': '0', 'height': '70px', 'background-color': 'gold', 'color': 'black'}
            },
        },
        32: {
            name: "Well that didn't do anything",
            tooltip: "Buy the 9th Mechanic parts upgrade",
            done() {
                if(hasUpgrade('M', 24))
                return true
            },
            onComplete() {
                player[this.layer].points = player[this.layer].points.add(1)
            },
            style() {
                return {'width': '120px', 'border-radius': '0', 'height': '70px', 'background-color': 'silver', 'color': 'black'}
            },
        }
    },
    layerShown(){return true}
})
addLayer("L", {
    name: "Lore",
    symbol: "L",
    position: 0,
    startData() {return {
        unlocked: true,
    }},
    color: "#0fa1a8",
    tooltip() {return false},
    row: "side",
    infoboxes: {
        lore: {
            title: "Log I",
            titleStyle() { return {'color': 'green'}},
            body() {return "It's you? So Listen I don't have a lot of time I need to explain this to you fast! "
                    + "So you are the adventurer. Your job is to get Powerful to destroy the Celestials. Evil ones! "
                    + "My name is Jacorb. I am here to help you. You have to reach the ?????? layer. With that layer "
                    + "you'll be able to get powerful than before these layers are just the beggining. After you get"
                    + " that layer, I will send you with my reinforcements somewhere."},
        },
        lore6: {
            title: "Log IX",
            titleStyle() { return {'color': 'red', 'background-color': 'darkred'}},
            body() {return "(While you were grinding and becoming stronger in the meantime)<br>"
                + "Jacorb: But MrRedShark we have to!<br>"
                + "MrRedShark: No I have to save her alone.. It's too dangerous.<br>"
                + "Aarex: You'll most certainly die!<br>"
                + "MrRedShark: (laughs) You think that.. Just try finding one more person to help.<br>"
                + "Jacorb: Okay.. We will.."
            },
            bodyStyle() {
                return {'border': '3px solid maroon'}
            },
        }
    },
    tabFormat: {
        "Lore": {
            content: [
                ["infobox",
                    function() {return "lore"}
                ],
                "blank",
                ["infobox",
                    function() {if(player.G.unlocked === true) return "lore6"}
                ]
            ],
        },
    },
    layerShown() {return true}
})