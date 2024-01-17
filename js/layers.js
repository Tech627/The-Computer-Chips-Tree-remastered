addLayer("C", {
    name: "Computer Chips", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "C", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0), 
    }},
    color: "#4BDC13",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "Computer Chips", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if(hasUpgrade('C', 13)) mult = mult.times(upgradeEffect('C', 13))
        if(hasAchievement('C', 12)) mult = mult.times(1.1)
        if(hasUpgrade('M', 11)) mult = mult.times(upgradeEffect('M', 11))
        if(hasUpgrade('C', 21)) mult = mult.times(upgradeEffect('C', 21))
        if(hasUpgrade('C', 24)) mult = mult.times(upgradeEffect('C', 24))
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
                let effect = player.points.add(1).pow(0.01)
                return effect
            },
            tooltip() {if(hasChallenge('C', 11)) {return "Boost: ((points+1)^0.01*Buyable amount-(Buyable amount^0.7)"}
            return "Boost: ((points+1)^0.01)*Buyable amount-(Buyable amount^0.9)"},
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
            if (layers[resettingLayer].row <= this.row) return;
          
            //"Stage 2, track which specific subfeatures you want to keep, e.g. Upgrade 11, Challenge 32, Buyable 12"
            let keptUpgrades = [];
            if (layers[resettingLayer].row == 1 && player.M.layerShown === true) keptUpgrades.push('C', 15);
          
            //"Stage 3, track which main features you want to keep - all upgrades, total points, specific toggles, etc."
            let keep = [keptUpgrades];
            if (player.M.layerShown === true) keep.push('C', 15);
          
            //"Stage 4, do the actual data reset"
            layerDataReset(this.layer, keep);
          
            //"Stage 5, add back in the specific subfeatures you saved earlier"
            player[this.layer].upgrades.push(15)
        },
        11: {
            title: "Production",
            description: "Gain 1 more point per second",
            cost: new Decimal(3),
            effect() {
                let effect = new Decimal(2)
                if(hasUpgrade('C', 25)) {
                    effect = new Decimal(2).mul(player.points.pow(0.03))
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
            }
        },
        12: {
            title: "Booster Chips",
            description: "Gain more points based on Computer Chips",
            cost: new Decimal(10),
            effect() {
                let effect = player[this.layer].points.add(1).pow(0.3)
                if(hasUpgrade('C', 25)) {
                    effect = player[this.layer].points.add(1).pow(0.35)
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
            }
        },
        13: {
            title: "Points booster",
            description: "Your points boost Computer Chips gain",
            cost: new Decimal(30),
            effect() {
                let effect = player.points.add(1).pow(0.3)
                if(hasUpgrade('C', 25)) {
                    effect = player[this.layer].points.add(1).pow(0.35)
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
            }
        },
        15: {
            title: "Unlocker 2",
            description: "Unlock a new layer",
            cost: new Decimal(3e4),
            unlocked() { return hasUpgrade('C', 14) || player.M.layerShown == true},
            autoUpgrade() {
                if(hasUpgrade('M', 15)) {
                    buyUpgrade('C', 15)
                    return true
                }
            }
        },
        21: {
            title: "Mechanic inventions^2",
            description: "Your points and Computer Chips are boosted by Mechanic parts",
            cost: new Decimal(1e10),
            effect() {
                let effect = player.M.points.add(1).mul(player.M.points.pow(2))
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
            }
        },
        22: {
            title: "Computer parts",
            description: "Your Computer Chips deacrease the cost for Mechanic parts",
            cost: new Decimal(1e90),
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
            }
        },
        23: {
            title: "Unlocker 3",
            description: "Unlock the 1st Challenge",
            cost: new Decimal(1e100),
            autoUpgrade() {
                if(hasUpgrade('M', 15)) {
                    buyUpgrade('C', 23)
                    return true
                }
            }
        },
        24: {
            title: "Synergy",
            description: "points boost Computer Chips gain and vice versa",
            cost: new Decimal(1e130),
            effect() {
                let effect = player.points.add(1).sqrt(player[this.layer].points.cbrt(player.points)).pow(0.03)
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
            }
        },
        25: {
            title: "To the past",
            description: "Boost first 3 upgrades of this layer",
            cost: new Decimal(1e170),
            autoUpgrade() {
                if(hasUpgrade('M', 15)) {
                    buyUpgrade('C', 25)
                    return true
                }
            }
        }
    },
    challenges: {
        11: {
            name: "You don't need that",
            challengeDescription: "Disable the 1st Computer Chips buyable",
            goalDescription: new Decimal(1e114),
            goal: new Decimal(1e114),
            rewardDescription: "1st buyable effect is much better",
            canComplete() {if(player[this.layer].points.gte(this.goal)) return true},
            unlocked() {if(hasUpgrade('C', 23)) return true}
        }
    },
    passiveGeneration() {if(hasUpgrade('M', 14)) return 1},
    layerShown(){return true}
})
addLayer("M", {
    name: "Mechanics", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "M", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#C0C0C0",
    requires() {
        let requirment = new Decimal(2e5)
        if(hasUpgrade('C', 22)) {
            requirment = requirment.div(upgradeEffect('C', 22))
        }
        return requirment
    }, // Can be a function that takes requirement increases into account
    resource: "Mechanic parts", // Name of prestige currency
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
        {key: "m", description: "M: Reset for Mechanic parts", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    upgrades: {
        11: {
            title: "Quality of life",
            description: "Your Computer Chips gain is much better depending on Mechanic parts",
            cost: new Decimal(1),
            effect() {
                let effect = player[this.layer].points.add(2).pow(5)
                return effect
            },
            effectDisplay() {
                return format(upgradeEffect(this.layer, this.id))+"x"
            },
            tooltip: "(Mechanic parts + 2)^5"
        },
        12: {
            title: "Mechanic inventions",
            description: "Your points are boosted by Computer Chips",
            cost: new Decimal(6),
            effect() {
                let effect = player.C.points.add(1).sqrt(player.C.points.sqrt(player.C.points)).pow(1.5)
                return effect
            },
            effectDisplay() {
                return format(upgradeEffect(this.layer, this.id)) + "x"
            }
        },
        13: {
            title: "Brand new parts",
            description: "Unlock 2nd row of Computer Chips upgrades",
            cost: new Decimal(8),
        },
        14: {
            title: "Quality of life 2",
            description: "Gain 100% of Computer Chips that you would on reset",
            cost: new Decimal(15),
        },
        15: {
            title: "Quality of life 3",
            description: "Automate Computer Chips Upgrades and the 1st buyable",
            cost: new Decimal(25),
        }
    },
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
            }
        },
        14: {
            name: "More production",
            tooltip: "Reset for Mechanic Parts",
            done() {
                if(player.M.layerShown = true)
                return true
            },
            onComplete() {
                player[this.layer].points = player[this.layer].points.add(1)
            }
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
            }
        },
        17: {
            name: "Aren't milestones for that?",
            tooltip: "Get the 3rd Quality of Life upgrade",
            done() {
                if(hasUpgrade('M', 15)) 
                return true
            },
            onComplete() {
                player[this.layer].points = player[this.layer].points.add(1)
            }
        }
    },
    layerShown(){return true}
})