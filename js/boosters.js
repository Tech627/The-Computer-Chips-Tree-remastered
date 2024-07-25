addLayer("B", {
    name: "Boosters", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "B", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        boost: new Decimal(1),
        BasterPoints: new Decimal(0),
        firstFactoryAmt: new Decimal(0),
        firstFacotryCost: new Decimal(10),
        secondFactoryAmt: new Decimal(0),
        secondFacotryCost: new Decimal(100),
        thirdFactoryAmt: new Decimal(0),
        thirdFacotryCost: new Decimal(10000),
        fourthFactoryAmt: new Decimal(0),
        fourthFacotryCost: new Decimal(1e6),
    }},
    effectDescription() {
        let effect = player[this.layer].boost.add(player[this.layer].points.add(player[this.layer].points.mul(3)).pow(3).add(1))
        return ("<br>Your boosters boost your Computer Chips by " + format(effect) + "x")
    },
    nodeStyle() {
        return {'background-color': 'navy', 'color': 'aqua', 'border': '2px solid aquamarine'}
    },
    requires: new Decimal("1e628"), // Can be a function that takes requirement increases into account
    resource: "Boosters", // Name of prestige currency
    baseResource: "Points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 3, // Prestige currency exponent
    row: 1,
    branches: ["C", "CO"],
    gainMult() {
        mult = new Decimal(1)
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    upgrades: {
        11: {
            title: "Deflation",
            description: "Reduce the mechanic parts requirement by a good amount",
            cost: new Decimal(5),
            effect() {
                let effect = player[this.layer].points.add(player[this.layer].points.pow(player[this.layer].points)).pow(5).add(1)
                return effect
            },
            effectDisplay() {
                return "/" + format(upgradeEffect(this.layer, this.id))
            },
            style() {
                return {'width': '200px', 'background-color': 'aquamarine', 'border-radius': '0', 'border': '3px solid cyan',
                'font-size': '12px'
                }
            }
        },
        12: {
            title: "Boints",
            description: "Boosters boost your point gain",
            cost: new Decimal(6),
            effect() {
                let effect = player[this.layer].points.add(player[this.layer].points.pow(player[this.layer].points.div(2))).pow(2).add(1)
                return effect
            },
            effectDisplay() {
                return format(upgradeEffect(this.layer, this.id)) + "x"
            },
            style() {
                return {'width': '200px', 'background-color': 'aquamarine', 'border-radius': '0', 'border': '3px solid cyan',
                'font-size': '12px'
                }
            }
        },
        13: {
            title: "Baster Points",
            description: "Your Baster Points boost Points gain",
            cost: new Decimal(13),
            effect() {
                let effect = player[this.layer].BasterPoints.add(player[this.layer].BasterPoints.mul(5)).pow(3).add(1)
                return effect
            },
            effectDisplay() {
                return format(upgradeEffect(this.layer, this.id)) + "x"
            },
            style() {
                return {'width': '200px', 'background-color': 'aquamarine', 'border-radius': '0', 'border': '3px solid cyan',
                'font-size': '12px'
                }
            },
            unlocked() {if(hasChallenge('B', 12)) return true}
        },
        14: {
            title: "Baster mechanics",
            description: "Your Baster Points reduce the Company and Mechanic parts requirement",
            cost: new Decimal(15),
            effect() {
                let effect = player[this.layer].BasterPoints.add(player[this.layer].BasterPoints.pow(1.5)).pow(10).add(1)
                return effect
            },
            effectDisplay() {
                return format(upgradeEffect(this.layer, this.id)) + "x"
            },
            style() {
                return {'width': '200px', 'background-color': 'aquamarine', 'border-radius': '0', 'border': '3px solid cyan',
                'font-size': '12px'
                }
            },
            unlocked() {if(hasChallenge('B', 12)) return true}
        },
    },
    milestones: {
        11: {
            requirementDescription: "Get 10 Boosters",
            effectDescription: "Boosters no longer reset anything",
            done() {if(player[this.layer].points.gte(10)) return true},
        }
    },
    challenges: {
        11: {
            name: "Well this isn't fair",
            challengeDescription: "Your points gain is ^0.01, Computer Chips gain is ^0.1",
            goalDescription: "500 points",
            goal: new Decimal(500),
            rewardDescription: "Unlock a new Computer Chips upgrade and a new Computer Chips challenge, also along side of this get a 1e10"
            + " boost to your Computer Chips",
            canComplete() {if(player.points.gte(this.goal)) return true},
            unlocked() {if(player[this.layer].points.gte(8)) return true},
            style() {
                return {'background-color': 'aqua', 'font-size': '15px', 'border-radius': '0'}
            },
            onEnter() {
                player.points = new Decimal(0)
                player.C.points = new Decimal(0)
            }
        },
        12: {
            name: "New Layer comfirmed?",
            challengeDescription: "Your points gain is ^0.1, Computer Chips gain is ^0.1, none of the Computer Chips ups work except for the first one"
            + " Boints upgrade doesn't work",
            goalDescription: "2e13 points", // for now
            goal: new Decimal(2e13),
            rewardDescription: "Unlock a new set of upgrades",
            canComplete() {if(player.points.gte(this.goal)) return true},
            unlocked() {if(hasChallenge('C', 14)) return true},
            style() {
                return {'background-color': 'aqua', 'font-size': '15px', 'border-radius': '0'}
            },
            onEnter() {
                player.points = new Decimal(0)
                player.C.points = new Decimal(0)
            }
        }
    },
    clickables: {
        11: {
            title: "Gain Basters",
            display() {return "Gain 1 Baster on click"},
            canClick() {return true},
            onClick() {
                player[this.layer].BasterPoints = player[this.layer].BasterPoints.add(1)
            },
            style() {
                return {'width': '200px', "height": '50px', 'border-radius': '0', 'font-size': '14px', 'background-color': 'aquamarine',
                    "border": '3px solid cyan', 'color': 'blue'
                }
            }
        },
        21: {
            display() {return "+1 1st Factory<br>Cost: " + format(player[this.layer].firstFacotryCost) + " Baster points"},
            canClick() {
                if(player[this.layer].BasterPoints.gte(player[this.layer].firstFacotryCost)) {
                    return true
                }
            },
            onClick() {
                player[this.layer].BasterPoints = player[this.layer].BasterPoints.sub(player[this.layer].firstFacotryCost)
                player[this.layer].firstFacotryCost = player[this.layer].firstFacotryCost.mul(1.3)
                player[this.layer].firstFactoryAmt = player[this.layer].firstFactoryAmt.add(1)
            },
            style() {
                return {'width': '200px', 'min-height': '30px', 'position': 'absolute', 'right': '0', 'margin-right': '5px',
                    'border-radius': '0'
                }
            }
        },
        31: {
            display() {return "+1 2nd Factory<br>Cost: " + format(player[this.layer].secondFacotryCost) + " Baster Points"},
            canClick() {
                if(player[this.layer].BasterPoints.gte(player[this.layer].secondFacotryCost)) {
                    return true
                }
            },
            onClick() {
                player[this.layer].BasterPoints = player[this.layer].BasterPoints.sub(player[this.layer].secondFacotryCost)
                player[this.layer].secondFacotryCost = player[this.layer].secondFacotryCost.mul(1.5)
                player[this.layer].secondFactoryAmt = player[this.layer].secondFactoryAmt.add(1)
            },
            style() {
                return {'width': '200px', 'min-height': '30px', 'position': 'absolute', 'right': '0', 'margin-right': '5px',
                    'border-radius': '0', 'margin-top': '40px'
                }
            }
        },
        41: {
            display() {return "+1 3rd Factory<br>Cost: " + format(player[this.layer].thirdFacotryCost) + " Baster Points"},
            canClick() {
                if(player[this.layer].BasterPoints.gte(player[this.layer].thirdFacotryCost)) {
                    return true
                }
            },
            onClick() {
                player[this.layer].BasterPoints = player[this.layer].BasterPoints.sub(player[this.layer].thirdFacotryCost)
                player[this.layer].thirdFacotryCost = player[this.layer].thirdFacotryCost.mul(2.5)
                player[this.layer].thirdFactoryAmt = player[this.layer].thirdFactoryAmt.add(1)
            },
            style() {
                return {'width': '200px', 'min-height': '30px', 'position': 'absolute', 'right': '0', 'margin-right': '5px',
                    'border-radius': '0', 'margin-top': '80px'
                }
            }
        },
        51: {
            display() {return "+1 4th Factory<br>Cost: " + format(player[this.layer].fourthFacotryCost) + " Baster Points"},
            canClick() {
                if(player[this.layer].BasterPoints.gte(player[this.layer].fourthFacotryCost)) {
                    return true
                }
            },
            onClick() {
                player[this.layer].BasterPoints = player[this.layer].BasterPoints.sub(player[this.layer].fourthFacotryCost)
                player[this.layer].fourthFacotryCost = player[this.layer].fourthFacotryCost.mul(10)
                player[this.layer].fourthFactoryAmt = player[this.layer].fourthFactoryAmt.add(1)
            },
            style() {
                return {'width': '200px', 'min-height': '30px', 'position': 'absolute', 'right': '0', 'margin-right': '5px',
                    'border-radius': '0', 'margin-top': '120px'
                }
            }
        }
    },
    update(diff) {
        if(hasChallenge('C', 14)) {
            player[this.layer].BasterPoints = player[this.layer].BasterPoints.add(player[this.layer].firstFactoryAmt.sub(diff).div(20))
            player[this.layer].firstFactoryAmt = player[this.layer].firstFactoryAmt.add(player[this.layer].secondFactoryAmt.div(20))
            player[this.layer].secondFactoryAmt = player[this.layer].secondFactoryAmt.add(player[this.layer].thirdFactoryAmt.div(20))
            player[this.layer].thirdFactoryAmt = player[this.layer].thirdFactoryAmt.add(player[this.layer].fourthFactoryAmt.div(20))
        }
    },
    infoboxes: {
        lore4: {
            title: "log IV",
            body() {return "Aarex: Aahh.. The 2nd row layer me and Jacorb made.. It was pretty interesting.."
                + " It has some special powers but we banned it due to it beign to dangerous for anyone."
                + " Though our leader MrRedShark didn't liked the idea but we had to..<br>"
                + " Jacorb: Hey.. Maybe this adventurer can actually use it?<br>"
                + " Aarex: No.. It's too dangerous we can't lose any hope for whats coming.<br>"
                + " Jacorb: Yeah you are right... I guess he'll just stick with these lame layers."
            },
            bodyStyle() {
                return {'background-color': 'navy', 'border': '6px solid aqua'}
            },
            titleStyle() {
                return {'color': 'blue'}
            }
        }
    },
    tabFormat: {
        "Main": {
            content: [
                ["main-display",
                    function() {return "You have " + formatWhole(player[this.layer].points) + " Boosters"},
                    {'color': 'blue'}
                ],
                "blank",
                ["prestige-button",
                    function() {return true},
                    {'width': '250px', 'border-radius': '0', 'background-color': 'aqua'}
                ],
                "blank",
                "milestones",
                "blank",
                "upgrades",
                "blank",
                ["infobox",
                    function() {return "lore4"}
                ]
            ]
        },
        "Challenges": {
            content: [
                "challenges"
            ],
            unlocked() {if(player.B.points.gte(8)) return true}
        },
        "Basters": {
            content: [
                ["display-text",
                    function() {return "You have " + format(player[this.layer].BasterPoints) + " Baster points"},
                    {'font-size': '20px', 'color': 'blue'}
                ],
                "blank",
                "clickables",
                "blank",
                ["display-text",
                    function() {return format(player[this.layer].firstFactoryAmt) + " 1st Factories"},
                    {'position': 'absolute', 'left': '0', 'margin-left': '10px', 'margin-top': '-5px'}
                ],
                ["display-text",
                    function() {return format(player[this.layer].secondFactoryAmt) + " 2nd Factories"},
                    {'position': 'absolute', 'left': '0', 'margin-left': '10px', 'margin-top': '32.5px'}
                ],
                ["display-text",
                    function() {return format(player[this.layer].thirdFactoryAmt) + " 3rd Factories"},
                    {'position': 'absolute', 'left': '0', 'margin-left': '10px', 'margin-top': '70px'}
                ],
                ["display-text",
                    function() {return format(player[this.layer].fourthFactoryAmt) + " 4th Factories"},
                    {'position': 'absolute', 'left': '0', 'margin-left': '10px', 'margin-top': '107px'}
                ]
            ],
            unlocked() {if(hasChallenge('C', 14)) return true}
        }
    },
    resetsNothing() {if(hasMilestone('B', 11)) return true},
    layerShown() {if(hasUpgrade('CO', 15)) return true},
})