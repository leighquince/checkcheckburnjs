/**
 * Heads Up Omaha AI Game Bot
 *
 * @author Russell Dempsey
 * @version 0.1
 * @License MIT License (http://opensource.org/Licenses/MIT)
 */

//module level variables
var bot;
var helper = require('../helper');
var HandOmaha = require('../poker/hand_omaha').HandOmaha;
var Card = require('../poker/card').Card;
var PokerMove = require('../poker/poker_move').PokerMove;


(function() {
    'use strict';




    var BotState = function(bot) {
        this.debugging = false;
        this.round = 0;
        this.smallBlind = 0;
        this.bigBlind = 0;
        this.onButton = "";
        this.myStack = 0;
        this.opponentStack = 0;
        this.pot = 0;
        this.opponentMove = "";
        this.myMove = "";
        this.currentBet = 0;
        this.hand = null;
        this.table = [];
        this.tableBitPattern = [];
        this.settings = {};
        this.myName = "";
        this.sidepots = 0;
        this.timeBank = 0;
        this.timePerMove = 0;
        this.handsPerLevel = 0;

    };

    /**
     * Parses the settings for this game
     * @param key : key of the information given
     * @param value : value to be set for the key
     */
    BotState.prototype.updateSettings = function(key, value) {
        this.settings[key] = value;
        if (key === "yourBot") {
            this.myName = value;
        } else if (key === "timeBank") { // Maximum amount of time your bot can take for one response
            this.timeBank = parseInt(value);

        } else if (key === "timePerMove") { // The extra amount of time you get per response
            this.timePerMove = parseInt(value);
        } else if (key === "handsPerLevel") { // Number of rounds before the blinds are increased
            this.handsPerLevel = parseInt(value);
        } else if (key === "startingStack") { // Starting stack for each bot
            this.myStack = parseInt(value);
            this.opponentStack = parseInt(value);
        } else {
            this.log("Unknown settings command: %s %s\n", key, value);
        }

    };

    /**
     * Parses the match information
     * @param key : key of the information given
     * @param value : value to be set for the key
     */
    BotState.prototype.updateMatch = function(key, value) {
        if (key === "round") { // Round number
            this.round = parseInt(value);
            this.log("Round %s", this.round); //printing the round to the output for debugging
            this.resetRoundVariables();
        } else if (key === "smallBlind") { // Value of the small blind
            this.smallBlind = parseInt(value);
        } else if (key === "bigBlind") { // Value of the big blind
            this.bigBlind = parseInt(value);
        } else if (key === "onButton") { // Which bot has the button, onButton is true if it's your bot
            this.onButton = (value === this.myName);
        } else if (key === "maxWinPot") { // The size of the current pot
            this.pot = parseInt(value);
        } else if (key === "amountToCall") { // The amount of the call
            this.amountToCall = parseInt(value);
        } else if (key === "table") { // The cards on the table
            this.table = this.parseCards(value);
            var that = this;
            this.table.forEach(function(card) {
                that.tableBitPattern.push(card.getBitPattern());
            });
        } else {
            this.log("Unknown match command: %s %s\n", [key, value]);
        }
    };

    /**
     * Parses the information given about stacks, blinds and moves
     * @param bot : bot that this move belongs to (either you or the opponent)
     * @param key : key of the information given
     * @param amount : value to be set for the key
     */
    BotState.prototype.updateMove = function(bot, key, amount) {
        if (bot === this.myName) {
            if (key === "stack") { // The amount in your starting stack
                this.myStack = parseInt(amount);
            } else if (key === "post") { // The amount you have to pay for the blind
                this.myStack -= parseInt(amount);
            } else if (key === "hand") { // Your cards
                var cards = this.parseCards(amount);
                this.hand = new HandOmaha(cards[0], cards[1], cards[2], cards[3]);
            } else if (key === "wins") {
                // Your winnings, not stored
            } else {
                this.myMove = new PokerMove(bot, key, amount);
            }
        } else { // assume it's the opponent
            if (key === "stack") { // The amount in your opponent's starting stack
                this.opponentStack = parseInt(amount);
            } else if (key === "post") { // The amount your opponent paid for the blind
                this.opponentStack -= parseInt(amount);
            } else if (key === "hand") {
                // Hand of the opponent on a showdown, not stored
            } else if (key === "wins") {
                // Opponent winnings, not stored
            } else { // The move your opponent did
                this.opponentMove = new PokerMove(bot, key, parseInt(amount));
            }
        }


    };

    BotState.prototype.parseCards = function(value) {
        var parts = value.slice(1, value.length - 1).split(',');

        var cards = [];

        for (var i = 0; i < parts.length; ++i) {
            cards[i] = Card.getCard(parts[i]);
        }
        return cards;
    };

    /**
     * Reset all the variables at the start of the round,
     * just to make sure we don't use old values
     */
    BotState.prototype.resetRoundVariables = function() {
        this.smallBlind = 0;
        this.bigBlind = 0;
        this.pot = 0;
        this.opponentMove = null;
        this.myMove = null;
        this.amountToCall = 0;
        this.hand = null;
        this.table = [];
        this.tableBitPattern = [];
    };

    BotState.prototype.getRound = function() {
        return this.round;
    };

    BotState.prototype.getSmallBlind = function() {
        return this.smallBlind;
    };

    BotState.prototype.getBigBlind = function() {
        return this.bigBlind;
    };

    BotState.prototype.onButton = function() {
        return this.onButton;
    };

    BotState.prototype.getmyStack = function() {
        return this.myStack;
    };

    BotState.prototype.getOpponentStack = function() {
        return this.opponentStack;
    };

    BotState.prototype.getPot = function() {
        return this.pot;
    };

    BotState.prototype.getOpponentAction = function() {
        return this.opponentMove;
    };

    BotState.prototype.getCurrentBet = function() {
        return this.currentBet;
    };

    BotState.prototype.getHand = function() {
        return this.hand;
    };

    BotState.prototype.getTable = function() {
        return this.table;
    };

    BotState.prototype.getSetting = function(key) {
        return this.settings[key];
    };

    BotState.prototype.getSidepots = function() {
        return this.sidepots;
    };

    BotState.prototype.getMyName = function() {
        return this.myName;
    };

    BotState.prototype.getAmountToCall = function() {
        return this.amountToCall;
    };

    BotState.prototype.getMaxTime = function() {
        return this.timeBank;
    };

    BotState.prototype.log = function() {
        this.debugging && console.log.apply(this, arguments);
    };



    exports.BotState = BotState;

})();
