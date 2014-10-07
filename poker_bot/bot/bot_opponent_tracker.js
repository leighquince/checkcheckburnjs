var helper = require('../helper');

(function() {

    var RAISE = "raise",
        CALL = "call",
        CHECK = "check",
        FOLD = "fold",
        TOLLERANCE = 0.1,
        OVERALL = 'OVERALL',
        PREFLOP = 'PREFLOP',
        FLOP = 'FLOP',
        TURN = 'TURN',
        RIVER = 'RIVER';

    var PointInMatchStats = function() {
        return {
            name: "",
            raises: 0,
            checks: 0,
            folds: 0,
            calls: 0,
            callCheck: 0,
            callRaise: 0,
            checkRaise: 0,
            checkCheck: 0,
            raiseCall: 0,
            raiseFold: 0,
            raiseRaise: 0,
            actions: 0,
            pureRaiseAmounts: [],
            raiseOfBlind: [],
            raiseOfMaxRaise: [],
            playerType: BotOpponentTracker.PlayerType.UNKNOWN

        };
    };

    var BotOpponentTracker = function(state) {
        this.state = state;
        this.overall = new PointInMatchStats();
        this.preFlop = new PointInMatchStats();
        this.flop = new PointInMatchStats();
        this.turn = new PointInMatchStats();
        this.river = new PointInMatchStats();

        this.overall.name = OVERALL;
        this.preFlop.name = PREFLOP;
        this.flop.name = FLOP;
        this.turn.name = TURN;
        this.river.name = RIVER;


        this.handsWon = 0;
        this.handsLost = 0;
        this.handsBullied = 0;
        this.handsBluffed = 0;
    };

    //All in bot - 99% of moves are raises at the max pot
    //Agressive players - 80 % of move are raises
    //Tight - will call pre flop, raise and see through to match end
    //Pussy - will fold when raised unless seeing through the end - will have a fold rate of more than 85%
    //unknown - have not played enough hands yet to get a read

    BotOpponentTracker.PlayerType = new helper.Enum("ALL_IN_BOT", "AGRESSIVE", "TIGHT", "PUSSY", "UNKNOWN");
    BotOpponentTracker.RaiseAmountType = new helper.Enum("ABOVE", "AVERAGE", "BELOW", "UNKNOWN");

    BotOpponentTracker.prototype.increaseLosses = function() {
        this.handsLost++;
        if (this.state.opponentMove && this.state.opponentMove.getAction() === FOLD) {
            this.handsBluffed++;
        }
    };

    BotOpponentTracker.prototype.increaseWins = function() {
        this.handsWon++;
        if (this.state.myMove && this.state.myMove.getAction() === FOLD) {
            this.handsBullied++;
        }
    };

    BotOpponentTracker.prototype.track = function() {
        var pointInMatch;
        switch (this.state.getTable().length) {
            case 0:
                pointInMatch = this.preFlop;
                break;
            case 3:
                pointInMatch = this.flop;
                break;
            case 4:
                pointInMatch = this.turn;
                break;
            case 5:
                pointInMatch = this.river;
                break;
        }

        switch (this.state.opponentMove.getAction()) {
            case FOLD:
                this.overall.folds++;
                pointInMatch.folds++;
                break;
            case CALL:
                this.overall.calls++;
                pointInMatch.calls++;
                break;
            case CHECK:
                this.overall.checks++;
                pointInMatch.checks++;
                break;
            case RAISE:
                this.overall.raises++;
                pointInMatch.raises++;
                this.trackRaiseAmounts(pointInMatch);
                this.trackRaiseAmounts(this.overall);
                break;
        }
        pointInMatch.actions++;
        this.overall.actions++;

        if (this.state.myMove) {
            this.trackPointInMatch(pointInMatch);
            this.trackPointInMatch(this.overall);
        }


        this.analysePlayerType(pointInMatch);
        this.analysePlayerType(this.overall);
    };

    BotOpponentTracker.prototype.getOverallStats = function() {
        return this.overall;
    };

    BotOpponentTracker.prototype.getPointInMatchStats = function() {
        var pointInMatch;
        switch (this.state.getTable().length) {
            case 0:
                pointInMatch = this.preFlop;
                break;
            case 3:
                pointInMatch = this.flop;
                break;
            case 4:
                pointInMatch = this.turn;
                break;
            case 5:
                pointInMatch = this.river;
                break;
        }

        return pointInMatch;
    };

    BotOpponentTracker.prototype.lastRaiseAmountType = function(pointInMatch) {
        pointInMatch = pointInMatch || this.overall;
        if (pointInMatch.raises < 5) {
            return BotOpponentTracker.RaiseAmountType.UNKNOWN;
        }

        var raiseAmount = pointInMatch.pureRaiseAmounts[pointInMatch.pureRaiseAmounts.length - 1];
        var raiseOfBlind = pointInMatch.raiseOfBlind[pointInMatch.raiseOfBlind.length - 1];
        var raiseOfMaxRaise = pointInMatch.raiseOfMaxRaise[pointInMatch.raiseOfMaxRaise.length - 1];


        var averageRaiseOfBlind = _getArrayAverage(pointInMatch.raiseOfBlind);
        var averageRaiseOfMaxRaise = _getArrayAverage(pointInMatch.raiseOfMaxRaise);


        if ((raiseOfBlind <= averageRaiseOfBlind + TOLLERANCE && raiseOfBlind >= averageRaiseOfBlind - TOLLERANCE) ||
            (raiseOfMaxRaise <= averageRaiseOfMaxRaise + TOLLERANCE && raiseOfMaxRaise >= averageRaiseOfMaxRaise - TOLLERANCE)) {
            return BotOpponentTracker.RaiseAmountType.AVERAGE;
        }

        if ((raiseOfBlind > averageRaiseOfBlind + TOLLERANCE) ||
            (raiseOfMaxRaise > averageRaiseOfMaxRaise + TOLLERANCE)) {
            return BotOpponentTracker.RaiseAmountType.ABOVE;
        }

        if ((raiseOfBlind < averageRaiseOfBlind - TOLLERANCE) ||
            (raiseOfMaxRaise < averageRaiseOfMaxRaise - TOLLERANCE)) {
            return BotOpponentTracker.RaiseAmountType.BELOW;
        }


        return BotOpponentTracker.RaiseAmountType.UNKNOWN;


    };
    var _getArrayAverage = function(array) {
        var average = 0;
        array.forEach(function(element) {
            average += element;
        });
        average = average / array.length;
        return average;
    };
    BotOpponentTracker.prototype.analysePlayerType = function(pointInMatch) {
        if (pointInMatch.actions < 5) {
            return;
        }

        var raisePercentage = pointInMatch.raises / pointInMatch.actions;
        var callPercentage = pointInMatch.calls / pointInMatch.actions;
        var checkPercentage = pointInMatch.checks / pointInMatch.actions;
        var foldPercentage = pointInMatch.folds / pointInMatch.actions;

        var forcedActions = pointInMatch.callCheck + pointInMatch.callRaise +
            pointInMatch.checkRaise + pointInMatch.checkCheck +
            pointInMatch.raiseCall + pointInMatch.raiseFold +
            pointInMatch.raiseRaise;

        if (raisePercentage >= 0.8) {
            this.log(pointInMatch.name + ": Player identified as ALL_IN_BOT");
            pointInMatch.playerType = BotOpponentTracker.PlayerType.ALL_IN_BOT;
            return;
        }
        if (raisePercentage >= 0.5) {
            this.log(pointInMatch.name + ": Player identified as AGGRESSIVE");

            pointInMatch.playerType = BotOpponentTracker.PlayerType.AGRESSIVE;
            return;
        }

        if (foldPercentage >= 0.5 || pointInMatch.raiseFold / forcedActions >= 0.5) {
            this.log(pointInMatch.name + ": Player identified as PUSSY");

            pointInMatch.playerType = BotOpponentTracker.PlayerType.PUSSY;
            return;
        }

        // if ((raisePercentage >= 0.2 && raisePercentage <= 0.3) &&
        //     (callPercentage >= 0.2 && callPercentage <= 0.3) &&
        //     (checkPercentage >= 0.2 && checkPercentage <= 0.3) &&
        //     (foldPercentage >= 0.2 && foldPercentage <= 0.3)) {
        this.log(pointInMatch.name + ": Player identified as TIGHT");

        pointInMatch.playerType = BotOpponentTracker.PlayerType.TIGHT;
        //     return;
        // }


    };
    BotOpponentTracker.prototype.trackRaiseAmounts = function(pointInMatch) {
        pointInMatch.pureRaiseAmounts.push(this.state.opponentMove.getAmount());
        pointInMatch.raiseOfBlind.push(this.state.opponentMove.getAmount() / this.state.getBigBlind());
        pointInMatch.raiseOfMaxRaise.push(this.state.opponentMove.getAmount() / this.state.getPot());
    };
    BotOpponentTracker.prototype.trackPointInMatch = function(pointInMatch) {
        if (this.state.myMove.getAction() === RAISE &&
            this.state.opponentMove.getAction() === FOLD) {
            pointInMatch.raiseFold++;
        }

        if (this.state.myMove.getAction() === RAISE &&
            this.state.opponentMove.getAction() === CALL) {
            pointInMatch.raiseCall++;
        }

        if (this.state.myMove.getAction() === RAISE &&
            this.state.opponentMove.getAction() === RAISE) {
            pointInMatch.raiseRaise++;
        }

        if (this.state.myMove.getAction() === CALL &&
            this.state.opponentMove.getAction() === RAISE) {
            pointInMatch.callRaise++;
        }

        if (this.state.myMove.getAction() === CALL &&
            this.state.opponentMove.getAction() === CHECK) {
            pointInMatch.callCheck++;
        }

        if (this.state.myMove.getAction() === CHECK &&
            this.state.opponentMove.getAction() === RAISE) {
            pointInMatch.checkRaise++;
        }

        if (this.state.myMove.getAction() === CHECK &&
            this.state.opponentMove.getAction() === CHECK) {
            pointInMatch.checkCheck++;
        }

    };

    BotOpponentTracker.prototype.log = function(string) {
        process.stderr.write(string + '\n');
    };


    exports.BotOpponentTracker = BotOpponentTracker;

})();
