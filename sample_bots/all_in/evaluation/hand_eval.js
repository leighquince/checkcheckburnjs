var helper = require('../helper');
var lookup = require('./lookup');
var CardHeight = require('../poker/card_height').CardHeight;
var CardSuit = require('../poker/card_suit').CardSuit;
var _ = require('../vendor/underscore')._;

(function() {
    'use strict';
    var HandCategory = new helper.Enum(
        'NO_PAIR', 'PAIR', 'TWO_PAIR', 'THREE_OF_A_KIND', 'STRAIGHT',
        'FLUSH', 'FULL_HOUSE', 'FOUR_OF_A_KIND', 'STRAIGHT_FLUSH');
    var HoldHandSuit = new helper.Enum('FLUSH',
        'RAINBOW', 'DANGLE_SUIT', 'TRIPPLE_SUITED', 'DOUBLE_SUITED');
    var HoldHandHeight = new helper.Enum(
        'NO',
        'THREE_OF_A_KIND', //y
        'FOUR_OF_A_KIND', //y
        'TOP_PAIR_LOW_KICKERS',
        'TWO_PAIR', //y
        'TOP_PAIR_PAIR_KICKERS', //y
        'BROADWAY_TWO_PAIR', //y
        'BROADWAY_AND_DANGLER', //y
        'ACE_PAIR_WITH_BROADWAY_PAIR', //y
        'CONSECUTIVE', //y
        'LOW_PAIR_WITH_CONSECUTIVE',
        'BROADWAY_CONSECUTIVE', //y
        'MIDDLE_PAIR_WITH_CONSECUTIVE',
        'BOROADWAY_PAIR_WITH_CONSECUTIVE', //y
        'ACE_PAIR_WITH_CONSECUTIVE' //y
    );

    var HandEval = function() {

    };

    HandEval.HandCategory = HandCategory;
    HandEval.HoldHandSuit = HoldHandSuit;
    HandEval.HoldHandHeight = HoldHandHeight;


    HandEval.getHoldCardRank = function(hand) {
        var holdSuitType;
        var holdHeightType;
        var suits = {

        };
        var heights = {

        };

        _.forEach(hand, function(card) {
            if (suits[card.getSuit()]) {
                suits[card.getSuit()]++;
            } else {
                suits[card.getSuit()] = 1;
            }

            if (heights[card.getHeight()]) {
                heights[card.getHeight()]++;
            } else {
                heights[card.getHeight()] = 1;
            }

        });

        var keySuits = _.keys(suits);

        if (keySuits.length == 4) {
            holdSuitType = HoldHandSuit.RAINBOW;
        } else if (keySuits.length == 3) {
            holdSuitType = HoldHandSuit.TRIPPLE_SUITED;
        } else if (keySuits.length == 2) {
            if (suits[CardSuit.SPADES] == 2 ||
                suits[CardSuit.HEARTS] == 2 ||
                suits[CardSuit.CLUBS] == 2 ||
                suits[CardSuit.DIAMONDS] == 2) {
                holdSuitType = HoldHandSuit.DOUBLE_SUITED;
            } else {
                holdSuitType = HoldHandSuit.DANGLE_SUIT;
            }
        } else {
            holdSuitType = HoldHandSuit.FLUSH;
        }


        var keyHeights = _.keys(heights);
        for (var i = 0; i < keyHeights.length; i++) {
            keyHeights[i] = parseInt(keyHeights[i]);
        }
        //FOUR OF A KIND
        if (keyHeights.length === 1) {
            holdHeightType = HoldHandHeight.FOUR_OF_A_KIND;
        }
        keyHeights = _.sortBy(keyHeights);

        //AT LEAST A PAIR
        if (keyHeights.length === 2) {

            if (heights[keyHeights[0]] === 3 || heights[keyHeights[1]] === 3) {
                holdHeightType = HoldHandHeight.THREE_OF_A_KIND;
            } else if (!_.contains(keyHeights, CardHeight.DEUCE) &&
                !_.contains(keyHeights, CardHeight.THREE) &&
                !_.contains(keyHeights, CardHeight.FOUR) &&
                !_.contains(keyHeights, CardHeight.FIVE) &&
                !_.contains(keyHeights, CardHeight.SIX) &&
                !_.contains(keyHeights, CardHeight.SEVEN) &&
                !_.contains(keyHeights, CardHeight.EIGHT) &&
                !_.contains(keyHeights, CardHeight.NINE)
            ) {
                if (_.contains(keyHeights, CardHeight.ACE)) {

                    if (_.contains(keyHeights, CardHeight.KING)) {
                        holdHeightType = HoldHandHeight.ACE_PAIR_WITH_CONSECUTIVE;
                    } else {
                        holdHeightType = HoldHandHeight.ACE_PAIR_WITH_BROADWAY_PAIR;
                    }

                } else if (_.contains(keyHeights, CardHeight.QUEEN) &&
                    (_.contains(keyHeights, CardHeight.KING) ||
                        _.contains(keyHeights, CardHeight.JACK)
                    )) {
                    holdHeightType = HoldHandHeight.BOROADWAY_PAIR_WITH_CONSECUTIVE;

                } else {
                    holdHeightType = HoldHandHeight.BROADWAY_TWO_PAIR;
                }

            } else {
                if (_.contains(keyHeights, CardHeight.ACE) ||
                    _.contains(keyHeights, CardHeight.KING) ||
                    _.contains(keyHeights, CardHeight.QUEEN) ||
                    _.contains(keyHeights, CardHeight.JACK) ||
                    _.contains(keyHeights, CardHeight.TEN)) {


                    holdHeightType = HoldHandHeight.TOP_PAIR_PAIR_KICKERS;

                } else {
                    holdHeightType = HoldHandHeight.TWO_PAIR;
                }

            }

        }


        if (keyHeights.length === 3) {


            if (!_.contains(keyHeights, CardHeight.DEUCE) &&
                !_.contains(keyHeights, CardHeight.THREE) &&
                !_.contains(keyHeights, CardHeight.FOUR) &&
                !_.contains(keyHeights, CardHeight.FIVE) &&
                !_.contains(keyHeights, CardHeight.SIX) &&
                !_.contains(keyHeights, CardHeight.SEVEN) &&
                !_.contains(keyHeights, CardHeight.EIGHT) &&
                !_.contains(keyHeights, CardHeight.NINE)
            ) {
                if (_.contains(keyHeights, CardHeight.ACE)) {

                    if (heights[CardHeight.ACE] == 2) {
                        holdHeightType = HoldHandHeight.ACE_PAIR_WITH_CONSECUTIVE;
                    } else {

                    }

                } else

                if (_.contains(keyHeights, CardHeight.QUEEN) &&
                    (_.contains(keyHeights, CardHeight.KING) ||
                        _.contains(keyHeights, CardHeight.JACK)
                    )) {
                    holdHeightType = HoldHandHeight.BOROADWAY_PAIR_WITH_CONSECUTIVE;

                } else {
                    holdHeightType = HoldHandHeight.BROADWAY_TWO_PAIR;
                }

            } else {
                var pairHeight =
                    heights[keyHeights[0]] == 2 ? keyHeights[0] :
                    heights[keyHeights[1]] == 2 ? keyHeights[1] : keyHeights[2];

                if (keyHeights[1] >= CardHeight.TEN) {
                    holdHeightType = HoldHandHeight.BROADWAY_AND_DANGLER;

                }

                if (pairHeight >= CardHeight.TEN) {
                    var kickersAreLow = true;
                    _.forEach(keyHeights, function(keyHeight) {
                        if (keyHeight != pairHeight && keyHeight >= CardHeight.TEN) {
                            kickersAreLow = false;
                        }
                    });

                    if (kickersAreLow) {
                        holdHeightType = HoldHandHeight.TOP_PAIR_LOW_KICKERS;
                    }
                } else {

                    var pairIndex = _.indexOf(keyHeights, pairHeight);
                    var value1 = pairIndex === 0 ? pairHeight : keyHeights[0];
                    var value2 = pairIndex === 1 ? pairHeight : keyHeights[1];
                    var value3 = pairIndex === 2 ? pairHeight : keyHeights[2];

                    if (value1 + 1 == value2 &&
                        value2 + 1 == value3) {

                        if (pairHeight >= CardHeight.SIX) {
                            holdHeightType = HoldHandHeight.MIDDLE_PAIR_WITH_CONSECUTIVE;
                        }else{
                             holdHeightType = HoldHandHeight.LOW_PAIR_WITH_CONSECUTIVE;
                        }
                    }


                }


            }

        }
        //NO PAIRS
        if (keyHeights.length === 4) {

            if (!_.contains(keyHeights, CardHeight.DEUCE) &&
                !_.contains(keyHeights, CardHeight.THREE) &&
                !_.contains(keyHeights, CardHeight.FOUR) &&
                !_.contains(keyHeights, CardHeight.FIVE) &&
                !_.contains(keyHeights, CardHeight.SIX) &&
                !_.contains(keyHeights, CardHeight.SEVEN) &&
                !_.contains(keyHeights, CardHeight.EIGHT) &&
                !_.contains(keyHeights, CardHeight.NINE)
            ) {

                holdHeightType = HoldHandHeight.BROADWAY_CONSECUTIVE;

            } else if (keyHeights[1] >= CardHeight.TEN) {
                holdHeightType = HoldHandHeight.BROADWAY_AND_DANGLER;

            } else {

                if (keyHeights[0] + 1 == keyHeights[1] &&
                    keyHeights[1] + 1 == keyHeights[2] &&
                    keyHeights[2] + 1 == keyHeights[3]) {
                    holdHeightType = HoldHandHeight.CONSECUTIVE;
                }

            }
        }

        if (!holdHeightType) {
            holdHeightType = HoldHandHeight.NO;
        }
        return {
            holdSuitType: holdSuitType,
            holdHeightType: holdHeightType
        };
    };





    //hand evaluator from http://www.suffecool.net/poker/evaluator.html
    HandEval.getHandRank = function(hand) {
        var h1 = hand[0],
            h2 = hand[1],
            h3 = hand[2],
            h4 = hand[3],
            h5 = hand[4],
            result = h1 & h2 & h3 & h4 & h5 & 0xF000,
            rank = (h1 | h2 | h3 | h4 | h5) >> 16;
        if (result !== 0) {
            //straight flush or flush found
            return lookup.flushes[rank];
        } else {
            var straightHighValue = lookup.unique5[rank];
            if (straightHighValue !== 0) {
                //we have a straight or high card
                return straightHighValue;
            } else {
                //we have some sort of pair, two pair, three of a kind, full house or four of a kind
                var product = (h1 & 0xFF) * (h2 & 0xFF) * (h3 & 0xFF) * (h4 & 0xFF) * (h5 & 0xFF);
                var index = helper.binaryIndexOf.call(lookup.products, product);

                if (index > 0) {
                    return lookup.values[index];
                }
            }
        }
        //HandEval.log("Unable to determine rank from hand");
        return 8000;
    };


    HandEval.rankToCategory = function(rank) {
        if (rank === -1) {
            return HandCategory.NO_PAIR;
        }
        if (rank <= 10) {
            return HandCategory.STRAIGHT_FLUSH;
        } else if (rank <= 166) {
            return HandCategory.FOUR_OF_A_KIND;
        } else if (rank <= 322) {
            return HandCategory.FULL_HOUSE;
        } else if (rank <= 1599) {
            return HandCategory.FLUSH;
        } else if (rank <= 1609) {
            return HandCategory.STRAIGHT;
        } else if (rank <= 2467) {
            return HandCategory.THREE_OF_A_KIND;
        } else if (rank <= 3325) {
            return HandCategory.TWO_PAIR;
        } else if (rank <= 6185) {
            return HandCategory.PAIR;
        } else if (rank <= 7426) {
            return HandCategory.NO_PAIR;
        }
        HandEval.log("Unable to determine hand category from rank " + rank);

        return HandCategory.NO_PAIR;
    };
    HandEval.log = function(string) {
        process.stderr.write(string + '\n');
    };


    exports.HandEval = HandEval;

})();
