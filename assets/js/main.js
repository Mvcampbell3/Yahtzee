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
    dice: [die1, die2, die3, die4, die5],

    roll: function () {
        if (game.rollCount > 0) {
            game.rollCount--;
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
            console.log("You sonofabitch!!!")
        }

    },

    clear: function () {
        game.rollCount = 3;
        game.dice.forEach((die) => {
            die.blank();
            die.hold = true;
            die.holdFunction();
        })
    },
} // End of Game Object

$(".rollBtn").on("click", game.roll);
$(".clearBtn").on("click", game.clear);

game.dice.forEach((die) => die.blank());

// This may be added to the actual game object later, I am not sure
// Could even make it it's own object, or have it live out in the wild like this.

$(".check").on("click", checkMe);

function checkMe() {
    if ($(".scoreValue").attr("data-saved") === "false") {
        $(".scoreValue").text("0");
    }
    // if (this.dataset.score === "number") {
    //     let target = parseFloat(this.dataset.number);
    //     let scores = game.dice.filter((die) => die.value === target).map((die) => die.value);
    //     console.log(scores)
    //     if (scores.length > 0) {
    //         let totalScore = scores.reduce((amount, total) => amount + total)
    //         console.log(totalScore)
    //         $("#" + $(this).attr("data-out")).text(totalScore)
    //     } else {
    //         console.log("No scores like that here");
    //     }
    // }
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
            let totalNumber = game.dice.map((die)=>die.value);
            console.log(totalNumber);
            if (totalNumber.length === 5) {
                totalNumber = totalNumber.reduce((amount, total) => amount + total);
                console.log(totalNumber)
                $("#" + $(this).attr("data-out")).text(totalNumber)
            };
            break;
        case "kind3":
            let testing = game.dice.map((die) => die.value);
            console.log(testing);
            var ones = testing.filter((num)=> num === 1);
            var twos = testing.filter((num)=> num === 2);
            var threes = testing.filter((num)=> num === 3);
            var fours = testing.filter((num)=> num === 4);
            var fives = testing.filter((num)=> num === 5);
            var sixes = testing.filter((num)=> num === 6);
            console.log(ones);
            console.log(twos);
            console.log(threes);
            console.log(fours);
            console.log(fives);
            console.log(sixes);
            if (this.id === "checkKind3") {
                if (ones.length >= 3 || twos.length >= 3 || threes.length >= 3 || fours.length >= 3 || fives.length >= 3 || sixes.length >= 3) {
                    console.log("Three of a kind")
                    $("#"+$(this).attr("data-out")).text(testing.reduce((amount, total) => amount + total));
                }
            }
            break;
        default:
            console.log("checkMe switch not working as expected");
    }
}





