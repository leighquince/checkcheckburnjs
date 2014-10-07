describe('Card Suit', function() {

    var CardSuit = require('../poker_bot/poker/card_suit').CardSuit;
    it('should be an object', function() {
        CardSuit.should.be.a('object');

    });
    it('should contain the properties of a card suit', function() {
        CardSuit.should.have.property('SPADES');
        CardSuit.should.have.property('HEARTS');
        CardSuit.should.have.property('CLUBS');
        CardSuit.should.have.property('DIAMONDS');
    });
    it('should provide an ordinal for it\'s properties', function() {
        CardSuit.SPADES.should.equal(0);
        CardSuit.HEARTS.should.equal(1);
        CardSuit.CLUBS.should.equal(2);
        CardSuit.DIAMONDS.should.equal(3);
    });
});