/**
 * Heads Up Omaha AI Game Bot
 *
 * __main__
 * @author Russell Dempsey
 * @version 0.1
 * @License MIT License (http://opensource.org/Licenses/MIT)
 */

//module level variables
var bot;
var readline = require('readline');
var helper = require('./helper');
var Hand = require('./poker/hand').Hand;
var Card = require('./poker/card').Card;
var HandEval = require('./evaluation/hand_eval').HandEval;
var BotState = require('./bot/bot_state').BotState;
var BotStarter = require('./bot/bot_starter').BotStarter;

//default settings
var maxTurnTime = 500;

(function() {
    'use strict';

    var Bot = function() {

        this.init()
            .bindHandlers()
            .run();
    };

    Bot.prototype.init = function() {
        this.botState = new BotState();
        this.botStarter = new BotStarter();
        //console.log('node version: ' + process.version);
        this.debugging = false;
        this.defaultMove = 'call 0';
        return this;
    };

    Bot.prototype.bindHandlers = function() {
        this.onReceiveDataHandler = this.onReceiveData.bind(this);
        return this;
    };

    Bot.prototype.onReceiveData = function(engineOutput) {
        var lines;
        var line;
        var lineTokens;
        var cmdToken;

        if (engineOutput === '') {
            return 1;
        }

        lines = engineOutput.trim().split('\n');

        while (lines.length > 0) {

            line = lines.shift().trim();

            this.log('processing line: ' + line);

            lineTokens = line.split(' ');
            
            if (line.length === 0) {
                continue;
            }

            if (lineTokens.length == 3 && lineTokens[0] === "Action") {
                var move = this.botStarter.getMove(this.botState, parseInt(lineTokens[2]));
                this.move(move.toString());
            } else if (lineTokens.length == 3 && lineTokens[0] === "Settings") { // Update the state with settings info
                this.botState.updateSettings(lineTokens[1], lineTokens[2]);
            } else if (lineTokens.length == 3 && lineTokens[0] === "Match") { // Update the state with match info
                this.botState.updateMatch(lineTokens[1], lineTokens[2]);
            } else if (lineTokens.length == 3 && lineTokens[0].indexOf("player") > -1) { // Update the state with info about the moves
                this.botState.updateMove(lineTokens[0], lineTokens[1], lineTokens[2]);
            } else {
                this.log("Unable to parse line %s \n", line);
            }
        }
    };

    Bot.prototype.run = function() {

        var io = readline.createInterface(process.stdin, process.stdout);

        io.on('line', this.onReceiveDataHandler);

        return this;
    };

    Bot.prototype.getDefaultMove = function() {
        return this.defaultMove;
    };


    Bot.prototype.move = function(cmd) {
        if (cmd === undefined) {
            cmd = this.getDefaultMove();
        }
        this._write(cmd + '\n');
    };

    Bot.prototype._write = function(cmd) {
        process.stdout.write(cmd);
    };


    Bot.prototype.error = function(functionName, args, extraData) {

        var argString = args;
        if (args.join) {
            args.join(',');
        }

        this.log('Error processing ' + functionName.toString() + '(' + JSON.stringify(argString) + ')');

        if (extraData !== undefined) {
            this.log(extraData.toString());
        }
    };

    Bot.prototype.log = function(string) {

        if (!this.debugging) {
            return false;
        }

        process.stderr.write(string + '\n');
    };

    bot = new Bot();
    exports.Bot = Bot;

})();
