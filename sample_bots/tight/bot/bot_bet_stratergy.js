var helper = require('../helper');
var PokerMove = require('../poker/poker_move').PokerMove;
var HandEval = require('../evaluation/hand_eval').HandEval;
var HandStrength = require('../poker/hand_strength').HandStrength;

(function() {
    'use strict';

    var BotBetStratergy = function() {

    };


    BotBetStratergy.preFlop = function(state, timeout) {

        var holdHandRank = HandEval.getHoldCardRank(state.getHand().getCards());


        if (holdHandRank.holdSuitType === HandEval.HoldHandSuit.FLUSH) {
            return new PokerMove(state.getMyName(), "check", 0);
        }

        var move = new PokerMove(state.getMyName(), "check", 0);
        switch (holdHandRank.holdHeightType) {
            case HandEval.HoldHandHeight.ACE_PAIR_WITH_CONSECUTIVE:
                move = new PokerMove(state.getMyName(), "raise", state.getPot() || state.getBigBlind() * 4);
                break;
            case HandEval.HoldHandHeight.BOROADWAY_PAIR_WITH_CONSECUTIVE:
                switch (holdHandRank.holdSuitType) {
                    case HandEval.HoldHandSuit.DOUBLE_SUITED:
                    case HandEval.HoldHandSuit.TRIPPLE_SUITED:
                    case HandEval.HoldHandSuit.DANGLE_SUIT:
                        if (state.getAmountToCall()) {
                            move = new PokerMove(state.getMyName(), "call", state.getAmountToCall());
                        } else {
                            move = new PokerMove(state.getMyName(), "raise", state.getPot());
                        }
                        break;
                    case HandEval.HoldHandSuit.RAINBOW:
                        if (state.getAmountToCall()) {
                            move = new PokerMove(state.getMyName(), "call", state.getAmountToCall());
                        } else {
                            move = new PokerMove(state.getMyName(), "raise", state.getBigBlind());
                        }
                        break;
                }

                break;
            case HandEval.HoldHandHeight.LOW_PAIR_WITH_CONSECUTIVE:
            case HandEval.HoldHandHeight.MIDDLE_PAIR_WITH_CONSECUTIVE:
                if (state.getAmountToCall()) {
                    move = new PokerMove(state.getMyName(), "call", state.getAmountToCall());
                } else {
                    move = new PokerMove(state.getMyName(), "raise", state.getBigBlind()*2);
                }
                break;
            case HandEval.HoldHandHeight.BROADWAY_CONSECUTIVE:
                if (state.getAmountToCall()) {
                    move = new PokerMove(state.getMyName(), "call", state.getAmountToCall());
                } else {
                    move = new PokerMove(state.getMyName(), "raise", state.getBigBlind());
                }
                break;



            case HandEval.HoldHandHeight.CONSECUTIVE:
                if (state.getAmountToCall() > 0 && state.getAmountToCall() <= state.getBigBlind() * 2) {
                    move = new PokerMove(state.getMyName(), "call", state.getAmountToCall());
                }
                break;
            case HandEval.HoldHandHeight.ACE_PAIR_WITH_BROADWAY_PAIR:
                if (state.getAmountToCall() > 0 && state.getAmountToCall() <= state.getBigBlind() * 3) {
                    move = new PokerMove(state.getMyName(), "call", state.getAmountToCall());
                }
                break;
            case HandEval.HoldHandHeight.BROADWAY_AND_DANGLER:
                if (state.getAmountToCall() > 0 && state.getAmountToCall() <= state.getBigBlind() * 2) {
                    move = new PokerMove(state.getMyName(), "call", state.getAmountToCall());
                }
                break;
            case HandEval.HoldHandHeight.BROADWAY_TWO_PAIR:
                switch (holdHandRank.holdSuitType) {
                    case HandEval.HoldHandSuit.DOUBLE_SUITED:
                    case HandEval.HoldHandSuit.TRIPPLE_SUITED:
                    case HandEval.HoldHandSuit.DANGLE_SUIT:
                        if (state.getAmountToCall()) {
                            move = new PokerMove(state.getMyName(), "call", state.getAmountToCall());
                        }
                        break;
                    default:
                        if (state.getAmountToCall() <= state.getBigBlind() * 2) {
                            move = new PokerMove(state.getMyName(), "call", state.getAmountToCall());
                        }
                        break;
                }
                break;
            case HandEval.HoldHandHeight.TOP_PAIR_PAIR_KICKERS:
            case HandEval.HoldHandHeight.ACE_PAIR_WITH_CONSECUTIVE:
            case HandEval.HoldHandHeight.TWO_PAIR:
                if (state.getAmountToCall() > 0 && state.getAmountToCall() <= state.getBigBlind() * 4) {
                    move = new PokerMove(state.getMyName(), "call", state.getAmountToCall());
                }
                break;
            case HandEval.HoldHandHeight.TOP_PAIR_LOW_KICKERS:
            case HandEval.HoldHandHeight.FOUR_OF_A_KIND:
            case HandEval.HoldHandHeight.THREE_OF_A_KIND:
            case HandEval.HoldHandHeight.NO:
                if (state.getAmountToCall() > 0 && state.getAmountToCall() < state.getBigBlind() && state.getAmountToCall() <= 100) {
                    move = new PokerMove(state.getMyName(), "call", state.getAmountToCall());

                } else {
                    move = new PokerMove(state.getMyName(), "check", 0);

                }
                break;
        }

        return move;



    };

    BotBetStratergy.postFlop = function(state, timeout) {
        var tableBitPattern = [];
        state.getTable().forEach(function(card) {
            tableBitPattern.push(card.getBitPattern());
        });
        var myHandRank = HandStrength.getHighestRank(state.getHand().getBitPattern(), tableBitPattern);
        BotBetStratergy.log("max time: "+state.getMaxTime());
        var winPercentage = HandStrength.getWinPercentage(state.getHand(), state.getTable(), myHandRank, state.getMaxTime());
        var move = new PokerMove(state.getMyName(), "check", 0);
        if (winPercentage >= 0.95 && state.getTable().length < 5) {
            move = new PokerMove(state.getMyName(), "raise", state.getAmountToCall() || state.getBigBlind());
        } else
        if (winPercentage >= 0.9) {
            move = new PokerMove(state.getMyName(), "raise", state.getPot() || state.getBigBlind() * 4);
        } else if (winPercentage >= 0.8) {
            if (state.getAmountToCall() > 0) {
                move = new PokerMove(state.getMyName(), "call", state.getAmountToCall());
            } else {
                move = new PokerMove(state.getMyName(), "raise", state.getPot());
            }
        } else if (winPercentage >= 0.7) {

            if (state.getAmountToCall() > 0 && state.getAmountToCall() <= state.getBigBlind() * 3) {
                move = new PokerMove(state.getMyName(), "call", state.getAmountToCall());
            } else {
                move = new PokerMove(state.getMyName(), "raise", state.getBigBlind());
            }


        } else if (winPercentage >= 0.5) {
            if (state.getPot() === (state.getBigBlind() * 2) && state.getTable().length === 5) {
                move = new PokerMove(state.getMyName(), "raise", state.getBigBlind()+1);
            }
        }


        return move;
    };

    BotBetStratergy.log = function(string) {
        process.stderr.write(string + '\n');
    };

    exports.BotBetStratergy = BotBetStratergy;

})();
