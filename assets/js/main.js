function Dice(url, id, holdId) {
    this.url = url;
    this.id = id;
    this.holdId = holdId;
    this.hold = false;
    this.holdFunction = function(){
        if (this.hold) {
            $("#"+ this.holdId).attr("class", "hold open").text("Hold");
            this.hold = false;
        } else {
            $("#"+ this.holdId).attr("class", "hold closed").text("Unhold");
            this.hold = true;
        }
    };

    this.rollCount = 3;

    this.setHold = $("#"+this.holdId).on("click", this.holdFunction.bind(this));
    

    this.background = function(number) {
        $("#"+this.id).css("background-image", "url(assets/images/"+number+".jpg)")
    }

    this.blank = function(){
        console.log("running");
        console.log(this.id)
        $("#"+this.id).css("background-image", "url(assets/images/Blankdie.jpg)")
    }

}

let die1 = new Dice("../images/Blankdie.jpg", "die1", "hold1")
let die2 = new Dice("../images/Blankdie.jpg", "die2", "hold2")
let die3 = new Dice("../images/Blankdie.jpg", "die3", "hold3")
let die4 = new Dice("../images/Blankdie.jpg", "die4", "hold4")
let die5 = new Dice("../images/Blankdie.jpg", "die5", "hold5")


