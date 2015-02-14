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
        if(state.table.length === 0)
        {
            return BotBetStratergy.preFlop(state, timeOut);
        }

        return BotBetStratergy.postFlop(state, timeOut);
    };

   




    exports.BotStarter = BotStarter;

})();
