/**
 * www.TheAIGames.com
 * Heads Up Omaha pokerbot
 *
 * Last update: May 07, 2014
 *
 * @author Jim van Eeden, Starapple
 * @version 1.0
 * @License MIT License (http://opensource.org/Licenses/MIT)
 *
 * converted from Java Starter to Js starter bot by Leigh Quince
 */



(function() {
    'use strict';

    var PokerMove = function(botName, act, amt) {
        this.player = botName;
        this.action = act;
        this.amount = amt;
    };

    PokerMove.prototype.getPlayer = function() {
        return this.player;
    };

    PokerMove.prototype.getAction = function() {
        return this.action;
    };

    PokerMove.prototype.getAmount = function() {
        return this.amount;
    };

    /**
     * Returns a string representation of the move as a sentence of two words, being the action
     * string and the action amount. Returning the player name to the engine is not needed
     */
    PokerMove.prototype.toString = function() {
        return this.action+" "+this.amount;
    };

    PokerMove.prototype.log = function(string) {
        process.stderr.write(string + '\n');
    };

    exports.PokerMove = PokerMove;


})();
