/**
 * Heads Up Omaha AI Game Bot
 *
 * @author Russell Dempsey
 * @version 0.1
 * @License MIT License (http://opensource.org/Licenses/MIT)
 */

//module level variables
var helper = require('../helper');
var BotBetStratergy = require('../bot/bot_bet_stratergy').BotBetStratergy;

(function() {
    'use strict';

    var BotStarter = function() {


    };

    BotStarter.prototype.getMove = function(state, timeOut) {
        state.timeBank += state.timePerMove;
        var startTime = new Date();
        var move;
        if (state.table.length === 0) {
            move = BotBetStratergy.preFlop(state, timeOut);
        } else {
            move = BotBetStratergy.postFlop(state, timeOut);
        }
        var endTime = new Date();
        state.timeBank -= (endTime - startTime);
        this.log(state.timeBank);

        return move;
    };


    BotStarter.prototype.log = function(string) {
        process.stderr.write(string + '\n');
    };






    exports.BotStarter = BotStarter;

})();
