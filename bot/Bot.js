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

//default settings
var maxTurnTime = 500;

(function () {
    'use strict';

    var Bot = function () {

        this.init()
            .bindHandlers()
            .run();
    };

    Bot.prototype.init = function() {

        this.log('node version: ' + process.version);

        this.settings = {}; //where Settings commands go
        this.match = {};  //Where Match commands go.
        this.players = { //where player stuff goes.
            player1: {},
            player2: {}
        };

        this.debugging = true;

        this.defaultMove = 'call 0';

        return this;
    };

    Bot.prototype.bindHandlers = function() {

        this.onReceiveDataHandler = this.onReceiveData.bind(this);
        Bot.prototype.player1 = this.processPlayerData.bind(this);
        Bot.prototype.player2 = this.processPlayerData.bind(this);

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

        // Log engine output
        // this.log('received: ' + JSON.stringify(engineOutput));

        lines = engineOutput.trim().split('\n');


        while (lines.length > 0) {

            line = lines.shift().trim();

            this.log('processing line: ' + line);

            lineTokens = line.split(' ');

            cmdToken = lineTokens.shift();
            lineTokens.push(cmdToken);

            //this.log('processing tokens: ' + JSON.stringify(lineTokens));

            if (this[cmdToken] !== undefined) {
                this[cmdToken].apply(this, lineTokens);
            } else {
                this.error('Bot.' + cmdToken, '');
            }
        }
    };

    Bot.prototype.run = function () {

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
        
        // Log bot output
        // this.log(cmd);

        process.stdout.write(cmd);
    };

    Bot.prototype.Settings = function(cmd, arg) {

        this.settings[cmd] = helper.toIntIfNecessary(arg);
    };

    Bot.prototype.Match = function(cmd, arg) {

        this.match[cmd] = helper.toIntIfNecessary(arg);
    };

    Bot.prototype.Action = function (botName, timeLimit) {

        var cmd;
        var thisBotName = this.settings.yourBot;

        if (botName !== thisBotName) {
            return 0;
        }

        // this.log('I have been asked to do something...');

        setTimeout(this.move.bind(this), maxTurnTime);

        cmd = this.pickBestMove();

        this.move(cmd);

    };

    Bot.prototype.pickBestMove = function() {
        
    };

    Bot.prototype.processPlayerData = function(botAction, botArg, botName) {
        //todo: make this keep a history of the different actions of a player.
        var valToSave;

        if(botAction === 'hand') {
            valToSave = botArg.substr(1, botArg.length-2).split(',');
        } else {
            valToSave = helper.toIntIfNecessary(botArg);
        }

        this.players[botName][botAction] = valToSave;

    };

    Bot.prototype.error = function(functionName, args, extraData){

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
