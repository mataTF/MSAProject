var file;
var output = document.getElementById("textarea");
var feelsOutput = document.getElementById("feelsarea");
var gender = "neutral";
var sentiment = "none";
var soundError = new Audio("audio/error.wav");
var soundPositive = new Audio("audio/pos.wav");
var soundNegative = new Audio("audio/neg.wav");
var soundNeutral = new Audio("audio/neu.wav");
var soundAlert = new Audio("audio/alert.wav");
function getValue() {
    var userAccount = document.getElementById("userInput");
    buttonColor();
    output.innerHTML = "Analyzing Reddit account..."; //Reset outputs
    feelsOutput.innerHTML = "";
    //Request latest comments from a reddit user. User is defined by input from the textbox
    function sendRedditRequest(file, callback) {
        $.ajax({
            url: "https://www.reddit.com/user/" + userAccount.value + "/comments/.json",
            type: "GET",
            data: file,
            processData: false
        })
            .done(function (data) {
            if (data.length != 0) {
                callback(data);
            }
            else {
                output.innerHTML = "Try again soon";
                errorUI();
            }
        })
            .fail(function (error) {
            //So the user knows if a user doesnt exist
            if (error.status == "404") {
                output.innerHTML = "User not found";
            }
            else {
                output.innerHTML = "Try again soon";
            }
            console.log(error.getAllResponseHeaders());
            errorUI();
        });
    }
    //Call request function and put all comment data into one big string for analysis
    sendRedditRequest(file, function (data) {
        var counter = 12;
        var length = data.data.children.length;
        //Just incase the user has less than 12 comments or no comments at all
        if (length == 0) {
            output.innerHTML = "User has no comments";
            errorUI();
            return;
        }
        else if (userAccount.value == "Snake" || userAccount.value == "snake") {
            $("button").attr("id", "button");
            $("button").css("background-color", "#ff0000");
            $("#alien").attr("src", "images/mgs.png");
            output.innerHTML = "Have at you Snake!";
            console.log("What was that noise?");
            soundAlert.play();
            return;
        }
        else if (length < counter) {
            counter = data.data.children.length;
        }
        //Concatenates comments into one big string
        for (var i = 0; i < counter; i++) {
            var temp = data.data.children[i].data.body;
            var results = results + " " + temp;
        }
        analysis(results);
    });
}
;
//Sends passed in string to sentiment and gender analysis APIs
function analysis(param) {
    function sendAgeRequest(file, callback) {
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
        };
        $.ajax(settings).done(function (response) {
            callback(response);
        })
            .fail(function (error) {
            output.innerHTML = "Try again soon";
            console.log(error.getAllResponseHeaders());
            errorUI();
        });
    }
    sendAgeRequest(file, function (data) {
        if (data.output.result == "male") {
            gender = "male";
        }
        else {
            gender = "female";
        }
    });
    function sendSentimentRequest(file, callback) {
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
        };
        $.ajax(settings).done(function (response) {
            callback(response);
        })
            .fail(function (error) {
            output.innerHTML = "Try again soon";
            errorUI();
            console.log(error.getAllResponseHeaders());
        });
    }
    sendSentimentRequest(file, function (data) {
        if (data.output.result == "positive") {
            sentiment = "positive";
        }
        else if (data.output.result == "negative") {
            sentiment = "negative";
        }
        else {
            sentiment = "neutral";
        }
        writeResult();
        feelsResult();
    });
}
function writeResult() {
    var ending = "";
    if (gender == "male") {
        ending = "MALE";
    }
    else {
        ending = "FEMALE";
    }
    output.innerHTML = "You write like a " + ending;
    $("button").attr("id", "button");
    $("button").css("background-color", "#69BE28");
}
function feelsResult() {
    if (sentiment == "positive") {
        feelsOutput.innerHTML = "Feels Rating: POSITIVE";
        $("#alien").attr("src", "images/reddit.png");
        soundPositive.play();
    }
    else if (sentiment == "negative") {
        feelsOutput.innerHTML = "Feels Rating: NEGATIVE";
        $("#alien").attr("src", "images/reddit-sad.png");
        soundNegative.play();
    }
    else {
        feelsOutput.innerHTML = "Feels Rating: MEH";
        $("#alien").attr("src", "images/reddit-meh.png");
        soundNeutral.play();
    }
}
//So user can press enter instead of clicking button
$('#userInput').keypress(function (e) {
    if (e.which == 13) {
        getValue();
        e.preventDefault();
    }
});
//Makes button pulse while waiting for results
function buttonColor() {
    $("button").attr("id", "buttonloading");
}
//Actions when an error occurs
function errorUI() {
    $("#alien").attr("src", "images/error.png");
    soundError.play();
    $("button").attr("id", "button");
    $("button").css("background-color", "#ff0000");
}
