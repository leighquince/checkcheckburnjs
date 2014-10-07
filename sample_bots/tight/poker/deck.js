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

var Card = require('./card').Card;
var _ = require('../vendor/underscore')._;

(function() {
    'use strict';
    var Deck = function(hand, table) {
        Card.initCards();
        this.deck = [];
        this.deckBitPattern = [];
        this.generateDeck(hand, table);

    };

    Deck.prototype.generateDeck = function(hand, table) {
        var tableCards = table || [];
        var handCards = hand || [];
        var freshDeck = Card.numberToCard;
        var tracker = 0;
        var possibleDeck = [];
        var possibleDeckBitPattern = [];
        var takenCards = [];
        if (!table && !hand) {
            this.deck = freshDeck;
            return;
        }

        _.forEach(handCards, function(card) {
            takenCards.push(card.getNumber());
        });
        _.forEach(tableCards, function(card) {
            takenCards.push(card.getNumber());
        });

        for (var i = 0; i < freshDeck.length; i++) {
            if (!_.contains(takenCards, freshDeck[i].getNumber())) {
                possibleDeck.push(freshDeck[i]);
                possibleDeckBitPattern.push(freshDeck[i].getBitPattern());
            }
        }


        this.deck = possibleDeck;
        this.deckBitPattern = possibleDeckBitPattern;
    };


    //+ Jonas Raoni Soares Silva
    //@ http://jsfromhell.com/array/shuffle [v1.0]
    Deck.prototype.shuffle = function() { //v1.0
        for (var j, x, i = this.deckBitPattern.length; i; j = Math.floor(Math.random() * i), x = this.deckBitPattern[--i], this.deckBitPattern[i] = this.deckBitPattern[j], this.deckBitPattern[j] = x);
      
    };


    Deck.prototype.getDeck = function() {
        return this.deck;
    };

    Deck.prototype.getDeckBitPattern = function() {
        return this.deckBitPattern;
    };


    exports.Deck = Deck;


})();
