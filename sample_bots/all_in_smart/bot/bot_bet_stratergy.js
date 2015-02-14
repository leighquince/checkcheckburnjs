var helper = require('../helper');
var PokerMove = require('../poker/poker_move').PokerMove;
var HandEval = require('../evaluation/hand_eval').HandEval;
var HandStrength = require('../poker/hand_strength').HandStrength;

(function() {
    'use strict';

    var BotBetStratergy = function() {

    };


    BotBetStratergy.preFlop = function(state, timeout) {
        if (state.opponentMove && state.opponentMove.getAction() === "raise" && state.myMove) {
            return new PokerMove(state.getMyName(), "fold", 0);
        }
        return new PokerMove(state.getMyName(), "raise", state.getPot());
    };

    BotBetStratergy.postFlop = function(state, timeout) {
        if (state.opponentMove && state.opponentMove.getAction() === "raise" && state.myMove) {
            return new PokerMove(state.getMyName(), "fold", 0);
        }
        return new PokerMove(state.getMyName(), "raise", state.getPot());
    };

    BotBetStratergy.log = function(string) {
        process.stderr.write(string + '\n');
    };

    exports.BotBetStratergy = BotBetStratergy;

})();
