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

var helper = require('../helper');

(function() {
    'use strict';

    var CardSuit = new helper.Enum(
        'SPADES',
        'HEARTS',
        'CLUBS',
        'DIAMONDS');



    exports.CardSuit = CardSuit;


})();
