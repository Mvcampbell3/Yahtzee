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
                    console.log("ran through timer");
                    game.dice.forEach((die) => $("#" + die.id).css("opacity", "1.0"));

                } else {
                    count++;

                    game.dice.forEach((die) => {
                        if (!die.hold) {
                            $("#" + die.id).css("opacity", "0.5");
                            let num = Math.floor((Math.random() * 6) + 1);
                            die.background(num);
                        }

                    })
                }
            }, 100)
        }
    },

    clear: function () {
        game.rollCount = 3;
        game.dice.forEach((die) => {
            die.blank();
            die.hold = true;
            die.holdFunction();
        })
    }


}

$(".rollBtn").on("click", game.roll);
$(".clearBtn").on("click", game.clear);


