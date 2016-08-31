var file;
var output : HTMLParagraphElement = <HTMLParagraphElement> document.getElementById("textarea");
var feelsOutput : HTMLParagraphElement = <HTMLParagraphElement> document.getElementById("feelsarea");
var gender: string = "neutral";
var sentiment: string = "none";
var soundError = new Audio("audio/error.wav");
var soundPositive = new Audio("audio/pos.wav");
var soundNegative = new Audio("audio/neg.wav");
var soundNeutral = new Audio("audio/neu.wav");
var soundAlert = new Audio("audio/alert.wav");

function getValue(){

    var userAccount : HTMLInputElement = <HTMLInputElement> document.getElementById("userInput");
    buttonColor();
    output.innerHTML = "Analyzing Reddit account...";
    feelsOutput.innerHTML = "";

    //Called when user clicks the button

    function sendRedditRequest(file, callback) : void {
        //Request latest comments from a reddit user. User is defined by input from the textbox
        $.ajax({
            url: "https://www.reddit.com/user/"+ userAccount.value + "/comments/.json",
            type: "GET",
            data: file,
            processData: false
        })
        .done(function (data) {
            if(data.length != 0){
                callback(data);
            }
            else {
                output.innerHTML = "Try again soon";
                $("#alien").attr("src","images/mgs.png");
                soundError.play();
            }
        })
        .fail(function (error) {
            if(error.status == "404"){
                output.innerHTML = "User not found";
                $("#alien").attr("src","images/mgs.png");
                soundError.play();

            }
            else {
                output.innerHTML = "Try again soon";
                $("#alien").attr("src","images/mgs.png");
                soundError.play();
            }
            console.log(error.getAllResponseHeaders());
            $("button").attr("id","button");
            $("button").css("background-color","#ff0000");
});
    }

    sendRedditRequest(file,function(data){
        //Call request function and put all comment data into one big string for analysis
        var counter: number = 12;
        var length: number = data.data.children.length;
        if(length == 0){                                    //just incase the user has less than 12 comments or no comments at all
            output.innerHTML = "User has no comments";

            $("button").attr("id","button");
            $("button").css("background-color","#ff0000");
            $("#alien").attr("src","images/mgs.png");
            soundError.play();
            return;            
        }
        else if(length<counter){
            counter = data.data.children.length;
        }

        for(var i = 0; i<counter; i++){
                var temp: string = data.data.children[i].data.body;
                var results: string = results + " " + temp;
                }

        analysis(results);
    });
};

function analysis(param){

    function sendAgeRequest(file, callback) : void {

        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "http://api.datumbox.com/1.0/GenderDetection.json",
            "method": "POST",
            "headers": {
                "content-type": "application/x-www-form-urlencoded"
            },
            "data": {
                "text": param,
                "api_key": "dfd1797a759929a7a7a7b23970f18c44"
            }
        }

$.ajax(settings).done(function (response) {
  callback(response);
});
    }
    sendAgeRequest(file, function(data){
        
        if(data.output.result == "male"){
            console.log("working");
            gender = "male";
        }
        else{
            console.log("working");
            gender = "female";
        }

        }
    );  
        
function sendSentimentRequest(file, callback) : void {

        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "http://api.datumbox.com/1.0/SentimentAnalysis.json",
            "method": "POST",
            "headers": {
                "content-type": "application/x-www-form-urlencoded"
            },
            "data": {
                "text": param,
                "api_key": "dfd1797a759929a7a7a7b23970f18c44"
            }
        }

$.ajax(settings).done(function (response) {
  callback(response);
});
    }
    sendSentimentRequest(file, function(data){
        
        if(data.output.result == "positive"){
            sentiment = "positive";
        }
        else if(data.output.result == "negative")
        {
            sentiment = "negative";
        }
        else{
            sentiment = "neutral";
        }
        
        writeResult();
        feelsResult();
        
    }); 
}

function writeResult() {
    var ending: string = "";

    console.log(sentiment);
    if(gender == "male"){
        
        ending = "MALE";
    }
    else
    {
        ending = "FEMALE";
    }

    output.innerHTML = "You write like a " + ending;
    $("button").attr("id","button");
    $("button").css("background-color","#69BE28");
}

function feelsResult(){
    if(sentiment == "positive"){
        feelsOutput.innerHTML = "Feels Rating: POSITIVE";
        $("#alien").attr("src","images/reddit.png");
        soundPositive.play();
    }
    else if(sentiment == "negative"){
        feelsOutput.innerHTML = "Feels Rating: NEGATIVE";
        $("#alien").attr("src","images/reddit-sad.png");
        soundNegative.play();
    }
    else{
        feelsOutput.innerHTML = "Feels Rating: MEH";
        $("#alien").attr("src","images/reddit-meh.png");
        soundNeutral.play();
    }

}

//So you can press enter as well as clicking the button
$('#userInput').keypress(function(e) {
    if (e.which == 13) {
        getValue();
        e.preventDefault();
    }
});

function buttonColor(){
    $("button").attr("id","buttonloading");
}