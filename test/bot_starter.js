var BotStarter = require("../poker_bot/bot/bot_starter").BotStarter;
var BotState = require('../poker_bot/bot/bot_state').BotState;
var HandOmaha = require('../poker_bot/poker/hand_omaha').HandOmaha;
var Card = require('../poker_bot/poker/card').Card;
var HandEval = require('../poker_bot/evaluation/hand_eval').HandEval;
describe("Bot Starter", function() {
    it("should be a function", function() {
        BotStarter.should.be.a("function");
    });
    //TODO redo when pre flop staregy is on place
    // describe("get move", function() {
    //     var botStarter = new BotStarter();
    //     var botState = new BotState();
    //     botState.updateSettings("timeBank", 5000);
    //     botState.updateSettings("timePerMove", 500);
    //     botState.updateSettings("handsPerLevel", 10);
    //     botState.updateSettings("startingStack", 1500);
    //     botState.updateSettings("yourBot", "player1");
    //     botState.updateMatch("round", 1);
    //     botState.updateMatch("smallBlind", 15);
    //     botState.updateMatch("bigBlind", 30);
    //     botState.updateMatch("onButton", "player1");
    //     botState.updateMatch("maxWinPot", 45);
    //     botState.updateMatch("amountToCall", 15);
    //     botState.updateMove("player1", "stack", 1500);

    //     it("should raise when average card is >= 9", function() {
    //         botState.updateMove("player1", "hand", '[Jd,As,Ad,Th]');

    //         var pokerMove = botStarter.getMove(botState, botState.timePerMove);
    //         this.timeout(botState.timePerMove);

    //         pokerMove.getPlayer().should.equal("player1");
    //         pokerMove.getAction().should.equal("raise");
    //         pokerMove.getAmount().should.equal(60);


    //     });

    //     it("should call when average card is >= 5 ", function() {
    //         botState.updateMove("player1", "hand", '[4d,Ks,Ad,Th]');

    //         var pokerMove = botStarter.getMove(botState, botState.timePerMove);
    //         this.timeout(botState.timePerMove);

    //         pokerMove.getPlayer().should.equal("player1");
    //         pokerMove.getAction().should.equal("call");
    //         pokerMove.getAmount().should.equal(15);


    //     });

    //     it("should check when average card is < 5 ", function() {
    //         botState.updateMove("player1", "hand", '[2d,3s,Ad,4h]');

    //         var pokerMove = botStarter.getMove(botState, botState.timePerMove);
    //         this.timeout(botState.timePerMove);

    //         pokerMove.getPlayer().should.equal("player1");
    //         pokerMove.getAction().should.equal("check");
    //         pokerMove.getAmount().should.equal(0);


    //     });
    // });
});
