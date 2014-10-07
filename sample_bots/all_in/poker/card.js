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
    CardHeight = require('./card_height').CardHeight,
    CardSuit = require('./card_suit').CardSuit;

(function() {
    'use strict';
    /**
     * Creates a card object based on a number between 0 and 51
     */
    var Card = function(num) {
        this.debugging = false;
        this.number = num;
        var findSuit = ~~ (this.number / 13);
        switch (findSuit) {
            case 0:
                this.suit = CardSuit.SPADES;
                this.suitBit = "0001";
                break;
            case 1:
                this.suit = CardSuit.HEARTS;
                this.suitBit = "0010";
                break;
            case 2:
                this.suit = CardSuit.CLUBS;
                this.suitBit = "1000";
                break;
            default:
                this.suit = CardSuit.DIAMONDS;
                this.suitBit = "0100";
        }

        var findHeight = this.number % 13;
        switch (findHeight) {
            case 0:
                this.height = CardHeight.DEUCE;
                this.heightBit = "0000";
                this.primeBit = "00000010";
                this.rankBit = "0000000000000001";
                break;
            case 1:
                this.height = CardHeight.THREE;
                this.heightBit = "0001";
                this.primeBit = "00000011";
                this.rankBit = "0000000000000010";
                break;
            case 2:
                this.height = CardHeight.FOUR;
                this.heightBit = "0010";
                this.primeBit = "00000101";
                this.rankBit = "0000000000000100";
                break;
            case 3:
                this.height = CardHeight.FIVE;
                this.heightBit = "0011";
                this.primeBit = "00000111";
                this.rankBit = "0000000000001000";
                break;
            case 4:
                this.height = CardHeight.SIX;
                this.heightBit = "0100";
                this.primeBit = "00001011";
                this.rankBit = "0000000000010000";
                break;
            case 5:
                this.height = CardHeight.SEVEN;
                this.heightBit = "0101";
                this.primeBit = "00001101";
                this.rankBit = "0000000000100000";
                break;
            case 6:
                this.height = CardHeight.EIGHT;
                this.heightBit = "0110";
                this.primeBit = "00010001";
                this.rankBit = "0000000001000000";
                break;
            case 7:
                this.height = CardHeight.NINE;
                this.heightBit = "0111";
                this.primeBit = "00010011";
                this.rankBit = "0000000010000000";
                break;
            case 8:
                this.height = CardHeight.TEN;
                this.heightBit = "1000";
                this.primeBit = "00010111";
                this.rankBit = "0000000100000000";
                break;
            case 9:
                this.height = CardHeight.JACK;
                this.heightBit = "1001";
                this.primeBit = "00011101";
                this.rankBit = "0000001000000000";    
                break;
            case 10:
                this.height = CardHeight.QUEEN;
                this.heightBit = "1010";
                this.primeBit = "00011111";
                this.rankBit = "0000010000000000";

                break;
            case 11:
                this.height = CardHeight.KING;
                this.primeBit = "00100101";
                this.heightBit = "1011";
                this.rankBit = "0000100000000000";

                break;
            default:
                this.height = CardHeight.ACE;
                this.heightBit = "1100";
                this.primeBit = "00101001";
                this.rankBit = "0001000000000000";
        }

        this.bitPattern = this.rankBit+this.suitBit+this.heightBit+this.primeBit;


    };

    Card.stringToCard = null;
    Card.numberToCard = [];

    /**
     * Returns the Card object that corresponds with the given card string. The first time this method is called, a
     * map of all Cards corresponding with correct input strings is created.
     * @param string : the string to be converted to a Card
     */

    Card.getCard = function(string) {

        if (Card.stringToCard === null) {
            Card.stringToCard = {};
            for (var i = 0; i < 52; ++i) {
                var card = new Card(i);
                Card.stringToCard[card.toString()] = card;
                Card.numberToCard[i] = card;
            }
        }
        return Card.stringToCard[string];
    };

    Card.initCards = function() {
        if (Card.stringToCard === null) {
            Card.stringToCard = {};
            for (var i = 0; i < 52; ++i) {
                var card = new Card(i);
                Card.stringToCard[card.toString()] = card;
                Card.numberToCard[i] = card;
            }
        }
    };


    Card.prototype.getBitPattern = function(){
        return parseInt(this.bitPattern,2);
    };

    Card.prototype.getSuitBit = function(){
        return parseInt(this.suitBit,2);
    };

    /**
     * Returns the number of the card.
     */
    Card.prototype.getNumber = function() {
        // var suitShift = ~~(number / 13);
        // console.log(number);
        // var heightShift = number % 13;
        // return (1 << (16 * suitShift + heightShift));
        return this.number;
    };

    /**
     * Returns the height of this card.
     */
    Card.prototype.getHeight = function() {
        return this.height;
    };

    /**
     * Returns the suit of this card.
     */
    Card.prototype.getSuit = function() {
        return this.suit;
    };

    /**
     * Returns a String representation of this card.
     */
    Card.prototype.toString = function() {
        var str = null;
        var findHeight = this.number % 13;
        switch (findHeight) {
            case 0:
                str = "2";
                break;
            case 1:
                str = "3";
                break;
            case 2:
                str = "4";
                break;
            case 3:
                str = "5";
                break;
            case 4:
                str = "6";
                break;
            case 5:
                str = "7";
                break;
            case 6:
                str = "8";
                break;
            case 7:
                str = "9";
                break;
            case 8:
                str = "T";
                break;
            case 9:
                str = "J";
                break;
            case 10:
                str = "Q";
                break;
            case 11:
                str = "K";
                break;
            case 12:
                str = "A";
        }
        var findSuit = ~~ (this.number / 13);
        switch (findSuit) {
            case 0:
                str += "s";
                break;
            case 1:
                str += "h";
                break;
            case 2:
                str += "c";
                break;
            default:
                str += "d";
        }

        return str;
    };

    Card.prototype.log = function(string) {
        this.debugging && console.log.apply(this, arguments);
    };
    //var card = new Card();
    exports.Card = Card;


})();
