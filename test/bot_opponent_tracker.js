describe('Bot Opponent Tracker', function() {

    var BotState = require('../poker_bot/bot/bot_state').BotState;
    var Card = require('../poker_bot/poker/card').Card;
    var HandOmaha = require('../poker_bot/poker/hand_omaha').HandOmaha;
    var PokerMove = require('../poker_bot/poker/poker_move').PokerMove;
    var BotOpponentTracker = require('../poker_bot/bot/bot_opponent_tracker').BotOpponentTracker;

    var freshState = function() {
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
        botState.updateMatch("maxWinPot", 60);
        botState.updateMatch("amountToCall", 15);
        botState.updateMove("player1", "hand", '[2d,Ts,8s,7h]');
        return botState;
    };


    it('Bot Opponent Tracker should be a function', function() {
        BotOpponentTracker.should.be.a('function');
    });

    it('bost states Bot Opponent Tracker should be an instance of BotOpponentTracker', function() {
        var botState = freshState();

        botState.opponentTracker.should.be.an.instanceof(BotOpponentTracker);
    });

    it('Bot Opponent Tracker should increase losses', function() {
        var botState = freshState();
        botState.opponentTracker.increaseLosses();
        botState.opponentTracker.handsLost.should.equal(1);
    });

    it('Bot Opponent Tracker should increase losses', function() {
        var botState = freshState();
        botState.opponentTracker.increaseWins();
        botState.opponentTracker.handsWon.should.equal(1);
    });

    it('Bot Opponent Tracker should tracker overall stats', function() {
        var botState = freshState();
        botState.updateMove("player2", "check", 0);
        botState.updateMove("player2", "fold", 0);
        botState.updateMove("player2", "raise", 0);
        botState.updateMove("player2", "call", 0);

        botState.opponentTracker.overall.checks.should.equal(1);
        botState.opponentTracker.overall.folds.should.equal(1);
        botState.opponentTracker.overall.raises.should.equal(1);
        botState.opponentTracker.overall.calls.should.equal(1);
        botState.opponentTracker.overall.actions.should.equal(4);

    });


    it('Bot Opponent Tracker should tracker preflop stats', function() {
        var botState = freshState();
        botState.updateMove("player2", "check", 0);
        botState.updateMove("player2", "fold", 0);
        botState.updateMove("player2", "raise", 0);
        botState.updateMove("player2", "call", 0);

        botState.opponentTracker.preFlop.checks.should.equal(1);
        botState.opponentTracker.preFlop.folds.should.equal(1);
        botState.opponentTracker.preFlop.raises.should.equal(1);
        botState.opponentTracker.preFlop.calls.should.equal(1);
        botState.opponentTracker.preFlop.actions.should.equal(4);
    });

    it('Bot Opponent Tracker should track flop stats', function() {
        var botState = freshState();
        botState.updateMatch("table", "[7s,Js,3h]");

        botState.updateMove("player2", "check", 0);
        botState.updateMove("player2", "fold", 0);
        botState.updateMove("player2", "raise", 0);
        botState.updateMove("player2", "call", 0);

        botState.opponentTracker.flop.checks.should.equal(1);
        botState.opponentTracker.flop.folds.should.equal(1);
        botState.opponentTracker.flop.raises.should.equal(1);
        botState.opponentTracker.flop.calls.should.equal(1);
        botState.opponentTracker.flop.actions.should.equal(4);
    });

    it('Bot Opponent Tracker should track turn stats', function() {
        var botState = freshState();
        botState.updateMatch("table", "[7s,Js,3h,5h]");

        botState.updateMove("player2", "check", 0);
        botState.updateMove("player2", "fold", 0);
        botState.updateMove("player2", "raise", 0);
        botState.updateMove("player2", "call", 0);

        botState.opponentTracker.turn.checks.should.equal(1);
        botState.opponentTracker.turn.folds.should.equal(1);
        botState.opponentTracker.turn.raises.should.equal(1);
        botState.opponentTracker.turn.calls.should.equal(1);
        botState.opponentTracker.turn.actions.should.equal(4);

    });

    it('Bot Opponent Tracker should track river stats', function() {
        var botState = freshState();
        botState.updateMatch("table", "[7s,Js,3h,5h,6h]");

        botState.updateMove("player2", "check", 0);
        botState.updateMove("player2", "fold", 0);
        botState.updateMove("player2", "raise", 0);
        botState.updateMove("player2", "call", 0);

        botState.opponentTracker.river.checks.should.equal(1);
        botState.opponentTracker.river.folds.should.equal(1);
        botState.opponentTracker.river.raises.should.equal(1);
        botState.opponentTracker.river.calls.should.equal(1);
        botState.opponentTracker.river.actions.should.equal(4);

    });

    it('Bot Opponent Tracker should track reaction stats: callCheck', function() {
        var botState = freshState();
        botState.updateMatch("table", "[7s,Js,3h,5h,6h]");


        botState.myMove = new PokerMove("player1", "call", 200);
        botState.updateMove("player2", "check", 0);
        botState.opponentTracker.overall.callCheck.should.equal(1);

    });

    it('Bot Opponent Tracker should track reaction stats: callRaise', function() {
        var botState = freshState();
        botState.updateMatch("table", "[7s,Js,3h,5h,6h]");


        botState.myMove = new PokerMove("player1", "call", 200);
        botState.updateMove("player2", "raise", 2000);
        botState.opponentTracker.overall.callRaise.should.equal(1);

    });

    it('Bot Opponent Tracker should track reaction stats: checkRaise', function() {
        var botState = freshState();
        botState.updateMatch("table", "[7s,Js,3h,5h,6h]");


        botState.myMove = new PokerMove("player1", "check", 0);
        botState.updateMove("player2", "raise", 2000);
        botState.opponentTracker.overall.checkRaise.should.equal(1);

    });
    it('Bot Opponent Tracker should track reaction stats: checkCheck', function() {
        var botState = freshState();
        botState.updateMatch("table", "[7s,Js,3h,5h,6h]");


        botState.myMove = new PokerMove("player1", "check", 0);
        botState.updateMove("player2", "check", 0);
        botState.opponentTracker.overall.checkCheck.should.equal(1);

    });

    it('Bot Opponent Tracker should track reaction stats: raiseCall', function() {
        var botState = freshState();
        botState.updateMatch("table", "[7s,Js,3h,5h,6h]");


        botState.myMove = new PokerMove("player1", "raise", 100);
        botState.updateMove("player2", "call", 100);
        botState.opponentTracker.overall.raiseCall.should.equal(1);

    });

    it('Bot Opponent Tracker should track reaction stats: raiseFold', function() {
        var botState = freshState();
        botState.updateMatch("table", "[7s,Js,3h,5h,6h]");


        botState.myMove = new PokerMove("player1", "raise", 100);
        botState.updateMove("player2", "fold", 100);
        botState.opponentTracker.overall.raiseFold.should.equal(1);

    });

    it('Bot Opponent Tracker should track reaction stats: raiseRaise', function() {
        var botState = freshState();
        botState.updateMatch("table", "[7s,Js,3h,5h,6h]");


        botState.myMove = new PokerMove("player1", "raise", 100);
        botState.updateMove("player2", "raise", 100);
        botState.opponentTracker.overall.raiseRaise.should.equal(1);

    });

    it('Bot Opponent Tracker should track pure raise stats', function() {
        var botState = freshState();
        botState.updateMatch("table", "[7s,Js,3h,5h,6h]");


        botState.updateMove("player2", "raise", 30);
        botState.opponentTracker.overall.pureRaiseAmounts.should.eql([30]);

    });

    it('Bot Opponent Tracker should track raise of blind raise stats', function() {
        var botState = freshState();
        botState.updateMatch("table", "[7s,Js,3h,5h,6h]");


        botState.updateMove("player2", "raise", 30);
        botState.opponentTracker.overall.raiseOfBlind.should.eql([1]);

    });

    it('Bot Opponent Tracker should track raise of max raise stats', function() {
        var botState = freshState();
        botState.updateMatch("table", "[7s,Js,3h,5h,6h]");


        botState.updateMove("player2", "raise", 60);
        botState.opponentTracker.overall.raiseOfMaxRaise.should.eql([1]);

    });

    it('Bot Opponent Tracker not identify a player before 5 moves have been played', function() {
        var botState = freshState();
        botState.updateMatch("table", "[7s,Js,3h,5h,6h]");


        botState.updateMove("player2", "raise", 60);
        botState.updateMove("player2", "raise", 60);

        botState.updateMove("player2", "raise", 60);
        botState.updateMove("player2", "raise", 60);
        botState.opponentTracker.overall.playerType.should.equal(BotOpponentTracker.PlayerType.UNKNOWN);

    });
    it('Bot Opponent Tracker should identify a player who always raises as ALL_IN_BOT', function() {
        var botState = freshState();
        botState.updateMatch("table", "[7s,Js,3h,5h,6h]");


        botState.updateMove("player2", "raise", 60);
        botState.updateMove("player2", "raise", 60);

        botState.updateMove("player2", "raise", 60);
        botState.updateMove("player2", "raise", 60);
        botState.updateMove("player2", "raise", 60);
        botState.updateMove("player2", "raise", 60);
        botState.opponentTracker.overall.playerType.should.equal(BotOpponentTracker.PlayerType.ALL_IN_BOT);

    });

    it('Bot Opponent Tracker should identify a player who always raises as AGRESSIVE', function() {
        var botState = freshState();
        botState.updateMatch("table", "[7s,Js,3h,5h,6h]");


        botState.updateMove("player2", "call", 60);
        botState.updateMove("player2", "check", 60);

        botState.updateMove("player2", "check", 60);
        botState.updateMove("player2", "check", 60);
        botState.updateMove("player2", "raise", 60);
        botState.updateMove("player2", "raise", 60);
        botState.updateMove("player2", "raise", 60);
        botState.updateMove("player2", "raise", 60);
        botState.updateMove("player2", "raise", 60);
        botState.updateMove("player2", "raise", 60);
        botState.opponentTracker.overall.playerType.should.equal(BotOpponentTracker.PlayerType.AGRESSIVE);

    });

    it('Bot Opponent Tracker should identify a player who always folds as PUSSY', function() {
        var botState = freshState();
        botState.updateMatch("table", "[7s,Js,3h,5h,6h]");


        botState.updateMove("player2", "call", 60);
        botState.updateMove("player2", "check", 60);

        botState.updateMove("player2", "fold", 60);
        botState.updateMove("player2", "fold", 60);
        botState.updateMove("player2", "fold", 60);
        botState.updateMove("player2", "fold", 60);
        botState.updateMove("player2", "fold", 60);
        botState.updateMove("player2", "fold", 60);
        botState.updateMove("player2", "fold", 60);
        botState.updateMove("player2", "fold", 60);
        botState.opponentTracker.overall.playerType.should.equal(BotOpponentTracker.PlayerType.PUSSY);

    });

    it('Bot Opponent Tracker should identify a player who is TIGHT', function() {
        var botState = freshState();
        botState.updateMatch("table", "[7s,Js,3h,5h,6h]");


        botState.updateMove("player2", "call", 60);
        botState.updateMove("player2", "call", 60);
        botState.updateMove("player2", "fold", 60);
        botState.updateMove("player2", "fold", 60);
        botState.updateMove("player2", "check", 60);
        botState.updateMove("player2", "check", 60);
        botState.updateMove("player2", "raise", 60);
        botState.updateMove("player2", "raise", 60);
        botState.updateMove("player2", "call", 60);
        botState.updateMove("player2", "raise", 60);

        botState.opponentTracker.overall.playerType.should.equal(BotOpponentTracker.PlayerType.TIGHT);

    });

    it('Bot Opponent Tracker should identify last raise AMOUNT as ABOVE', function() {
        var botState = freshState();
        botState.updateMatch("table", "[7s,Js,3h,5h,6h]");


        botState.updateMove("player2", "raise", 50);
        botState.updateMove("player2", "raise", 50);
        botState.updateMove("player2", "raise", 50);
        botState.updateMove("player2", "raise", 50);
        botState.updateMove("player2", "raise", 50);
        botState.updateMove("player2", "raise", 60);

        botState.opponentTracker.lastRaiseAmountType().should.equal(BotOpponentTracker.RaiseAmountType.ABOVE);

    });

    it('Bot Opponent Tracker should identify last raise AMOUNT as BELOW', function() {
        var botState = freshState();
        botState.updateMatch("table", "[7s,Js,3h,5h,6h]");


        botState.updateMove("player2", "raise", 50);
        botState.updateMove("player2", "raise", 50);
        botState.updateMove("player2", "raise", 50);
        botState.updateMove("player2", "raise", 50);
        botState.updateMove("player2", "raise", 50);
        botState.updateMove("player2", "raise", 30);

        botState.opponentTracker.lastRaiseAmountType().should.equal(BotOpponentTracker.RaiseAmountType.BELOW);

    });

    it('Bot Opponent Tracker should identify last raise AMOUNT as AVERAGE', function() {
        var botState = freshState();
        botState.updateMatch("table", "[7s,Js,3h,5h,6h]");


        botState.updateMove("player2", "raise", 50);
        botState.updateMove("player2", "raise", 50);
        botState.updateMove("player2", "raise", 50);
        botState.updateMove("player2", "raise", 50);
        botState.updateMove("player2", "raise", 50);
        botState.updateMove("player2", "raise", 51);

        botState.opponentTracker.lastRaiseAmountType().should.equal(BotOpponentTracker.RaiseAmountType.AVERAGE);

    });

    it('Bot Opponent Tracker should identify last raise AMOUNT as UNKNOWN', function() {
        var botState = freshState();
        botState.updateMatch("table", "[7s,Js,3h,5h,6h]");


        botState.updateMove("player2", "raise", 50);
        botState.updateMove("player2", "raise", 50);
        botState.updateMove("player2", "raise", 50);


        botState.opponentTracker.lastRaiseAmountType().should.equal(BotOpponentTracker.RaiseAmountType.UNKNOWN);

    });

});
