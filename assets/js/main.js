function Dice(url, id, holdId) {
    this.url = url;
    this.id = id;
    this.holdId = holdId;
    this.hold = false;
    this.holdFunction = function () {
        if (this.hold) {
            $("#" + this.holdId).attr("class", "hold open").text("Hold");
            this.hold = false;
        } else {
            $("#" + this.holdId).attr("class", "hold closed").text("Unhold");
            this.hold = true;
        }
    };

    this.value = 0;

    this.setHold = $("#" + this.holdId).on("click", this.holdFunction.bind(this));

    this.background = function (number) {
        $("#" + this.id).css("background-image", "url(assets/images/" + number + ".jpg)")
    }

    this.blank = function () {
        $("#" + this.id).css("background-image", "url(assets/images/Blankdie.jpg)")
    }
}

let die1 = new Dice("../images/Blankdie.jpg", "die1", "hold1");
let die2 = new Dice("../images/Blankdie.jpg", "die2", "hold2");
let die3 = new Dice("../images/Blankdie.jpg", "die3", "hold3");
let die4 = new Dice("../images/Blankdie.jpg", "die4", "hold4");
let die5 = new Dice("../images/Blankdie.jpg", "die5", "hold5");

let game = {
    rollCount: 3,
    totalRolls: 13,
    dice: [die1, die2, die3, die4, die5],

    roll: function () {
        if (game.rollCount > 0 && game.totalRolls > 0) {
            game.rollCount--;
            $(".check").removeClass("check-down");
            game.lastScore = null;
            var scoreArray = [].slice.call(document.querySelectorAll(".scoreValue"));
            scoreArray = scoreArray.filter((score) => score.dataset.saved === "false");
            scoreArray.forEach((score) => score.innerText = "0");

            let count = 0;
            let timer = setInterval(function () {
                if (count >= 7) {
                    clearInterval(timer);
                    game.dice.forEach((die) => $("#" + die.id).css("opacity", "1.0"));
                    game.checkYahzee();
                } else {
                    count++;

                    game.dice.forEach((die) => {
                        if (!die.hold) {
                            $("#" + die.id).css("opacity", "0.5");
                            let num = Math.floor((Math.random() * 6) + 1);
                            die.background(num);
                            die.value = num;
                        }
                    })
                }
            }, 100)
        }
    },

    checkYahzee: function () {
        let bigWinner = game.dice.map((die) => die.value);
        console.log(bigWinner);
        if (bigWinner.every((val) => val === bigWinner[0])) {
            console.log("You sonofabitch!!!");
            if (this.oneYZ === false) {
                this.oneYZ = true;
                console.log("set oneYZ to true");
            } else {
                $(".check").off("click", checkMe);
                $(".check").on("click", checkBonusY);
                // here is where we add the gate for if dataset.number = testing[0], run only the upper score number
                // if != testing[0], run lower score function
                console.log("should not be working");
            }
        }

    },

    clear: function () {
        game.totalScore();
        if (game.lastScore != null) {
            game.rollCount = 3;
            game.totalRolls--;
            game.dice.forEach((die) => {
                die.blank();
                die.hold = true;
                die.holdFunction();
            });
            $("#" + game.lastScore).attr("data-saved", "true");
            $(".check-down").attr("class", "check check-saved");
            console.log(game.lastScore);
        }
    },

    resetCheck: function () {
        if (!game.stoppedCheck) {
            game.clear();
        } else {
            game.stoppedCheck = false;
            $(".check").off("click", checkBonusY);
            $(".check").on("click", checkMe);
            game.clear();
        }
    },

    upperTotal: function () {
        let upperArray = [].slice.call(document.querySelectorAll(".upper"));
        let upperSum = upperArray.map((score) => parseFloat(score.innerText)).reduce((amount, total) => amount + total);
        console.log(upperSum);
        $("#scoreUpSub").text(upperSum);
        if (upperSum >= 63) {
            $("#scoreUpBonus").text(35);
            $("#scoreUpper").text(upperSum + 35);
        } else {
            $("#scoreUpBonus").text(0);
            $("#scoreUpper").text(upperSum);
        }
    },

    lowerTotal: function () {
        let lowerArray = [].slice.call(document.querySelectorAll(".lower"));
        let lowerSum = lowerArray.map((score) => parseFloat(score.innerText)).reduce((amount, total) => amount + total);
        $("#scoreLower").text(lowerSum);
    },

    totalScore: function () {
        this.upperTotal();
        this.lowerTotal();
        $("#scoreTotal").text((parseFloat($("#scoreUpper").text()) + parseFloat($("#scoreLower").text())));
    },

    lastScore: null,
    oneYZ: false,
    stoppedCheck: false,
} // End of Game Object

$(".rollBtn").on("click", game.roll);
$(".clearBtn").on("click", game.resetCheck);

game.dice.forEach((die) => die.blank());

// This may be added to the actual game object later, I am not sure
// Could even make it it's own object, or have it live out in the wild like this.

$(".check").on("click", checkMe);

function checkMe() {

    if ($("#" + $(this).attr("data-out")).attr("data-saved") === "false") {
        var scoreArray = [].slice.call(document.querySelectorAll(".scoreValue"));

        scoreArray = scoreArray.filter((score) => score.dataset.saved === "false");

        scoreArray.forEach((score) => score.innerText = "0");

        $(".check").removeClass("check-down");
        $(this).addClass("check-down");

        game.lastScore = $(this).attr("data-out");

        let testing = game.dice.map((die) => die.value);
        var ones = testing.filter((num) => num === 1);
        var twos = testing.filter((num) => num === 2);
        var threes = testing.filter((num) => num === 3);
        var fours = testing.filter((num) => num === 4);
        var fives = testing.filter((num) => num === 5);
        var sixes = testing.filter((num) => num === 6);
        let groupArray = [ones, twos, threes, fours, fives, sixes];
        console.log(testing);
        console.log(ones);
        console.log(twos);
        console.log(threes);
        console.log(fours);
        console.log(fives);
        console.log(sixes);
        console.log(groupArray);

        switch (this.dataset.score) {
            case "number":
                let target = parseFloat(this.dataset.number);
                let scores = game.dice.filter((die) => die.value === target).map((die) => die.value);
                console.log(scores)
                if (scores.length > 0) {
                    let totalScore = scores.reduce((amount, total) => amount + total)
                    console.log(totalScore)
                    $("#" + $(this).attr("data-out")).text(totalScore)
                } else {
                    console.log("No scores like that here");
                }
                break;

            case "total":
                let totalNumber = game.dice.map((die) => die.value);
                console.log(totalNumber);
                if (totalNumber.length === 5) {
                    totalNumber = totalNumber.reduce((amount, total) => amount + total);
                    console.log(totalNumber)
                    $("#" + $(this).attr("data-out")).text(totalNumber)
                };
                break;

            case "kind":
                if (this.id === "checkKind3") {
                    var couldBe = groupArray.some(arr => arr.length >= 3)
                    if (couldBe) {
                        console.log("3 of a Kind");
                        $("#" + $(this).attr("data-out")).text(testing.reduce((amount, total) => amount + total));
                    } else {
                        console.log("not a 3 of a kind")
                        $("#" + $(this).attr("data-out")).text("0");
                    }
                } else {
                    var mightBe = groupArray.some(arr => arr.length >= 4);
                    if (mightBe) {
                        console.log("4 of a Kind");
                        $("#" + $(this).attr("data-out")).text(testing.reduce((amount, total) => amount + total));
                    } else {
                        console.log("not a 4 of a kind")
                        $("#" + $(this).attr("data-out")).text("0");
                    }
                }
                break;

            case "25":
                let triple = groupArray.filter((array) => array.length === 3)
                let double = groupArray.filter((array) => array.length === 2)

                if (triple.length > 0 && double.length > 0) {
                    console.log("fullhouse");
                    $("#" + $(this).attr("data-out")).text($(this).attr("data-score"));
                } else {
                    console.log("no fullhouse");
                }
                break;

            case "30":
                var order = testing.sort((a, b) => a - b)
                console.log(order);
                var into = groupArray.filter(arr => arr.length >= 2);
                console.log(into);
                // Please, please find a better way to do this, this hurts my soul
                if (order.includes(1) && order.includes(2) && order.includes(3) && order.includes(4) ||
                    order.includes(2) && order.includes(3) && order.includes(4) && order.includes(5) ||
                    order.includes(3) && order.includes(4) && order.includes(5) && order.includes(6)
                ) {
                    console.log("small straight");
                    $("#" + $(this).attr("data-out")).text($(this).attr("data-score"));
                } else {
                    console.log("not a small straight");
                    $("#" + $(this).attr("data-out")).text("0");
                }
                break;
            case "40":
                if (testing.includes(1) && testing.includes(2) && testing.includes(3) && testing.includes(4) && testing.includes(5) ||
                    testing.includes(2) && testing.includes(3) && testing.includes(4) && testing.includes(5) && testing.includes(6)) {
                    console.log("large straight");
                    $("#" + $(this).attr("data-out")).text($(this).attr("data-score"));
                } else {
                    console.log("not a large straight");
                    $("#" + $(this).attr("data-out")).text("0");
                }
                break;
            case "50":
                if (testing.every((val) => val === testing[0])) {
                    console.log("score think its a yahtzee");
                    $("#" + $(this).attr("data-out")).text($(this).attr("data-score"));
                    game.oneYZ = true;
                } else {
                    console.log("score doesn't think it's a yahzee");
                    $("#" + $(this).attr("data-out")).text("0");
                }
                break;
            default:
                console.log("checkMe switch not working as expected");
        }
    } else {
        console.log("already saved");
    }
}

function checkBonusY() {
    if ($("#" + $(this).attr("data-out")).attr("data-saved") === "false") {
        game.stoppedCheck = true;
        var scoreArray = [].slice.call(document.querySelectorAll(".scoreValue"));

        scoreArray = scoreArray.filter((score) => score.dataset.saved === "false");

        scoreArray.forEach((score) => score.innerText = "0");

        $(".check").removeClass("check-down");
        $(this).addClass("check-down");

        game.lastScore = $(this).attr("data-out");

        let testing = game.dice.map((die) => die.value);
        var ones = testing.filter((num) => num === 1);
        var twos = testing.filter((num) => num === 2);
        var threes = testing.filter((num) => num === 3);
        var fours = testing.filter((num) => num === 4);
        var fives = testing.filter((num) => num === 5);
        var sixes = testing.filter((num) => num === 6);
        let groupArray = [ones, twos, threes, fours, fives, sixes];
        console.log(testing);
        console.log(ones);
        console.log(twos);
        console.log(threes);
        console.log(fours);
        console.log(fives);
        console.log(sixes);
        console.log(groupArray);

        console.log(testing[0] + "This is the value we would be checking in bonusyz")

        switch (this.dataset.score) {
            case "number":
                let target = parseFloat(this.dataset.number);
                let scores = game.dice.filter((die) => die.value === target).map((die) => die.value);
                console.log(scores)
                if (scores.length > 0) {
                    let totalScore = scores.reduce((amount, total) => amount + total)
                    console.log(totalScore)
                    $("#" + $(this).attr("data-out")).text(totalScore)
                } else {
                    console.log("No scores like that here");
                }
                break;

            case "kind":
                if (this.id === "checkKind3") {
                    var couldBe = groupArray.some(arr => arr.length >= 3)
                    if (couldBe) {
                        console.log("3 of a Kind");
                        $("#" + $(this).attr("data-out")).text(testing.reduce((amount, total) => amount + total));
                    } else {
                        console.log("not a 3 of a kind")
                        $("#" + $(this).attr("data-out")).text("0");
                    }
                } else {
                    var mightBe = groupArray.some(arr => arr.length >= 4);
                    if (mightBe) {
                        console.log("4 of a Kind");
                        $("#" + $(this).attr("data-out")).text(testing.reduce((amount, total) => amount + total));
                    } else {
                        console.log("not a 4 of a kind")
                        $("#" + $(this).attr("data-out")).text("0");
                    }
                }
                break;

            case "25":
                console.log("fullhouse");
                $("#" + $(this).attr("data-out")).text($(this).attr("data-score"));
                break;

            case "30":
                console.log("small straight")
                $("#" + $(this).attr("data-out")).text($(this).attr("data-score"));
                break;

            case "40":
                console.log("large straight");
                $("#" + $(this).attr("data-out")).text($(this).attr("data-score"));
                break;

            default:
                console.log("checkMeBonusY switch not working as expected");
        }

    }

}



