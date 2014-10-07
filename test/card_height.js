describe('Card Height', function() {

    var CardHeight = require('../poker_bot/poker/card_height').CardHeight;
    it('should be an object', function() {
        CardHeight.should.be.a('object');

    });
    it('should contain the properties of a card', function() {
        CardHeight.should.have.property('DEUCE');
        CardHeight.should.have.property('THREE');
        CardHeight.should.have.property('FOUR');
        CardHeight.should.have.property('FIVE');
        CardHeight.should.have.property('SIX');
        CardHeight.should.have.property('SEVEN');
        CardHeight.should.have.property('EIGHT');
        CardHeight.should.have.property('NINE');
        CardHeight.should.have.property('TEN');
        CardHeight.should.have.property('JACK');
        CardHeight.should.have.property('QUEEN');
        CardHeight.should.have.property('KING');
        CardHeight.should.have.property('ACE');
    });
    it('should provide an ordinal for it\'s properties', function() {
        CardHeight.DEUCE.should.equal(0);
        CardHeight.THREE.should.equal(1);
        CardHeight.FOUR.should.equal(2);
        CardHeight.FIVE.should.equal(3);
        CardHeight.SIX.should.equal(4);
        CardHeight.SEVEN.should.equal(5);
        CardHeight.EIGHT.should.equal(6);
        CardHeight.NINE.should.equal(7);
        CardHeight.TEN.should.equal(8);
        CardHeight.JACK.should.equal(9);
        CardHeight.QUEEN.should.equal(10);
        CardHeight.KING.should.equal(11);
        CardHeight.ACE.should.equal(12);
    });
});