 var BotState = require('../poker_bot/bot/bot_state').BotState;
 var PokerMove = require('../poker_bot/poker/poker_move').PokerMove;
 var BotBet = require('../poker_bot/bot/bot_bet').BotBet;

 describe('Bot Bet', function() {
     var botState = new BotState();
     botState.updateSettings("yourBot", "player1");

     botState.updateMatch("round", 1);
     botState.updateMatch("smallBlind", 15);
     botState.updateMatch("bigBlind", 30);
     botState.updateMatch("onButton", "player1");
     botState.updateMatch("maxWinPot", 45);
     botState.updateMatch("amountToCall", 15);

     it('should be a function', function() {
         BotBet.should.be.a('function');
     });

     it('should return an instance of a PokerMove', function() {
         var move = BotBet.allIn(botState);
         move.should.be.an.instanceof(PokerMove);
     });


     it('should bet the pot on all in', function() {
         var move = BotBet.allIn(botState);
         move.getAction().should.equal("raise");
         move.getAmount().should.equal(45);
         move.getPlayer().should.equal("player1");
         move.getPlayer().should.not.equal("player2");
     });



     it('should bet the minimum on minimum raise', function() {
         var move = BotBet.minimumRaise(botState);
         move.getAction().should.equal("raise");
         move.getAmount().should.equal(30);
         move.getPlayer().should.equal("player1");
         move.getPlayer().should.not.equal("player2");
     });

     it('should bet the call amount on call', function() {
         var move = BotBet.callBet(botState);
         move.getAction().should.equal("call");
         move.getAmount().should.equal(15);
         move.getPlayer().should.equal("player1");
         move.getPlayer().should.not.equal("player2");
     });

     it('should check on check', function() {
         var move = BotBet.check(botState);
         move.getAction().should.equal("check");
         move.getAmount().should.equal(0);
         move.getPlayer().should.equal("player1");
         move.getPlayer().should.not.equal("player2");
     });

     it('should fold on fold', function() {
         var move = BotBet.fold(botState);
         move.getAction().should.equal("fold");
         move.getAmount().should.equal(0);
         move.getPlayer().should.equal("player1");
         move.getPlayer().should.not.equal("player2");
     });

 });
