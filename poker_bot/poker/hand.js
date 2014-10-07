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

    var Hand = function() {
        this.cards = [];
        this.bitPattern = [];
    };

    /**
     * Returns a specific card of this hand
     */
    Hand.prototype.getCard = function(index) {
        if (index >= 0 && index < this.cards.length)
            return this.cards[index];
        else
            return null;
    };

    /**
     * Returns the number of cards in the hand/
     */
    Hand.prototype.getNumberOfCards = function() {
        return this.cards.length;
    };

    /**
     * Returns an array of the four hand cards
     */
    Hand.prototype.getCards = function() {
        return this.cards;
    };

    Hand.prototype.getBitPattern = function()
    {
       return this.bitPattern;
    };

    /**
     * Returns a string representation of the hand
     */
    Hand.prototype.toString = function() {
        var str = "[";
        for (var i = 0; i < this.cards.length - 1; i++)
            str += this.cards[i].toString() + ",";

        str += this.cards[this.cards.length - 1].toString() + "]";
        return str;
    };

    Hand.prototype.log = function(string) {
        process.stderr.write(string + '\n');
    };

    exports.Hand = Hand;


})();
