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
            cost(x) { return x = getBuyableAmount('C', 11).pow(2.5), new Decimal(100).mul(x)},
            unlocked() { return hasUpgrade('C', 14)},
            title() { return "Generation"},
            display() { return "Points are boosted by " + format(this.effect()) + "<br>" + "Cost: " + format(this.cost()) +"<br>Amount: " +
            getBuyableAmount('C', 11)},
            canAfford() { return player[this.layer].points.gte(this.cost)},
            buy() { return player[this.layer].points = player[this.layer].points.sub(this.cost),
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1)),
            buyableEffect(this.layer, this.id), { return: player[this.layer].points.add(this.effect)}},
            effect() {
                return player[this.layer].points.add(1).pow(0.1)
            }
        },
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
            player[this.layer].upgrades.push(...keptUpgrades)
        },
        11: {
            title: "Production",
            description: "Gain 1 more point per second",
            cost: new Decimal(3),
            effect() {
                let effect = new Decimal(2)
                return effect
            },
            effectDisplay() {
                return format(upgradeEffect(this.layer, this.id))
            },
        },
        12: {
            title: "Booster Chips",
            description: "Gain more points based on Computer Chips",
            cost: new Decimal(10),
            effect() {
                let effect = player[this.layer].points.add(1).pow(0.3)
                return effect
            },
            effectDisplay() {
                return format(upgradeEffect(this.layer, this.id))+"x"
            },
            unlocked() { return hasUpgrade('C', 11)}
        },
        13: {
            title: "Points booster",
            description: "Your points boost Computer Chips gain",
            cost: new Decimal(30),
            effect() {
                let effect = player.points.add(1).pow(0.3)
                return effect
            },
            effectDisplay() {
                return format(upgradeEffect(this.layer, this.id))+"x"
            },
            unlocked() { return hasUpgrade('C', 12)}
        },
        14: {
            title: "Unlocker 1",
            description: "Unlock a buyable",
            cost: new Decimal(100),
            unlocked() { return hasUpgrade('C', 13)}
        },
        15: {
            title: "Unlocker 2",
            description: "Unlock a new layer",
            cost: new Decimal(1e5),
            unlocked() { return hasUpgrade('C', 14) || player.M.layerShown == true},
            bought() {
                if(player.M.layerShown === true) {
                    return true
                }
            }
        },
    },
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
    requires: new Decimal(2e5), // Can be a function that takes requirement increases into account
    resource: "Mechanic parts", // Name of prestige currency
    baseResource: "Computer Chips", // Name of resource prestige is based on
    baseAmount() {return player.C.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1.2, // Prestige currency exponent
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
                let effect = player[this.layer].points.add(1).pow(5)
                return effect
            },
            effectDisplay() {
                return format(upgradeEffect(this.layer, this.id))+"x"
            }
        },
        12: {
            title: "Mechanic inventions",
            description: "Your points are boosted by Computer Chips",
            cost: new Decimal(6),
            effect() {
                let effect = player.C.points.add(1).cbrt(player.C.points.cbrt(player.C.points))
                return effect
            },
            effectDisplay() {
                return format(upgradeEffect(this.layer, this.id)) + "x"
            }
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
            effect() {
                if(hasUpgrade('C', 11)) {
                    player[this.layer].points = new Decimal(1)
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
            effect() {
                if(hasUpgrade('C', 12)) {
                    player[this.layer].points = new Decimal(2)
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
            effect() {
                if(hasUpgrade('C', 14)) {
                    player[this.layer].points = new Decimal(3)
                }
            }
        },
        14: {
            name: "More production",
            tooltip: "Reset for Mechanic Parts",
            done() {
                if(player.M.layerShown = true)
                return true
            },
            effect() {
                if(player.M.layerShown = true) {
                    player[this.layer].points = new Decimal(4)
                }
            }
        }
    },
    layerShown(){return true}
})