var helper = require('../helper');
var BotOpponentTracker = require('./bot_opponent_tracker').BotOpponentTracker;
var BotBet = require('./bot_bet').BotBet;
var HandEval = require('../evaluation/hand_eval').HandEval;
var HandStrength = require('../poker/hand_strength').HandStrength;

(function() {
    'use strict';

    var BotBetStratergy = function() {

    };


    BotBetStratergy.preFlop = function(state, timeout) {

        var holdHandRank = HandEval.getHoldCardRank(state.getHand().getCards());
        var playerType = state.opponentTracker.getPointInMatchStats().playerType;
        var raiseType = state.opponentTracker.lastRaiseAmountType(state.opponentTracker.getPointInMatchStats());

        if (holdHandRank.holdSuitType === HandEval.HoldHandSuit.FLUSH) {
            return BotBet.check(state);
        }

        var move = BotBet.check(state);


        switch (holdHandRank.holdHeightType) {
            case HandEval.HoldHandHeight.ACE_PAIR_WITH_CONSECUTIVE:
                move = BotBet.randomRaise(state);
                break;

            case HandEval.HoldHandHeight.BOROADWAY_PAIR_WITH_CONSECUTIVE:
            case HandEval.HoldHandHeight.LOW_PAIR_WITH_CONSECUTIVE:
            case HandEval.HoldHandHeight.MIDDLE_PAIR_WITH_CONSECUTIVE:
            case HandEval.HoldHandHeight.BROADWAY_CONSECUTIVE:

                //this means i have already made an action
                if (state.myMove) {
                    switch (playerType) {
                        //a pussy is raising be cautious
                        case BotOpponentTracker.PlayerType.PUSSY:
                            if (state.getAmountToCall() <= Math.max(100, state.getBigBlind())) {
                                move = BotBet.callBet(state);
                            }

                            break;
                        default:
                            move = BotBet.callBet(state);
                            break;
                    }

                } else {
                    switch (playerType) {
                        case BotOpponentTracker.PlayerType.PUSSY:
                            move = BotBet.allIn(state);
                            break;
                        case BotOpponentTracker.PlayerType.ALL_IN_BOT:
                            move = BotBet.callBet(state);
                            break;
                        default:
                            move = BotBet.boldRaise(state);
                            break;
                    }

                }




                break;
            case HandEval.HoldHandHeight.CONSECUTIVE:
            case HandEval.HoldHandHeight.ACE_PAIR_WITH_BROADWAY_PAIR:
            case HandEval.HoldHandHeight.BROADWAY_AND_DANGLER:
                //this means i have already made an action
                if (state.myMove) {
                    switch (playerType) {
                        //a pussy is raising be cautious
                        case BotOpponentTracker.PlayerType.PUSSY:
                            if (state.getAmountToCall() <= Math.max(100, state.getBigBlind())) {
                                move = BotBet.callBet(state);
                            }

                            break;
                        default:
                            move = BotBet.callBet(state);
                            break;
                    }

                } else {
                    switch (playerType) {
                        case BotOpponentTracker.PlayerType.PUSSY:
                        case BotOpponentTracker.PlayerType.TIGHT:
                            move = BotBet.randomRaise(state);
                            break;
                        case BotOpponentTracker.PlayerType.UNKNOWN:
                            if ((state.opponentMove && state.opponentMove.getAction !== "RAISE") || !(state.opponentMove)) {
                                move = BotBet.minimumRaise(state);
                            } else {
                                move = BotBet.callBet(state);
                            }
                            break;
                        default:
                            move = BotBet.callBet(state);
                            break;
                    }

                }
                break;


            case HandEval.HoldHandHeight.BROADWAY_TWO_PAIR:
                switch (holdHandRank.holdSuitType) {
                    case HandEval.HoldHandSuit.DOUBLE_SUITED:
                    case HandEval.HoldHandSuit.TRIPPLE_SUITED:
                    case HandEval.HoldHandSuit.DANGLE_SUIT:
                        //this means i have already made an action
                        if (state.myMove) {
                            switch (playerType) {
                                //a pussy is raising be cautious
                                case BotOpponentTracker.PlayerType.PUSSY:
                                case BotOpponentTracker.PlayerType.TIGHT:
                                    if (state.getAmountToCall() <= Math.min(100, state.getBigBlind() * 4)) {
                                        move = BotBet.callBet(state);
                                    }

                                    break;
                                default:
                                    move = BotBet.callBet(state);
                                    break;
                            }

                        } else {
                            switch (playerType) {
                                case BotOpponentTracker.PlayerType.PUSSY:
                                    move = BotBet.minimumRaise(state);
                                    break;
                                case BotOpponentTracker.PlayerType.TIGHT:
                                    move = BotBet.minimumRaise(state);

                                    if (state.myStack < move.getAmount() * 8) {
                                        move = BotBet.callBet(state);
                                    }
                                    break;
                                case BotOpponentTracker.PlayerType.UNKNOWN:
                                    move = BotBet.minimumRaise(state);
                                    break;
                                default:
                                    move = BotBet.callBet(state);
                                    break;
                            }

                        }
                        break;
                    default:
                        //this means i have already made an action
                        if (state.myMove) {
                            switch (playerType) {
                                //a pussy is raising be cautious
                                case BotOpponentTracker.PlayerType.PUSSY:
                                case BotOpponentTracker.PlayerType.TIGHT:
                                    if (state.getAmountToCall() <= Math.min(60, state.getBigBlind() * 3)) {
                                        move = BotBet.callBet(state);
                                    }

                                    break;

                                case BotOpponentTracker.PlayerType.ALL_IN_BOT:
                                    if (state.myStack > state.getAmountToCall() * 10) {
                                        move = BotBet.callBet(state);
                                    }
                                    break;
                                default:
                                    move = BotBet.callBet(state);
                                    break;
                            }

                        } else {
                            switch (playerType) {
                                case BotOpponentTracker.PlayerType.PUSSY:
                                    move = BotBet.minimumRaise(state);
                                    break;
                                case BotOpponentTracker.PlayerType.ALL_IN_BOT:
                                    if (state.myStack > state.getAmountToCall() * 10) {
                                        move = BotBet.callBet(state);
                                    }
                                    break;
                                case BotOpponentTracker.PlayerType.UNKNOWN:
                                    if ((state.opponentMove && state.opponentMove.getAction !== "RAISE") || !(state.opponentMove)) {
                                        move = BotBet.minimumRaise(state);
                                    } else {
                                        move = BotBet.callBet(state);
                                    }
                                    break;


                                default:
                                    move = BotBet.callBet(state);
                                    break;
                            }

                        }
                        break;
                }
                break;
            case HandEval.HoldHandHeight.TOP_PAIR_PAIR_KICKERS:
            case HandEval.HoldHandHeight.ACE_PAIR_WITH_CONSECUTIVE:
            case HandEval.HoldHandHeight.TWO_PAIR:


                //this means i have already made an action
                if (state.myMove) {
                    switch (playerType) {
                        //a pussy is raising be cautious
                        case BotOpponentTracker.PlayerType.PUSSY:
                        case BotOpponentTracker.PlayerType.TIGHT:
                            if (state.getAmountToCall() <= Math.min(30, state.getBigBlind())) {
                                move = BotBet.callBet(state);
                            }

                            break;
                        default:
                            move = BotBet.callBet(state);
                            break;
                    }

                } else {
                    switch (playerType) {
                        case BotOpponentTracker.PlayerType.PUSSY:
                            move = BotBet.minimumRaise(state);
                            break;
                        case BotOpponentTracker.PlayerType.ALL_IN_BOT:
                            if (state.getAmountToCall() < 30) {
                                move = BotBet.callBet(state);
                            }

                            break;
                        default:
                            if (state.myStack > state.getAmountToCall() * 8) {
                                move = BotBet.callBet(state);
                            }

                            break;
                    }

                }
                break;
            case HandEval.HoldHandHeight.TOP_PAIR_LOW_KICKERS:
            case HandEval.HoldHandHeight.FOUR_OF_A_KIND:
            case HandEval.HoldHandHeight.THREE_OF_A_KIND:
            case HandEval.HoldHandHeight.NO:
                //this means i have already made an action
                if (state.myMove) {
                    //if i have allready gone then fold
                    move = BotBet.fold(state);
                } else {
                    switch (playerType) {
                        //when playing against an allin bot just fold not worth going waisting small amounts of chips
                        case BotOpponentTracker.PlayerType.ALL_IN_BOT:
                            move = BotBet.fold(state);
                            break;

                        default:
                            if (state.myStack > state.getAmountToCall() * 10) {
                                move = BotBet.callBet(state);
                            }
                            break;
                    }

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
        var winPercentage = HandStrength.getWinPercentage(state.getHand(), state.getTable(), myHandRank, timeout);
        var move = BotBet.check(state);


        if (winPercentage >= 0.95 && state.getTable().length < 5) {
            move = BotBet.confusingRaise(state);
        } else
        if (winPercentage >= 0.9) {
            move = BotBet.allIn(state);
        } else if (winPercentage >= 0.8) {
            if (state.getAmountToCall() > 0) {
                move = BotBet.callBet(state);
            } else {
                move = BotBet.boldRaise(state);
            }
        } else if (winPercentage >= 0.7) {

            if (state.getAmountToCall() > 0 && state.getAmountToCall() <= state.getBigBlind() * 3) {
                move = BotBet.callBet(state);
            } else {
                move = BotBet.minimumRaise(state);
            }


        } else if (winPercentage >= 0.5) {
            if (state.getPot() === (state.getBigBlind() * 2) && state.getTable().length === 5) {
                move = BotBet.bluffRaise(state);
            }
        }


        return move;
    };

    BotBetStratergy.log = function(string) {
        process.stderr.write(string + '\n');
    };

    exports.BotBetStratergy = BotBetStratergy;

})();
