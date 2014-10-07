var Card = require('../poker_bot/poker/card').Card;
describe('Hand Omaha', function() {
    var Hand = require('../poker_bot/poker/hand_omaha').HandOmaha;
    it('should be a function', function() {
        Hand.should.be.a('function');
    });

    it('should be an instance of a HandOmaha', function() {
        var hand = new Hand();
        hand.should.be.an.instanceof(Hand);
    });

    it('should be able to take 4 cards as strings', function() {
        var hand = new Hand(Card.getCard('2d'),
            Card.getCard('3d'),
            Card.getCard('4d'),
            Card.getCard('5d'));
        hand.getNumberOfCards().should.equals(4);

    });

    it('should be able to return cards array', function() {
       var hand = new Hand(Card.getCard('2d'),
            Card.getCard('3d'),
            Card.getCard('4d'),
            Card.getCard('5d'));
        hand.getCards().should.be.an('array');
    });

    it('should be able to return card at index', function() {
        var hand = new Hand(Card.getCard('2d'),
            Card.getCard('3d'),
            Card.getCard('4d'),
            Card.getCard('5d'));
        hand.getCard(0).should.equal(Card.getCard('2d'));
        hand.getCard(1).should.equal(Card.getCard('3d'));
        hand.getCard(2).should.equal(Card.getCard('4d'));
        hand.getCard(3).should.equal(Card.getCard('5d'));
        hand.getCard(0).should.be.an.instanceof(Card);
        hand.getCard(1).should.be.an.instanceof(Card);
        hand.getCard(2).should.be.an.instanceof(Card);
        hand.getCard(3).should.be.an.instanceof(Card);
    });

    it('should be able output cards as a string', function() {
        var hand = new Hand(Card.getCard('2d'),
            Card.getCard('3d'),
            Card.getCard('4d'),
            Card.getCard('5d'));
        hand.toString().should.equal('[2d,3d,4d,5d]');
    });
});
