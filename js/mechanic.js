addLayer("M", {
    name: "Mechanics", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "M", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked() {if(hasUpgrade('C', 15)) return true},
		points: new Decimal(0),
        ComputerParts: new Decimal(0),
        ComputerPartsReq: new Decimal(60),
        ComputerPartsTime: new Decimal(1),
        ComputerPartsTimeMul: new Decimal(3),
        Computers: new Decimal(0),
        ComputersBoost: new Decimal(1),
        ComputersReq: new Decimal(5),
    }},
    nodeStyle() {
        return {'background-color': '#6f7575', 'border': '2px solid #404242'}
    },
    requires() {
        let requirment = new Decimal(1000)
        if(hasUpgrade('C', 22)) {
            requirment = requirment.div(upgradeEffect('C', 22))
        }
        if(hasUpgrade('CO', 11)) {
            requirment = requirment.div(upgradeEffect('CO', 11))
        }
        if(hasUpgrade('M', 24)) {
            requirment = requirment.div(upgradeEffect('M', 24))
        }
        if(hasUpgrade('B', 11)) {
            requirment = requirment.div(upgradeEffect('B', 11))
        }
        if(hasUpgrade('B', 14)) {
            requirment = requirment.div(upgradeEffect('B', 14))
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
        mult = mult.times(player.G.points.add(2).mul(player.G.points).add(1))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {
        key: "m", description: "M: Reset for Mechanic parts", onPress(){if (canReset(this.layer)) doReset(this.layer)},
        unlocked() {return hasUpgrade('C', 15)},
        }
    ],
    branches: ['C'],
    upgrades: {
        11: {
            title: "Quality of life",
            description: "Your Computer Chips gain is much better depending on Mechanic parts",
            cost: new Decimal(1),
            effect() {
                let effect = player[this.layer].points.add(2).mul(2.5).pow(2)
                return effect
            },
            effectDisplay() {
                return format(upgradeEffect(this.layer, this.id))+"x"
            },
            style() {
                return {'height': '100px', 'width': '200px', 'border-radius': '0', 'font-size': '12px', 'background-color': 'silver',
                    'border': '2px solid grey', 'color': 'black'
                }
            }
        },
        12: {
            title: "Mechanic inventions",
            description: "Your points are boosted by Computer Chips",
            cost: new Decimal(4),
            effect() {
                let effect = player.C.points.add(1).sqrt(player.C.points.cbrt(player.C.points)).pow(0.5)
                return effect
            },
            effectDisplay() {
                return format(upgradeEffect(this.layer, this.id)) + "x"
            },
            unlocked() {if(hasUpgrade('M', 11)) return true},
            style() {
                return {'height': '100px', 'width': '200px', 'border-radius': '0', 'font-size': '12px', 'background-color': 'silver',
                    'border': '2px solid grey', 'color': 'black'
                }
            }
        },
        13: {
            title: "Brand new parts",
            description: "Unlock 2nd row of Computer Chips upgrades",
            cost: new Decimal(5),
            unlocked() {if(hasUpgrade('M', 12)) return true},
            style() {
                return {'height': '100px', 'width': '200px', 'border-radius': '0', 'font-size': '12px', 'background-color': 'silver',
                    'border': '2px solid grey', 'color': 'black'
                }
            }
        },
        14: {
            title: "Quality of life 2",
            description: "Gain 100% of Computer Chips that you would on reset",
            cost: new Decimal(9),
            unlocked() {if(hasUpgrade('M', 13)) return true},
            style() {
                return {'height': '100px', 'width': '200px', 'border-radius': '0', 'font-size': '12px', 'background-color': 'silver',
                    'border': '2px solid grey', 'color': 'black'
                }
            }
        },
        15: {
            title: "Quality of life 3",
            description: "Automate Computer Chips Upgrades and the 1st buyable",
            cost: new Decimal(9),
            unlocked() {if(hasUpgrade('M', 14)) return true},
            style() {
                return {'height': '100px', 'width': '200px', 'border-radius': '0', 'font-size': '12px', 'background-color': 'silver',
                    'border': '2px solid grey', 'color': 'black'
                }
            }
        },
        21: {
            title: "Brand new Mechanics",
            description: "Unlock The Milestones of this layer",
            cost: new Decimal(10),
            unlocked() {if(hasUpgrade('M', 15)) return true},
            style() {
                return {'height': '100px', 'width': '200px', 'border-radius': '0', 'font-size': '12px', 'background-color': 'silver',
                    'border': '2px solid grey', 'color': 'black'
                }
            }
        },
        22: {
            title: "Quality of life 4",
            description: "Mechanic parts don't reset anything",
            cost: new Decimal(10),
            unlocked() {if(hasUpgrade('M', 21)) return true},
            style() {
                return {'height': '100px', 'width': '200px', 'border-radius': '0', 'font-size': '12px', 'background-color': 'silver',
                    'border': '2px solid grey', 'color': 'black'
                }
            }
        },
        23: {
            title: "Unlocker 4",
            description: "Unlock the 2nd layer in this row",
            cost: new Decimal(20),
            unlocked() {if(hasUpgrade('M', 22)) return true},
            style() {
                return {'height': '100px', 'width': '200px', 'border-radius': '0', 'font-size': '12px', 'background-color': 'silver',
                    'border': '2px solid grey', 'color': 'black'
                }
            }
        },
        24: {
            title: "Synergy 2",
            description: "Mechanic parts deacreas Companies cost and vice versa",
            cost: new Decimal(30),
            effect() {
                let effect = player[this.layer].points.add(1).mul(player.CO.points.pow(0.7)).pow(2).add(1)
                return effect 
            },
            effectDisplay() {
                return "/" + format(upgradeEffect('M', 24))
            },
            unlocked() {if(hasUpgrade('M', 23)) return true},
            style() {
                return {'height': '100px', 'width': '200px', 'border-radius': '0', 'font-size': '12px', 'background-color': 'silver',
                    'border': '2px solid grey', 'color': 'black'
                }
            }
        },
        25: {
            title: "Unlocker 5",
            description: "Unlock a Mechanic Challenge",
            cost: new Decimal(40),
            unlocked() {if(hasChallenge('C', 13)) return true},
            style() {
                return {'height': '100px', 'width': '200px', 'border-radius': '0', 'font-size': '12px', 'background-color': 'silver',
                    'border': '2px solid grey', 'color': 'black'
                }
            }
        }
    },
    resetsNothing() {if(hasUpgrade('M', 22)) return true},
    milestones: {
        11: {
            requirementDescription: "Get 20 Mechanic parts",
            effectDescription: "Automatically gain Mechanic parts",
            done() {
                if(player[this.layer].points.gte(20)) 
                return true
            },
            unlocked() {if(hasUpgrade('M', 21)) return true}
        }
    },
    challenges: {
        11: {
            name: "Mechanical fixes",
            challengeDescription: "Computer Chips gain is ^0.5, points gain is ^0.2",
            goalDescription: "1e10 points",
            goal: new Decimal(1e10),
            rewardDescription: "Unlock a new Company upgrade and your Computer Chips gain is boosted by 1e10",
            canComplete() {if(player.points.gte(this.goal)) return true},
            unlocked() {if(hasUpgrade('M', 25)) return true},
            onEnter() {
                player.points = new Decimal(0)
                player.C.points = new Decimal(0)
            },
            style () {
                return {'border-radius': '0', 'border': '2px solid grey', 'background-color': 'silver'}
            }
        },
        12: {
            name: "Points become Mechanical",
            challengeDescription: "Points gain is ^0.05, Computer Chips gain is ^0.01",
            goalDescription: "10,000,000 points",
            goal: new Decimal(1e7),
            rewardDescription: "Boost points gain by 1e40 and your Computer Chips gain by 1e25",
            canComplete() {if(player.points.gte(this.goal)) return true},
            unlocked() {if(hasChallenge('C', 14)) return true},
            onEnter() {
                player.points = new Decimal(0)
                player.C.points = new Decimal(0)
            },
            style () {
                return {'border-radius': '0', 'border': '2px solid grey', 'background-color': 'silver'}
            }
        }
    },
    clickables: {
        11: {
            title: "Is it worth it?",
            display() {return "Have to wait more time to create Computer Parts, but Unlock something"},
            style() {
                return {'background-color': 'black', 'color': 'lime', 'width': '200px', 'height': '100px', 'border-radius': '0',
                'border': '2px solid lime'
                }
            },
            canClick() {return true},
            onClick() {
                if(getClickableState('M', 11) == false) {
                    setClickableState('M', 11, true)
                }
                else {
                    setClickableState('M', 11, false)
                }
            },
            effect() {
                effect = player[this.layer].ComputersBoost.add(player.C.points.log2(player.points)).mul(player[this.layer].Computers).add(1)
                return effect
            },
            marked() {if(getClickableState('M', 11) == true) return true}
        },
        12: {
            title: "Construct a Computer",
            display() {return "Construct a Computer and get a boost for a price of " + format(player[this.layer].ComputersReq)
                + " Computer Parts"},
            style() {
                return {'background-color': 'black', 'color': 'lime', 'width': '200px', 'height': '100px', 'border-radius': '0',
                'border': '2px solid lime'
                }
            },
            canClick() {if(player[this.layer].ComputerParts.gte(player[this.layer].ComputersReq)) return true},
            onClick() {
                player[this.layer].Computers = player[this.layer].Computers.add(1)
                player[this.layer].ComputersReq = player[this.layer].ComputersReq.mul(2.5)
                player[this.layer].ComputerParts = player[this.layer].ComputerParts.sub(player[this.layer].ComputersReq)
            },
        }
    },
    bars: {
        ComputerPartsBar: {
            direction: RIGHT,
            width: 400,
            height: 40,
            progress() {
                if(hasUpgrade('G', 12)) {
                    let progress = new Decimal(0)
                    progress = progress.add(player[this.layer].ComputerPartsTime.div(60))
                    if(player[this.layer].ComputerPartsReq.gt(0)) {
                        player[this.layer].ComputerPartsReq = player[this.layer].ComputerPartsReq.sub(player[this.layer].ComputerPartsTime.div(20))
                    }
                    if(player[this.layer].ComputerPartsReq.lte(0)) {
                        player[this.layer].ComputerPartsReq = player[this.layer].ComputerPartsReq.add(60)
                        player[this.layer].ComputerParts = player[this.layer].ComputerParts.add(1)
                    }
                    return progress
                }
            },
            instant() {return true},
        },
    },
    infoboxes: {
        lore2: {
            title: "Log II",
            body() {return "Jacorb: You reached the Mechanic layer. This layer is important because of many things."
                + " Here you'll make and test interesting mechanics of this world."
                + " This layer also has some powers that I and Aarex couldn't find. I guess you are going to "
                + "find it."
            },
        }
    },
    tabFormat: {
        "Main": {
            content: [
                "main-display",
                ["prestige-button",
                    function() {return true},
                    {'width': '250px', 'border-radius': '0', 'background-color': '#6f7575'}
                ],
                "blank",
                "display-text",
                "blank",
                "milestones",
                "blank",
                "upgrades",
                "blank",
                ["infobox",
                    function() {return "lore2"}
                ],
            ],
        },
        "Pc": {
            content: [
                ["display-text",
                    function() {return "You have " + format(player[this.layer].ComputerParts) + " Computer Parts"},
                    {'font-size': '18px', 'color': 'lime'}
                ],
                "blank",
                ["display-text",
                    function() {return "You have to wait " + formatTime(player[this.layer].ComputerPartsReq) + " to create a" 
                    + " Computer Part" }
                ],
                "blank",
                ["display-text",
                    function() {if(getClickableState('M', 11) == true) return "You have " + format(player[this.layer].Computers)
                    + " Computers<br>Your Computers are giving a " + format(clickableEffect('M', 11))
                    + "x boost to Computers Chips gain"},
                    {'font-size': '18px', 'color': 'silver'},
                ],
                "blank",
                "blank",
                "clickables",
            ],
            unlocked() {if(hasUpgrade('G', 12)) return true},
        },
        "Challenges": {
            content: [
                "challenges"
            ],
            unlocked() {if(hasUpgrade('M', 25)) return true},
        }
    },
    autoPrestige() {if(hasMilestone('M', 11)) return 1},
    layerShown() {if(hasUpgrade('C', 15)) return true}
})