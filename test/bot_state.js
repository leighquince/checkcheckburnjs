describe('Bot State', function() {

    var BotState = require('../poker_bot/bot/bot_state').BotState;
    var Card = require('../poker_bot/poker/card').Card;
    var HandOmaha = require('../poker_bot/poker/hand_omaha').HandOmaha;
    var PokerMove = require('../poker_bot/poker/poker_move').PokerMove;

    it('should be a function', function() {
        BotState.should.be.a('function');
    });

    it('should be an instance of a BotState', function() {
        var botState = new BotState();
        botState.should.be.an.instanceof(BotState);
    });

    it('should be be able to update settings', function() {
        var botState = new BotState();
        botState.updateSettings("timeBank", 5000);
        botState.updateSettings("timePerMove", 500);
        botState.updateSettings("handsPerLevel", 10);
        botState.updateSettings("startingStack", 1500);
        botState.updateSettings("yourBot", "player1");


        botState.timeBank.should.equal(5000);
        botState.timePerMove.should.equal(500);
        botState.handsPerLevel.should.equal(10);
        botState.myStack.should.equal(1500);
        botState.opponentStack.should.equal(1500);
        botState.myName.should.equal("player1");

    });



    it('should be be able to update match', function() {
        var botState = new BotState();
        botState.updateSettings("yourBot", "player1");

        botState.updateMatch("round", 1);
        botState.updateMatch("smallBlind", 15);
        botState.updateMatch("bigBlind", 30);
        botState.updateMatch("onButton", "player1");
        botState.updateMatch("maxWinPot", 45);
        botState.updateMatch("amountToCall", 15);
        botState.updateMatch("table", "[7s,Js,3h]");


        botState.round.should.equal(1);
        botState.smallBlind.should.equal(15);
        botState.bigBlind.should.equal(30);
        botState.onButton.should.equal(true);
        botState.pot.should.equal(45);
        botState.amountToCall.should.equal(15);
        botState.table.should.eql([
            Card.getCard('7s'),
            Card.getCard('Js'),
            Card.getCard('3h')
        ]);

    });

    it('should be be able to reset match', function() {
        var botState = new BotState();
        botState.updateSettings("yourBot", "player1");

        botState.updateMatch("round", 1);
        botState.updateMatch("smallBlind", 15);
        botState.updateMatch("bigBlind", 30);
        botState.updateMatch("onButton", "player1");
        botState.updateMatch("maxWinPot", 45);
        botState.updateMatch("amountToCall", 15);
        botState.updateMatch("table", "[7s,Js,3h]");


        botState.round.should.equal(1);
        botState.smallBlind.should.equal(15);
        botState.bigBlind.should.equal(30);
        botState.onButton.should.equal(true);
        botState.pot.should.equal(45);
        botState.amountToCall.should.equal(15);
        botState.table.should.eql([
            Card.getCard('7s'),
            Card.getCard('Js'),
            Card.getCard('3h')
        ]);

        botState.updateMatch("round", 2);
        botState.round.should.equal(2);
        botState.smallBlind.should.equal(0);
        botState.bigBlind.should.equal(0);
        botState.pot.should.equal(0);
        botState.amountToCall.should.equal(0);
        botState.table.should.be.empty;

    });

    it('should be be able to update move', function() {
        var botState = new BotState();
        botState.updateSettings("yourBot", "player1");

        botState.updateMove("player1", "stack", 1500);
        botState.myStack.should.equal(1500);
        botState.updateMove("player1", "post", 300);
        botState.myStack.should.equal(1200);
        botState.updateMove("player1", "hand", '[2d,Ts,8s,7h]');
        botState.updateMove("player1", "wins", 300);
        botState.updateMove("player2", "stack", 1500);
        botState.opponentStack.should.equal(1500);

        botState.updateMove("player2", "post", 20);
        botState.opponentStack.should.equal(1480);
        botState.updateMove("player2", "raise", 20);
        botState.opponentMove.should.be.an.instanceof(PokerMove);

        botState.hand.should.be.an.instanceof(HandOmaha);
        botState.hand.getCard(0).should.equal(Card.getCard('2d'));
        botState.hand.getCard(1).should.equal(Card.getCard('Ts'));
        botState.hand.getCard(2).should.equal(Card.getCard('8s'));
        botState.hand.getCard(3).should.equal(Card.getCard('7h'));

    });

});
