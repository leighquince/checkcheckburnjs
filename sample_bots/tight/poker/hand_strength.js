var Deck = require('./deck').Deck;
var HandEval = require('../evaluation/hand_eval').HandEval;
var HandOmaha = require('../poker/hand_omaha').HandOmaha;
(function() {
    'use strict';

    var HandStrength = function() {

    };

    HandStrength.quickChecks = function(myHandRank) {
        if (myHandRank === 1) {
            return 1;
        }
        if (myHandRank >= 7200) {
            return 0;
        }

        return true;

    };



    HandStrength.getHighestRank = function(hand, table, myHandRank) {
        //has to start higher than any posible hand rank, max hand rank = 7426
        var strength = 8000;
        // Try all possible combinations of 2 out of 4 cards for what we have in our hand (6 possibilities)
        for (var i = 0; i < hand.length - 1; i++) {
            for (var j = i + 1; j < hand.length; j++) {


                var handCode = [];
                if (table.length == 3) { // Easy, because we must use all 3 cards on the table for evaluation
                    handCode = [];
                    handCode.push(hand[i]);
                    handCode.push(hand[j]);
                    for (var c = 0; c < table.length; c++) {
                        handCode.push(table[c]);
                    }
                    strength = Math.min(strength, HandEval.getHandRank(handCode));
                    if (myHandRank && strength < myHandRank) {
                        return strength;
                    }
                } else if (table.length == 4) { // We need to evaluate all combinations of 3 out of 4 cards (4 possibilities)
                    for (var k = 0; k < table.length; k++) {
                        handCode = [];
                        handCode.push(hand[i]);
                        handCode.push(hand[j]);
                        for (var c = 0; c < table.length; c++) {
                            if (c != k) {
                                handCode.push(table[c]);
                            }
                        }
                        strength = Math.min(strength, HandEval.getHandRank(handCode));
                        if (myHandRank && strength < myHandRank) {
                            return strength;
                        }
                    }
                } else if (table.length == 5) { // We need to evaluate all combinations of 3 out of 5 cards (10 possibilities)
                    for (var k = 0; k < table.length - 2; k++)
                        for (var l = k + 1; l < table.length - 1; l++)
                            for (var m = l + 1; m < table.length; m++) {
                                handCode = [];
                                handCode.push(hand[i]);
                                handCode.push(hand[j]);
                                handCode.push(table[k]);
                                handCode.push(table[l]);
                                handCode.push(table[m]);
                                strength = Math.min(strength, HandEval.getHandRank(handCode));
                                if (myHandRank && strength < myHandRank) {
                                    return strength;
                                }
                            }
                }


            }
        }


        return strength;
    };

    HandStrength.getWinPercentage = function(hand, table, myHandRank, maxLimit) {
        //quick check on myHandRank as somethings are obvious
        if (HandStrength.quickChecks(myHandRank) !== true) {
            return HandStrength.quickChecks(myHandRank);
        }
        var tableBitPattern = [];
        table.forEach(function(card) {
            tableBitPattern.push(card.getBitPattern());
        });

        var incrementLevel = 1;
        var deck = new Deck(hand.getCards(), table);

        //on the flop we can calculate percentage against around 150000 possibilities
        //this does not scale after the flop so increase the amount we increment on each loop
        if (table.length > 3) {
            if (maxLimit < 400) {
                incrementLevel = 6; //250ms = 400 ms
            } else if (maxLimit < 600) {
                incrementLevel = 5; //350ms = 600 ms
            } else if (maxLimit < 800) {
                incrementLevel = 4; //550ms = 800 ms
            } else if (maxLimit < 1100) {
                incrementLevel = 3; //750ms = 1100 ms
            } else {
                incrementLevel = 2; //1000ms = 1500 ms
            }


            deck.shuffle();

        }
        deck = deck.getDeckBitPattern();
        var wins = 0,
            losses = 0,
            tied = 0;


        var opponentHand = null;
        var opponentHandRank = 8000;
        for (var k = 0; k < deck.length - 3; k += 1) {
            for (var l = k + incrementLevel; l < deck.length - 2; l++) {
                for (var m = l + incrementLevel; m < deck.length - 1; m++) {
                    for (var n = m + incrementLevel; n < deck.length; n++) {
                        opponentHand = [deck[k], deck[l], deck[m], deck[n]];
                        opponentHandRank = HandStrength.getHighestRank(opponentHand, tableBitPattern);
                        if (opponentHandRank < myHandRank) {
                            ++losses;
                        } else if (opponentHandRank > myHandRank) {
                            ++wins;
                        } else {
                            ++tied;
                        }
                    }

                }
            }
        }
        return (wins + (tied / 2)) / (wins + losses + tied);

    };

    exports.HandStrength = HandStrength;

})();
