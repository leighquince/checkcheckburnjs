describe('Deck', function() {

    var Card = require('../poker_bot/poker/card').Card;
    var Deck = require('../poker_bot/poker/deck').Deck;


    it('should generate a whole deck when no hand or table are passed', function()
    {
    	var deck = new Deck();
    	deck.getDeck().length.should.equal(52);
    });

    it('should generate a deck without hand cards', function()
    {
   
    	var hand = [new Card(1), new Card(2), new Card(3), new Card(4)];
    	var deck = new Deck(hand).getDeck();
    	

    	deck.length.should.equal(48);
    	
    	deck[0].getNumber().should.equal(0);
    	deck[1].getNumber().should.equal(5);
    });

    it('should generate a deck without hand cards and table cards', function()
    {
 
    	var hand = [new Card(1), new Card(2), new Card(3), new Card(4)];
    	var table = [new Card(5), new Card(6), new Card(7), new Card(8),, new Card(9)];
    	var deck = new Deck(hand, table).getDeck();
    	

    	deck.length.should.equal(43);
    	
    	deck[0].getNumber().should.equal(0);
    	deck[1].getNumber().should.equal(10);
    });


  });