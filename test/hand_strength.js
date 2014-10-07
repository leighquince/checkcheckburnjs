var Card = require('../poker_bot/poker/card').Card;
var HandStrength = require('../poker_bot/poker/hand_strength').HandStrength;
var BotStarter = require('../poker_bot/bot/bot_starter').BotStarter;
var HandOmaha = require('../poker_bot/poker/hand_omaha').HandOmaha;
var HandEval = require('../poker_bot/evaluation/hand_eval').HandEval;
describe('Hand Strength', function() {

    var botStarter = new BotStarter();

    
    describe("get hand rank", function() {

        it("should return 1 with royal flush", function() {
            var hand = new HandOmaha(
                Card.getCard('Th'),
                Card.getCard('Ah'),
                Card.getCard('3h'),
                Card.getCard('5h')
            );
            var table = [
                Card.getCard('Qh').getBitPattern(),
                Card.getCard('Kh').getBitPattern(),
                Card.getCard('Jh').getBitPattern(),
                Card.getCard('3d').getBitPattern(),
                Card.getCard('4h').getBitPattern()
            ];

            var handCategory = HandStrength.getHighestRank(hand.getBitPattern(), table);
            handCategory.should.equal(1);
        });
    });
    describe("win percentage", function() {

        it("should predict 100% with royal flush on flop", function() {

            var hand = new HandOmaha(
                Card.getCard('Ah'),
                Card.getCard('Kh'),
                Card.getCard('Ac'),
                Card.getCard('Kc')

            );

            var table = [
                Card.getCard('Qh'),
                Card.getCard('Jh'),
                Card.getCard('Th')
            ];

            var tableBitPattern = [
                Card.getCard('Qh').getBitPattern(),
                Card.getCard('Jh').getBitPattern(),
                Card.getCard('Th').getBitPattern()
            ];

            var myHandRank = HandStrength.getHighestRank(hand.getBitPattern(), tableBitPattern);

            var winPercentage = HandStrength.getWinPercentage(hand, table, myHandRank);

            winPercentage.should.equal(1);
        });

        it("should predict below 50% with low pair on the flop", function() {

            var hand = new HandOmaha(
                Card.getCard('5h'),
                Card.getCard('2d'),
                Card.getCard('5c'),
                Card.getCard('Kc')

            );

            var table = [
                Card.getCard('7s'),
                Card.getCard('Jh'),
                Card.getCard('4d')
            ];

            var tableBitPattern = [
                Card.getCard('7s').getBitPattern(),
                Card.getCard('Jh').getBitPattern(),
                Card.getCard('4d').getBitPattern()
            ];

            var myHandRank = HandStrength.getHighestRank(hand.getBitPattern(), tableBitPattern);

            var winPercentage = HandStrength.getWinPercentage(hand, table, myHandRank);
            console.log(winPercentage);
            winPercentage.should.be.below(0.5);
        });

        it("should predict 100% with royal flush after flop", function() {

            var hand = new HandOmaha(
                Card.getCard('Ah'),
                Card.getCard('Kh'),
                Card.getCard('Ac'),
                Card.getCard('Kc')

            );

            var table = [
                Card.getCard('Qh'),
                Card.getCard('Jh'),
                Card.getCard('Th'),
                Card.getCard('3h'),
                Card.getCard('2h')
            ];

            var tableBitPattern = [
                Card.getCard('Qh').getBitPattern(),
                Card.getCard('Jh').getBitPattern(),
                Card.getCard('Th').getBitPattern(),
                Card.getCard('3h').getBitPattern(),
                Card.getCard('2h').getBitPattern()
            ];

            var myHandRank = HandStrength.getHighestRank(hand.getBitPattern(), tableBitPattern);

            var winPercentage = HandStrength.getWinPercentage(hand, table, myHandRank);

            winPercentage.should.equal(1);
        });

        it("should predict below 1% with dead mans hand", function() {

            var hand = new HandOmaha(
                Card.getCard('2h'),
                Card.getCard('3s'),
                Card.getCard('4c'),
                Card.getCard('5d')

            );

            var table = [
                Card.getCard('7h'),
                Card.getCard('8s'),
                Card.getCard('9d'),
                Card.getCard('Tc'),
                Card.getCard('Jh'),
            ];

            var tableBitPattern = [
                Card.getCard('7h').getBitPattern(),
                Card.getCard('8s').getBitPattern(),
                Card.getCard('9d').getBitPattern(),
                Card.getCard('Tc').getBitPattern(),
                Card.getCard('Jh').getBitPattern(),
            ];

            var myHandRank = HandStrength.getHighestRank(hand.getBitPattern(), tableBitPattern);
            var winPercentage = HandStrength.getWinPercentage(hand, table, myHandRank);
            winPercentage.should.be.below(0.01);
        });

        it("should predict less than 50% with low trips ", function() {

            var hand = new HandOmaha(
                Card.getCard('2h'),
                Card.getCard('2c'),
                Card.getCard('4c'),
                Card.getCard('5d')

            );

            var table = [
                Card.getCard('2d'),
                Card.getCard('8h'),
                Card.getCard('9h'),
                Card.getCard('Th'),
                Card.getCard('Jc'),
            ];

            var tableBitPattern = [
                Card.getCard('2d').getBitPattern(),
                Card.getCard('8h').getBitPattern(),
                Card.getCard('9h').getBitPattern(),
                Card.getCard('Th').getBitPattern(),
                Card.getCard('Jc').getBitPattern(),
            ];

            var myHandRank = HandStrength.getHighestRank(hand.getBitPattern(), tableBitPattern);
            var winPercentage = HandStrength.getWinPercentage(hand, table, myHandRank);
            console.log(winPercentage);
            winPercentage.should.be.below(0.5);
        });

        it("should predict more than 50% with full house ", function() {

            var hand = new HandOmaha(
                Card.getCard('2h'),
                Card.getCard('2c'),
                Card.getCard('4c'),
                Card.getCard('5d')

            );

            var table = [
                Card.getCard('2d'),
                Card.getCard('8h'),
                Card.getCard('8s'),
                Card.getCard('3s'),
                Card.getCard('Jc'),
            ];

            var tableBitPattern = [
                Card.getCard('2d').getBitPattern(),
                Card.getCard('8h').getBitPattern(),
                Card.getCard('8s').getBitPattern(),
                Card.getCard('3s').getBitPattern(),
                Card.getCard('Jc').getBitPattern(),
            ];

            var myHandRank = HandStrength.getHighestRank(hand.getBitPattern(), tableBitPattern);
            var winPercentage = HandStrength.getWinPercentage(hand, table, myHandRank);
            console.log(winPercentage);
            winPercentage.should.be.above(0.5);
        });



        it("should predict more than 50% with full house ", function() {

            var hand = new HandOmaha(
                Card.getCard('2h'),
                Card.getCard('2c'),
                Card.getCard('4c'),
                Card.getCard('5d')

            );

            var table = [
                Card.getCard('2d'),
                Card.getCard('8h'),
                Card.getCard('8s'),
            ];

            var tableBitPattern = [
                Card.getCard('2d').getBitPattern(),
                Card.getCard('8h').getBitPattern(),
                Card.getCard('8s').getBitPattern(),
            ];

            var myHandRank = HandStrength.getHighestRank(hand.getBitPattern(), tableBitPattern);
            var winPercentage = HandStrength.getWinPercentage(hand, table, myHandRank);
            console.log(winPercentage);
            winPercentage.should.be.above(0.5);
        });
    });

});
