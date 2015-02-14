var BotStarter = require("../poker_bot/bot/bot_starter").BotStarter;
var BotState = require('../poker_bot/bot/bot_state').BotState;
var BotBetStratergy = require('../poker_bot/bot/bot_bet_stratergy').BotBetStratergy;
var HandOmaha = require('../poker_bot/poker/hand_omaha').HandOmaha;
var Card = require('../poker_bot/poker/card').Card;
var HandEval = require('../poker_bot/evaluation/hand_eval').HandEval;
describe("Bot Starter", function() {
    it("should be a function", function() {
        BotStarter.should.be.a("function");
    });

    var freshBotState = function() {
        var botState = new BotState();
        botState.updateSettings("timeBank", 5000);
        botState.updateSettings("timePerMove", 500);
        botState.updateSettings("handsPerLevel", 10);
        botState.updateSettings("startingStack", 1500);
        botState.updateSettings("yourBot", "player1");
        botState.updateMatch("round", 1);
        botState.updateMatch("smallBlind", 15);
        botState.updateMatch("bigBlind", 30);
        botState.updateMatch("onButton", "player1");
        botState.updateMatch("maxWinPot", 45);
        botState.updateMatch("amountToCall", 15);
        botState.updateMove("player1", "stack", 1500);
        return botState;
    };

    describe("Bot Bet Stratergy", function() {


        it("should know when a player has rasied", function() {
            var botState = freshBotState();
            botState.updateMove("player2", "raise", 1500);
            BotBetStratergy.opponentIsRaising(botState).should.equal(true);
        });

        it("should know when a player has not rasied", function() {
            var botState = freshBotState();
            BotBetStratergy.opponentIsRaising(botState).should.equal(false);
        });


    });
});
