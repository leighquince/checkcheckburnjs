var PokerMove = require('../poker/poker_move').PokerMove;

(function() {


    var RAISE = "raise",
        CALL = "call",
        CHECK = "check",
        FOLD = "fold";

    var BotBet = function() {

    };

    BotBet.log = function(string) {
        process.stderr.write(string + '\n');
    };


    BotBet.allIn = function(state) {
        return new PokerMove(state.getMyName(), RAISE, state.getPot());
    };

    BotBet.check = function(state) {
        return new PokerMove(state.getMyName(), CHECK, 0);
    };

    BotBet.confusingRaise = function(state) {
        return new PokerMove(state.getMyName(), RAISE, state.getPot() - 8);
    };
    BotBet.randomRaise = function(state) {
        return new PokerMove(state.getMyName(), RAISE, state.getBigBlind() + Math.floor(Math.random() * (state.getPot() - state.getBigBlind())));
    };

    BotBet.boldRaise = function(state) {
        return new PokerMove(state.getMyName(), RAISE, state.getBigBlind() * 3);
    };

    BotBet.bluffRaise = function(state) {
        return new PokerMove(state.getMyName(), RAISE, state.getBigBlind() + 2);
    };

    BotBet.minimumRaise = function(state) {
        return new PokerMove(state.getMyName(), RAISE, state.getBigBlind());
    };

    BotBet.callBet = function(state) {
        return new PokerMove(state.getMyName(), CALL, state.getAmountToCall());
    };

    BotBet.fold = function(state) {
        return new PokerMove(state.getMyName(), FOLD, 0);
    };

    exports.BotBet = BotBet;

})();
