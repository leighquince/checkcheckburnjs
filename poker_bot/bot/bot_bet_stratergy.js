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
        var alawysPlayerType = playerType == state.opponentTracker.getOverallStats().playerType;
        var raiseType = state.opponentTracker.lastRaiseAmountType(state.opponentTracker.getPointInMatchStats());
        
        //just check/fold a flush it's no good to anyone
        if (holdHandRank.holdSuitType === HandEval.HoldHandSuit.FLUSH) {
            return BotBet.check(state);
        }

        //default move
        var move = BotBet.check(state);
        var gettingDesperate = false;

        //can i bully the opponent if so just try that
        if ((state.opponentTracker.canBeBullied() == BotOpponentTracker.Advice.TRY ||
                state.opponentTracker.canBeBullied() == BotOpponentTracker.Advice.YES) &&
            (!state.myPreviousMove || (state.myPreviousMove && state.myPreviousMove.getAction() !== "raise"))) {
            return BotBet.bluffRaise(state);
        }

        
        //if im below 1000 im getting desperate
        if (state.myStack < 1000) {
            gettingDesperate = true;
        }
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
                        case BotOpponentTracker.PlayerType.ALL_IN_BOT:
                        case BotOpponentTracker.PlayerType.AGRESSIVE:
                            if (!alawysPlayerType && (state.opponentTracker.canBeBullied() == BotOpponentTracker.Advice.TRY || state.opponentTracker.canBeBullied() == BotOpponentTracker.Advice.YES)) {
                                move = BotBet.boldRaise(state);
                            } else if (gettingDesperate) {
                                move = BotBet.boldRaise(state);
                            } else {
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
                        case BotOpponentTracker.PlayerType.ALL_IN_BOT:
                        case BotOpponentTracker.PlayerType.AGRESSIVE:
                            if (!alawysPlayerType && (state.opponentTracker.canBeBullied() == BotOpponentTracker.Advice.TRY || state.opponentTracker.canBeBullied() == BotOpponentTracker.Advice.YES)) {
                                move = BotBet.boldRaise(state);
                            } else if (gettingDesperate) {
                                move = BotBet.boldRaise(state);
                            } else {
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
                        case BotOpponentTracker.PlayerType.UNKNOWN:
                            if (!BotBetStratergy.opponentIsRaising(state) || !state.opponentMove) {
                                move = BotBet.randomRaise(state);
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
                                case BotOpponentTracker.PlayerType.ALL_IN_BOT:
                                case BotOpponentTracker.PlayerType.AGRESSIVE:
                                    if (!alawysPlayerType && (state.opponentTracker.canBeBuilled == BotOpponentTracker.Advice.TRY || state.opponentTracker.canBeBuilled == BotOpponentTracker.Advice.YES)) {
                                        move = BotBet.boldRaise(state);
                                    } else if (gettingDesperate) {
                                        move = BotBet.boldRaise(state);
                                    } else {
                                        move = BotBet.fold(state);
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
                                case BotOpponentTracker.PlayerType.AGRESSIVE:
                                    if (!alawysPlayerType && (state.opponentTracker.canBeBuilled == BotOpponentTracker.Advice.TRY || state.opponentTracker.canBeBuilled == BotOpponentTracker.Advice.YES)) {
                                        move = BotBet.boldRaise(state);
                                    } else if (gettingDesperate) {
                                        move = BotBet.boldRaise(state);
                                    } else {
                                        move = BotBet.fold(state);
                                    }
                                    break;
                                default:
                                    move = BotBet.callBet(state);
                                    break;
                            }

                        } else {
                            switch (playerType) {
                                case BotOpponentTracker.PlayerType.ALL_IN_BOT:
                                    if (state.myStack > state.getAmountToCall() * 10) {
                                        move = BotBet.callBet(state);
                                    }
                                    break;
                                case BotOpponentTracker.PlayerType.UNKNOWN:
                                case BotOpponentTracker.PlayerType.PUSSY:
                                case BotOpponentTracker.PlayerType.TIGHT:
                                    if (!BotBetStratergy.opponentIsRaising(state) || !state.opponentMove) {
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
                        case BotOpponentTracker.PlayerType.ALL_IN_BOT:
                        case BotOpponentTracker.PlayerType.AGRESSIVE:
                            if (!alawysPlayerType && (state.opponentTracker.canBeBuilled == BotOpponentTracker.Advice.TRY || state.opponentTracker.canBeBuilled == BotOpponentTracker.Advice.YES)) {
                                move = BotBet.boldRaise(state);
                            } else if (gettingDesperate) {
                                move = BotBet.boldRaise(state);
                            } else {
                                move = BotBet.fold(state);
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
                        case BotOpponentTracker.PlayerType.ALL_IN_BOT:
                        case BotOpponentTracker.PlayerType.AGRESSIVE:
                            if (!alawysPlayerType && (state.opponentTracker.canBeBuilled == BotOpponentTracker.Advice.TRY || state.opponentTracker.canBeBuilled == BotOpponentTracker.Advice.YES)) {
                                move = BotBet.boldRaise(state);
                            } else if (gettingDesperate) {
                                move = BotBet.boldRaise(state);
                            } else {
                                move = BotBet.fold(state);
                            }
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
        var winPercentage = state.winPercentage !== null ? state.winPercentage : HandStrength.getWinPercentage(state.getHand(), state.getTable(), myHandRank, timeout);
        var playerType = state.opponentTracker.getPointInMatchStats().playerType;
        var raiseType = state.opponentTracker.lastRaiseAmountType(state.opponentTracker.getPointInMatchStats());
        var move = BotBet.check(state);
        var gettingDesperate = false;
        if (state.myStack < 1000) {
            gettingDesperate = true;
            winPercentage = winPercentage + 0.2;
        }
        var string = 'Round: ' + state.getRound() + ': ' + state.opponentTracker.getPointInMatchStats().name + ', PlayerType: ' + playerType + ', raiseType: ' + raiseType;


        //if I dont have enough to see another hand might as well go all in on this one! why the hell not!
        if (state.getAmountToCall() > 0 && state.myStack <= state.getBigBlind()) {
            move = BotBet.allIn(state);
        } else 
             //can i bully the opponent if so just try that
        if (state.opponentTracker.canBeBullied() == BotOpponentTracker.Advice.YES &&
            (!state.myPreviousMove || (state.myPreviousMove && state.myPreviousMove.getAction() !== "raise"))) {
            return BotBet.bluffRaise(state);
        
        }else if (winPercentage >= 0.95) {
            string += ', Win Percentage: >=0.95';
            move = BotBetStratergy.postFlopGodLikeHandStratergy(state, playerType, raiseType);
        } else
        if (winPercentage >= 0.9) {
            string += ', Win Percentage: >=0.9';
            move = BotBetStratergy.postFlopVeryGoodHandStratergy(state, playerType, raiseType);
        } else if (winPercentage >= 0.8) {
            string += ', Win Percentage: >=0.8';
            move = BotBetStratergy.postFlopGoodHandStratergy(state, playerType, raiseType);
        } else if (winPercentage >= 0.7) {
            string += ', Win Percentage: >=0.7';
            move = BotBetStratergy.postFlopAverageHandStratergy(state, playerType, raiseType);
        } else if (winPercentage >= 0.5) {
            string += ', Win Percentage: >=0.5';
            move = BotBetStratergy.postFlopMehHandStratergy(state, playerType, raiseType);
        } else {
            string += ', Win Percentage: <0.5';
            move = BotBetStratergy.postFlopCrapHandStratergy(state, playerType, raiseType);
        }

        BotBetStratergy.log(string);
        return move;
    };



    BotBetStratergy.postFlopVeryGoodHandStratergy = function(state, playerType, raiseType) {
        var move = BotBet.confusingRaise(state);
        switch (playerType) {
            case BotOpponentTracker.PlayerType.ALL_IN_BOT:
                if (!BotBetStratergy.opponentIsRaising(state))
                {
                    move = BotBet.allIn(state);
                }else{
                    move = BotBet.callBet(state);
                }

                break;
            default:
                move = BotBet.confusingRaise(state);
                break;
        }

        return move;
    };
    BotBetStratergy.postFlopGodLikeHandStratergy = function(state, playerType, raiseType) {
        var move = BotBet.confusingRaise(state);
        switch (playerType) {
            case BotOpponentTracker.PlayerType.ALL_IN_BOT:
                if (!BotBetStratergy.opponentIsRaising(state))
                {
                    move = BotBet.allIn(state);
                }else{
                    move = BotBet.callBet(state);
                }

                break;
            default:
                move = BotBet.confusingRaise(state);
                break;
        }

        return move;
    };

    BotBetStratergy.postFlopGoodHandStratergy = function(state, playerType, raiseType) {
        var move = BotBet.check(state);
        switch (playerType) {
            case BotOpponentTracker.PlayerType.ALL_IN_BOT:
                move = BotBet.allIn(state);
                break;
            case BotOpponentTracker.PlayerType.AGRESSIVE:
                if (BotBetStratergy.opponentIsRaising(state)) {
                    switch (raiseType) {
                        case BotOpponentTracker.RaiseAmountType.ABOVE:
                        case BotOpponentTracker.RaiseAmountType.AVERAGE:
                        case BotOpponentTracker.RaiseAmountType.BELOW:
                            move = BotBet.callBet(state);
                            break;
                        default:

                            if (BotBetStratergy.canSeeCall(state, 15)) {
                                move = BotBet.minimumRaise(state);
                            } else {
                                move = BotBet.callBet(state);
                            }
                            break;
                    }
                } else {
                    if (BotBetStratergy.moneyToBluff(state, 5)) {
                        move = BotBet.minimumRaise(state);
                    } else {
                        move = BotBet.check(state);
                    }

                }
                break;
            case BotOpponentTracker.PlayerType.TIGHT:
                if (BotBetStratergy.opponentIsRaising(state)) {
                    switch (raiseType) {
                        case BotOpponentTracker.RaiseAmountType.ABOVE:
                            move = BotBet.fold(state);
                            break;
                        case BotOpponentTracker.RaiseAmountType.AVERAGE:
                            move = BotBet.callBet(state);
                            break;
                        case BotOpponentTracker.RaiseAmountType.BELOW:
                            if (state.opponentTracker.canBeBuilled == BotOpponentTracker.Advice.TRY ||
                                state.opponentTracker.canBeBuilled == BotOpponentTracker.Advice.YES) {
                                move = BotBet.bluffRaise(state);
                            } else {
                                move = BotBet.callBet(state);
                            }
                            break;
                        default:
                            if (BotBetStratergy.canSeeCall(state, 8)) {
                                move = BotBet.callBet(state);
                            } else {
                                move = BotBet.fold(state);
                            }
                            break;
                    }
                } else {
                    if (BotBetStratergy.moneyToBluff(state, 10)) {
                        move = BotBet.bluffRaise(state);
                    } else {
                        move = BotBet.check(state);
                    }
                }
                break;
            case BotOpponentTracker.PlayerType.PUSSY:
                if (BotBetStratergy.opponentIsRaising(state)) {
                    switch (raiseType) {
                        case BotOpponentTracker.RaiseAmountType.ABOVE:
                        case BotOpponentTracker.RaiseAmountType.AVERAGE:
                            move = BotBet.fold(state);
                            break;
                        case BotOpponentTracker.RaiseAmountType.BELOW:
                            move = BotBet.callBet(state);
                            break;
                        default:
                            if (BotBetStratergy.canSeeCall(state, 4)) {
                                move = BotBet.callBet(state);
                            } else {
                                move = BotBet.fold(state);
                            }
                            break;
                    }
                } else {
                    move = BotBet.minimumRaise(state);
                }
                break;
            default:
                if (BotBetStratergy.canSeeCall(state, 4)) {
                    move = BotBet.callBet(state);
                } else {
                    move = BotBet.minimumRaise(state);
                }
                break;
        }
        return move;

    };

    BotBetStratergy.postFlopAverageHandStratergy = function(state, playerType, raiseType) {
        var move = BotBet.check(state);
        switch (playerType) {
            case BotOpponentTracker.PlayerType.ALL_IN_BOT:
            case BotOpponentTracker.PlayerType.AGRESSIVE:
                if (BotBetStratergy.opponentIsRaising(state)) {
                        move = BotBet.allIn(state);
                } else {
                    move = BotBet.check(state);
                }
                break;
            case BotOpponentTracker.PlayerType.TIGHT:
                if (BotBetStratergy.opponentIsRaising(state)) {
                    switch (raiseType) {
                        case BotOpponentTracker.RaiseAmountType.ABOVE:
                            move = BotBet.fold(state);
                            break;
                        case BotOpponentTracker.RaiseAmountType.AVERAGE:
                            move = BotBet.callBet(state);
                            break;
                        case BotOpponentTracker.RaiseAmountType.BELOW:
                            if (state.opponentTracker.canBeBuilled == BotOpponentTracker.Advice.TRY ||
                                state.opponentTracker.canBeBuilled == BotOpponentTracker.Advice.YES) {
                                move = BotBet.bluffRaise(state);
                            } else {
                                if (BotBetStratergy.canSeeCall(state, 15)) {
                                    move = BotBet.callBet(state);
                                } else {
                                    move = BotBet.fold(state);
                                }
                            }
                            break;
                        default:
                            if (BotBetStratergy.canSeeCall(state, 8)) {
                                move = BotBet.callBet(state);
                            } else {
                                move = BotBet.fold(state);
                            }
                            break;
                    }
                } else {
                    if (state.opponentTracker.canBeBuilled == BotOpponentTracker.Advice.TRY ||
                        state.opponentTracker.canBeBuilled == BotOpponentTracker.Advice.YES) {
                        move = BotBet.bluffRaise(state);
                    } else {
                        move = BotBet.check(state);
                    }
                }
                break;
            case BotOpponentTracker.PlayerType.PUSSY:
                if (BotBetStratergy.opponentIsRaising(state)) {
                    switch (raiseType) {
                        case BotOpponentTracker.RaiseAmountType.ABOVE:
                        case BotOpponentTracker.RaiseAmountType.AVERAGE:
                            move = BotBet.fold(state);
                            break;
                        case BotOpponentTracker.RaiseAmountType.BELOW:
                            move = BotBet.callBet(state);
                            break;
                        default:
                            if (BotBetStratergy.canSeeCall(state, 8)) {
                                move = BotBet.callBet(state);
                            } else {
                                move = BotBet.fold(state);
                            }
                            break;
                    }
                } else {
                    move = BotBet.minimumRaise(state);
                }
                break;
            default:
                if (state.getAmountToCall() > 0 && state.getAmountToCall() <= state.getBigBlind() * 3) {
                    move = BotBet.callBet(state);
                } else {
                    move = BotBet.check(state);
                }
                break;
        }
        return move;
    };

    BotBetStratergy.postFlopMehHandStratergy = function(state, playerType, raiseType) {
        var move = BotBet.check(state);
        switch (playerType) {
            case BotOpponentTracker.PlayerType.ALL_IN_BOT:
            case BotOpponentTracker.PlayerType.AGRESSIVE:
                if (BotBetStratergy.opponentIsRaising(state)) {
                    if (!BotBetStratergy.moneyToBluff(state, 2)) {
                        move = BotBet.allIn(state);
                    } else {
                        move = BotBet.fold(state);
                    }

                } else {
                    move = BotBet.check(state);
                }
                break;
            case BotOpponentTracker.PlayerType.TIGHT:
                if (BotBetStratergy.opponentIsRaising(state)) {
                    switch (raiseType) {
                        case BotOpponentTracker.RaiseAmountType.ABOVE:
                            move = BotBet.fold(state);
                            break;
                        case BotOpponentTracker.RaiseAmountType.AVERAGE:
                        case BotOpponentTracker.RaiseAmountType.BELOW:
                            if (BotBetStratergy.canSeeCall(state, 10)) {
                                move = BotBet.callBet(state);
                            } else {
                                move = BotBet.fold(state);
                            }
                            break;
                        default:
                            if (BotBetStratergy.canSeeCall(state, 10)) {
                                move = BotBet.callBet(state);
                            } else {
                                move = BotBet.fold(state);
                            }
                            break;
                    }
                } else {
                    if (state.opponentTracker.canBeBuilled == BotOpponentTracker.Advice.TRY ||
                        state.opponentTracker.canBeBuilled == BotOpponentTracker.Advice.YES) {
                        move = BotBet.bluffRaise(state);
                    } else {
                        move = BotBet.check(state);
                    }

                }
                break;
            case BotOpponentTracker.PlayerType.PUSSY:
                if (BotBetStratergy.opponentIsRaising(state)) {
                    move = BotBet.fold(state);
                } else {
                    move = BotBet.minimumRaise(state);
                }
                break;
            default:
                if (state.opponentTracker.canBeBuilled == BotOpponentTracker.Advice.TRY ||
                    state.opponentTracker.canBeBuilled == BotOpponentTracker.Advice.YES) {
                    move = BotBet.bluffRaise(state);
                } else {
                    if (state.getPot() === (state.getBigBlind() * 2) && state.getTable().length === 5) {
                        move = BotBet.bluffRaise(state);
                    } else {
                        move = BotBet.check(state);
                    }
                }
                break;
        }
        return move;
    };

    BotBetStratergy.postFlopCrapHandStratergy = function(state, playerType, raiseType) {
        var move = BotBet.check(state);
        switch (playerType) {
            case BotOpponentTracker.PlayerType.ALL_IN_BOT:
            case BotOpponentTracker.PlayerType.AGRESSIVE:
                if (BotBetStratergy.opponentIsRaising(state)) {
                    if (state.myStack < 200) {
                        move = BotBet.allIn(state);
                    } else {
                        move = BotBet.fold(state);
                    }

                } else {
                    move = BotBet.check(state);
                }

                break;
            case BotOpponentTracker.PlayerType.TIGHT:
                if (BotBetStratergy.opponentIsRaising(state)) {
                    switch (raiseType) {
                        case BotOpponentTracker.RaiseAmountType.ABOVE:
                        case BotOpponentTracker.RaiseAmountType.AVERAGE:
                            move = BotBet.fold(state);
                            break;

                        case BotOpponentTracker.RaiseAmountType.BELOW:
                            if (BotBetStratergy.canSeeCall(state, 15)) {
                                move = BotBet.callBet(state);
                            } else {
                                move = BotBet.fold(state);
                            }

                            break;
                        default:
                            if (BotBetStratergy.canSeeCall(state, 20)) {
                                move = BotBet.callBet(state);
                            } else {
                                move = BotBet.fold(state);
                            }
                            break;
                    }
                } else {
                    if (state.opponentTracker.canBeBuilled == BotOpponentTracker.Advice.TRY ||
                        state.opponentTracker.canBeBuilled == BotOpponentTracker.Advice.YES) {
                        move = BotBet.bluffRaise(state);
                    } else {

                        move = BotBet.check(state);
                    }
                }
                break;
            case BotOpponentTracker.PlayerType.PUSSY:
                if (BotBetStratergy.opponentIsRaising(state)) {

                    move = BotBet.fold(state);
                } else {
                    move = BotBet.minimumRaise(state);
                }
                break;
            default:
                if (state.opponentTracker.canBeBuilled == BotOpponentTracker.Advice.TRY ||
                    state.opponentTracker.canBeBuilled == BotOpponentTracker.Advice.YES) {
                    move = BotBet.bluffRaise(state);
                } else {
                    if (state.getPot() === (state.getBigBlind() * 2) && state.getTable().length === 5) {
                        move = BotBet.bluffRaise(state);
                    } else {
                        move = BotBet.check(state);
                    }
                }
                break;
        }
        return move;
    };

    BotBetStratergy.opponentIsRaising = function(state) {
        return (!!state.opponentMove && state.opponentMove.getAction() === "raise");
    };
    BotBetStratergy.canSeeCall = function(state, rounds) {
        return state.myStack > state.getAmountToCall() * rounds;
    };

    BotBetStratergy.moneyToBluff = function(state, rounds) {
        return state.myStack > state.getBigBlind() * rounds;
    };

    BotBetStratergy.log = function(string) {
        process.stderr.write(string + '\n');
    };

    exports.BotBetStratergy = BotBetStratergy;

})();
