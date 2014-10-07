describe('Poker Move', function() {
    var PokerMove = require('../poker_bot/poker/poker_move').PokerMove;
    it('should be a function', function() {
        PokerMove.should.be.a('function');

    });
    it('should take a name, action and amount', function() {
        var pokerMove = new PokerMove("player1", "raise", 300);
        pokerMove.getPlayer().should.equal("player1");
        pokerMove.getAction().should.equal("raise");
        pokerMove.getAmount().should.equal(300);
        
    });
    it('should return a string of a move', function() {
        var pokerMove = new PokerMove("player1", "raise", 300);
        pokerMove.toString().should.equal("raise 300");
    });
});