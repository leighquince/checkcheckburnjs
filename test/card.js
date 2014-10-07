describe('Card', function() {

    var Card = require('../poker_bot/poker/card').Card;


    it('should be a function', function() {
        Card.should.be.a('function');
    });

    it('should be an instance of a Card', function() {
        var card = new Card();
        card.should.be.an.instanceof(Card);
    });
    it('should return correct height', function() {
        var card = new Card(0);
        card.getHeight().should.equal(0);
    });
    it('should return correct suit', function() {
        var card = new Card(0);
        card.getSuit().should.equal(0);
    });
    it('should return correct string', function() {
        var card = new Card(0);
        card.toString().should.equal('2s');
    });
    it('should be equal to it\'s number', function() {
        var card = new Card(3);
        card.getNumber().should.equal(3);
    });
    it('should provide a card from a string', function() {
        var card = Card.getCard('2d');
        card.should.be.an.instanceof(Card);
        card.getNumber().should.equal(39);
        card.toString().should.equal('2d');

        var anotherCard = Card.getCard('Kh');
        anotherCard.should.be.an.instanceof(Card);
        anotherCard.getNumber().should.equal(24);
        anotherCard.toString().should.equal('Kh');
    });

    it('should provide a bit pattern', function() {
        var card = Card.getCard('Kd');
        card.getBitPattern().should.equal(parseInt("00001000000000000100101100100101",2));
        var anotherCard = Card.getCard('5s');
        anotherCard.getBitPattern().should.equal(parseInt("00000000000010000001001100000111",2));
    });
});