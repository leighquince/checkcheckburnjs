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

var helper = require('../helper'),
    Hand = require('./hand').Hand;

(function() {
    'use strict';
    var HandOmaha = function(firstCard, secondCard, thirdCard, fourthCard) {
        this.cards = new Array(4);
        this.cards[0] = firstCard;
        this.cards[1] = secondCard;
        this.cards[2] = thirdCard;
        this.cards[3] = fourthCard;

        if (firstCard) {
            this.bitPattern = new Array(4);
            this.bitPattern[0] = firstCard.getBitPattern();
            this.bitPattern[1] = secondCard.getBitPattern();
            this.bitPattern[2] = thirdCard.getBitPattern();
            this.bitPattern[3] = fourthCard.getBitPattern();
        }
    };

    HandOmaha.prototype = new Hand();
    HandOmaha.prototype.constructor = HandOmaha;



    exports.HandOmaha = HandOmaha;


})();
