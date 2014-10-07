var HandEval = require("../poker_bot/evaluation/hand_eval").HandEval;
var HandOmaha = require('../poker_bot/poker/hand_omaha').HandOmaha;
var Card = require("../poker_bot/poker/card").Card;
describe("Hand Eval", function() {
    it("should be a function", function() {
        HandEval.should.be.an("function");
    });
    it("should contain HandCategory", function() {
        HandEval.HandCategory.NO_PAIR.should.equal(0);
        HandEval.HandCategory.PAIR.should.equal(1);
        HandEval.HandCategory.TWO_PAIR.should.equal(2);
        HandEval.HandCategory.THREE_OF_A_KIND.should.equal(3);
        HandEval.HandCategory.STRAIGHT.should.equal(4);
        HandEval.HandCategory.FLUSH.should.equal(5);
        HandEval.HandCategory.FULL_HOUSE.should.equal(6);
        HandEval.HandCategory.FOUR_OF_A_KIND.should.equal(7);
        HandEval.HandCategory.STRAIGHT_FLUSH.should.equal(8);
    });

    describe("hold cards rank height", function() {
        it("should identify four of a kind", function() {
            var hand = new HandOmaha(
                Card.getCard('Ad'),
                Card.getCard('Ad'),
                Card.getCard('Ah'),
                Card.getCard('Ah')
            );


            var handCategory = HandEval.getHoldCardRank(hand.getCards());
            handCategory.holdHeightType.should.equal(HandEval.HoldHandHeight.FOUR_OF_A_KIND);
        });

        it("should identify three of a kind", function() {
            var hand = new HandOmaha(
                Card.getCard('Ad'),
                Card.getCard('Ad'),
                Card.getCard('Ah'),
                Card.getCard('Kh')
            );


            var handCategory = HandEval.getHoldCardRank(hand.getCards());
            handCategory.holdHeightType.should.equal(HandEval.HoldHandHeight.THREE_OF_A_KIND);
        });

        it("should identify ace pair with consecutive", function() {
            var hand = new HandOmaha(
                Card.getCard('Ad'),
                Card.getCard('Ad'),
                Card.getCard('Kh'),
                Card.getCard('Kh')
            );


            var handCategory = HandEval.getHoldCardRank(hand.getCards());
            handCategory.holdHeightType.should.equal(HandEval.HoldHandHeight.ACE_PAIR_WITH_CONSECUTIVE);
        });

        it("should identify ace pair with broad way pair", function() {
            var hand = new HandOmaha(
                Card.getCard('Ad'),
                Card.getCard('Ad'),
                Card.getCard('Qh'),
                Card.getCard('Qh')
            );


            var handCategory = HandEval.getHoldCardRank(hand.getCards());
            handCategory.holdHeightType.should.equal(HandEval.HoldHandHeight.ACE_PAIR_WITH_BROADWAY_PAIR);

        });
        it("should identify broad way pair with consecutive", function() {
            var hand = new HandOmaha(
                Card.getCard('Jd'),
                Card.getCard('Jd'),
                Card.getCard('Qh'),
                Card.getCard('Qh')
            );


            var handCategory = HandEval.getHoldCardRank(hand.getCards());
            handCategory.holdHeightType.should.equal(HandEval.HoldHandHeight.BOROADWAY_PAIR_WITH_CONSECUTIVE);

        });
        it("should identify broad way pair with consecutive", function() {
            var hand = new HandOmaha(
                Card.getCard('Kd'),
                Card.getCard('Kd'),
                Card.getCard('Qh'),
                Card.getCard('Qh')
            );


            var handCategory = HandEval.getHoldCardRank(hand.getCards());
            handCategory.holdHeightType.should.equal(HandEval.HoldHandHeight.BOROADWAY_PAIR_WITH_CONSECUTIVE);

        });
        it("should identify broad way two pair", function() {
            var hand = new HandOmaha(
                Card.getCard('Td'),
                Card.getCard('Td'),
                Card.getCard('Qh'),
                Card.getCard('Qh')
            );


            var handCategory = HandEval.getHoldCardRank(hand.getCards());
            handCategory.holdHeightType.should.equal(HandEval.HoldHandHeight.BROADWAY_TWO_PAIR);

        });
        it("should identify broad way two pair", function() {
            var hand = new HandOmaha(
                Card.getCard('Td'),
                Card.getCard('Td'),
                Card.getCard('Qh'),
                Card.getCard('Qh')
            );


            var handCategory = HandEval.getHoldCardRank(hand.getCards());
            handCategory.holdHeightType.should.equal(HandEval.HoldHandHeight.BROADWAY_TWO_PAIR);

        });

        it("should identify top pair with low kickers", function() {
            var hand = new HandOmaha(
                Card.getCard('Kd'),
                Card.getCard('Kd'),
                Card.getCard('5h'),
                Card.getCard('5h')
            );


            var handCategory = HandEval.getHoldCardRank(hand.getCards());
            handCategory.holdHeightType.should.equal(HandEval.HoldHandHeight.TOP_PAIR_PAIR_KICKERS);

        });
        it("should identify two pair", function() {
            var hand = new HandOmaha(
                Card.getCard('7d'),
                Card.getCard('7d'),
                Card.getCard('5h'),
                Card.getCard('5h')
            );


            var handCategory = HandEval.getHoldCardRank(hand.getCards());
            handCategory.holdHeightType.should.equal(HandEval.HoldHandHeight.TWO_PAIR);

        });
        it("should identify broadway consecutive", function() {
            var hand = new HandOmaha(
                Card.getCard('Ad'),
                Card.getCard('Kd'),
                Card.getCard('Qh'),
                Card.getCard('Jh')
            );


            var handCategory = HandEval.getHoldCardRank(hand.getCards());
            handCategory.holdHeightType.should.equal(HandEval.HoldHandHeight.BROADWAY_CONSECUTIVE);

        });

        it("should identify  consecutive", function() {
            var hand = new HandOmaha(
                Card.getCard('5d'),
                Card.getCard('8d'),
                Card.getCard('6h'),
                Card.getCard('7h')
            );


            var handCategory = HandEval.getHoldCardRank(hand.getCards());
            handCategory.holdHeightType.should.equal(HandEval.HoldHandHeight.CONSECUTIVE);

        });

        it("should identify broadway and dangler", function() {
            var hand = new HandOmaha(
                Card.getCard('Kd'),
                Card.getCard('Ad'),
                Card.getCard('Jh'),
                Card.getCard('7h')
            );


            var handCategory = HandEval.getHoldCardRank(hand.getCards());
            handCategory.holdHeightType.should.equal(HandEval.HoldHandHeight.BROADWAY_AND_DANGLER);

        });

        it("should identify broadway and dangler", function() {
            var hand = new HandOmaha(
                Card.getCard('Kd'),
                Card.getCard('Kd'),
                Card.getCard('Jh'),
                Card.getCard('7h')
            );


            var handCategory = HandEval.getHoldCardRank(hand.getCards());
            handCategory.holdHeightType.should.equal(HandEval.HoldHandHeight.BROADWAY_AND_DANGLER);

        });

        it("should identify top pair with low kickers", function() {
            var hand = new HandOmaha(
                Card.getCard('Kd'),
                Card.getCard('Kd'),
                Card.getCard('3h'),
                Card.getCard('7h')
            );


            var handCategory = HandEval.getHoldCardRank(hand.getCards());
            handCategory.holdHeightType.should.equal(HandEval.HoldHandHeight.TOP_PAIR_LOW_KICKERS);

        });

        it("should identify middle pair with consecutive", function() {
            var hand = new HandOmaha(
                Card.getCard('8d'),
                Card.getCard('8d'),
                Card.getCard('7h'),
                Card.getCard('9h')
            );


            var handCategory = HandEval.getHoldCardRank(hand.getCards());
            handCategory.holdHeightType.should.equal(HandEval.HoldHandHeight.MIDDLE_PAIR_WITH_CONSECUTIVE);

        });

        it("should identify middle pair with consecutive", function() {
            var hand = new HandOmaha(
                Card.getCard('8d'),
                Card.getCard('8d'),
                Card.getCard('7h'),
                Card.getCard('6h')
            );


            var handCategory = HandEval.getHoldCardRank(hand.getCards());
            handCategory.holdHeightType.should.equal(HandEval.HoldHandHeight.MIDDLE_PAIR_WITH_CONSECUTIVE);

        });

        it("should identify middle pair with consecutive", function() {
            var hand = new HandOmaha(
                Card.getCard('8d'),
                Card.getCard('8d'),
                Card.getCard('Th'),
                Card.getCard('9h')
            );


            var handCategory = HandEval.getHoldCardRank(hand.getCards());
            handCategory.holdHeightType.should.equal(HandEval.HoldHandHeight.MIDDLE_PAIR_WITH_CONSECUTIVE);

        });

        it("should identify low pair with consecutive", function() {
            var hand = new HandOmaha(
                Card.getCard('4d'),
                Card.getCard('4d'),
                Card.getCard('2h'),
                Card.getCard('3h')
            );


            var handCategory = HandEval.getHoldCardRank(hand.getCards());
            handCategory.holdHeightType.should.equal(HandEval.HoldHandHeight.LOW_PAIR_WITH_CONSECUTIVE);

        });

         it("should identify low pair with consecutive", function() {
            var hand = new HandOmaha(
                Card.getCard('4d'),
                Card.getCard('4d'),
                Card.getCard('5h'),
                Card.getCard('3h')
            );


            var handCategory = HandEval.getHoldCardRank(hand.getCards());
            handCategory.holdHeightType.should.equal(HandEval.HoldHandHeight.LOW_PAIR_WITH_CONSECUTIVE);

        });

          it("should identify low pair with consecutive", function() {
            var hand = new HandOmaha(
                Card.getCard('4d'),
                Card.getCard('4d'),
                Card.getCard('5h'),
                Card.getCard('6h')
            );


            var handCategory = HandEval.getHoldCardRank(hand.getCards());
            handCategory.holdHeightType.should.equal(HandEval.HoldHandHeight.LOW_PAIR_WITH_CONSECUTIVE);

        });




    });
    describe("hold cards rank suit", function() {

        it("identify double suited hold cards", function() {
            var hand = new HandOmaha(
                Card.getCard('Ad'),
                Card.getCard('Ad'),
                Card.getCard('Kh'),
                Card.getCard('Kh')
            );


            var handCategory = HandEval.getHoldCardRank(hand.getCards());
            handCategory.holdSuitType.should.equal(HandEval.HoldHandSuit.DOUBLE_SUITED);
        });

        it("identify tripple suited hold cards", function() {
            var hand = new HandOmaha(
                Card.getCard('Ad'),
                Card.getCard('Ad'),
                Card.getCard('Kc'),
                Card.getCard('Ks')
            );


            var handCategory = HandEval.getHoldCardRank(hand.getCards());
            handCategory.holdSuitType.should.equal(HandEval.HoldHandSuit.TRIPPLE_SUITED);
        });

        it("identify dangle suited hold cards", function() {
            var hand = new HandOmaha(
                Card.getCard('Ad'),
                Card.getCard('Ad'),
                Card.getCard('Kd'),
                Card.getCard('Kh')
            );


            var handCategory = HandEval.getHoldCardRank(hand.getCards());
            handCategory.holdSuitType.should.equal(HandEval.HoldHandSuit.DANGLE_SUIT);
        });

        it("identify rainbow suited hold cards", function() {
            var hand = new HandOmaha(
                Card.getCard('Ad'),
                Card.getCard('Ac'),
                Card.getCard('Kh'),
                Card.getCard('Ks')
            );


            var handCategory = HandEval.getHoldCardRank(hand.getCards());
            handCategory.holdSuitType.should.equal(HandEval.HoldHandSuit.RAINBOW);
        });
        it("identify flush suited hold cards", function() {
            var hand = new HandOmaha(
                Card.getCard('Ad'),
                Card.getCard('Ad'),
                Card.getCard('Kd'),
                Card.getCard('Kd')
            );


            var handCategory = HandEval.getHoldCardRank(hand.getCards());
            handCategory.holdSuitType.should.equal(HandEval.HoldHandSuit.FLUSH);
        });
    });
    describe("Get Hand rank", function() {
        it("should identify a straight flush", function() {
            var handCode = [];
            handCode.push(Card.getCard('2d').getBitPattern());
            handCode.push(Card.getCard('3d').getBitPattern());
            handCode.push(Card.getCard('4d').getBitPattern());
            handCode.push(Card.getCard('5d').getBitPattern());
            handCode.push(Card.getCard('6d').getBitPattern());

            HandEval.getHandRank(handCode).should.equal(9);

        });

        it("should identify a royal flush", function() {
            var handCode = [];
            handCode.push(Card.getCard('Th').getBitPattern());
            handCode.push(Card.getCard('Kh').getBitPattern());
            handCode.push(Card.getCard('Ah').getBitPattern());
            handCode.push(Card.getCard('Jh').getBitPattern());
            handCode.push(Card.getCard('Qh').getBitPattern());

            HandEval.getHandRank(handCode).should.equal(1);

        });

        it("should identify a flush", function() {
            var handCode = [];
            handCode.push(Card.getCard('Kd').getBitPattern());
            handCode.push(Card.getCard('Ad').getBitPattern());
            handCode.push(Card.getCard('Qd').getBitPattern());
            handCode.push(Card.getCard('Jd').getBitPattern());
            handCode.push(Card.getCard('9d').getBitPattern());

            HandEval.getHandRank(handCode).should.equal(323);

        });

        it("should identify a straight", function() {
            var handCode = [];
            handCode.push(Card.getCard('9s').getBitPattern());
            handCode.push(Card.getCard('Kh').getBitPattern());
            handCode.push(Card.getCard('Qd').getBitPattern());
            handCode.push(Card.getCard('Jd').getBitPattern());
            handCode.push(Card.getCard('Td').getBitPattern());

            HandEval.getHandRank(handCode).should.equal(1601);

        });

        it("should identify a high card hand", function() {
            var handCode = [];
            handCode.push(Card.getCard('2s').getBitPattern());
            handCode.push(Card.getCard('3h').getBitPattern());
            handCode.push(Card.getCard('4d').getBitPattern());
            handCode.push(Card.getCard('5d').getBitPattern());
            handCode.push(Card.getCard('7d').getBitPattern());

            HandEval.getHandRank(handCode).should.equal(7462);

        });

        it("should identify a four of a kind", function() {
            var handCode = [];
            handCode.push(Card.getCard('As').getBitPattern());
            handCode.push(Card.getCard('Ah').getBitPattern());
            handCode.push(Card.getCard('Ad').getBitPattern());
            handCode.push(Card.getCard('Ac').getBitPattern());
            handCode.push(Card.getCard('Kd').getBitPattern());

            HandEval.getHandRank(handCode).should.equal(11);

        });

    });

});
