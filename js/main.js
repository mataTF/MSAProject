var file;
var output = document.getElementById("textarea");
var feelsOutput = document.getElementById("feelsarea");
var gender = "neutral";
var sentiment = "none";
var sound = new Audio("audio/found.wav");
var sound2 = new Audio("audio/done.wav");
function getValue() {
    //Called when user clicks the button
    buttonColor();
    var userAccount = document.getElementById("userInput");
    output.innerHTML = "Analyzing Reddit account...";
    feelsOutput.innerHTML = "";
    $("#mgs").css("display", "none");
    function sendRedditRequest(file, callback) {
        //Request latest comments from a reddit user. User is defined by input from the textbox
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
                $("#mgs").css("display", "inline");
                $("#alien").attr("src", "images/reddit-oh.png");
                sound.play();
            }
        })
            .fail(function (error) {
            if (error.status == "404") {
                output.innerHTML = "User not found";
                $("#mgs").css("display", "inline");
                $("#alien").attr("src", "images/reddit-oh.png");
                sound.play();
            }
            else {
                output.innerHTML = "Try again soon";
                $("#mgs").css("display", "inline");
                $("#alien").attr("src", "images/reddit-oh.png");
                sound.play();
            }
            console.log(error.getAllResponseHeaders());
            $("button").attr("id", "button");
            $("button").css("background-color", "#69BE28");
        });
    }
    sendRedditRequest(file, function (data) {
        //Call request function and put all comment data into one big string for analysis
        var counter = 12;
        var length = data.data.children.length;
        if (length == 0) {
            output.innerHTML = "User has no comments";
            $("button").attr("id", "button");
            $("button").css("background-color", "#69BE28");
            $("#mgs").css("display", "inline");
            $("#alien").attr("src", "images/reddit-oh.png");
            sound.play();
            return;
        }
        else if (length < counter) {
            counter = data.data.children.length;
        }
        for (var i = 0; i < counter; i++) {
            var temp = data.data.children[i].data.body;
            var results = results + " " + temp;
        }
        analysis(results);
    });
}
;
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
        });
    }
    sendAgeRequest(file, function (data) {
        if (data.output.result == "male") {
            console.log("working");
            gender = "male";
        }
        else {
            console.log("working");
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
    console.log(sentiment);
    if (gender == "male") {
        ending = "guy";
    }
    else {
        ending = "girl";
    }
    output.innerHTML = "You write like " + ending;
    $("button").attr("id", "button");
    $("button").css("background-color", "#69BE28");
    sound2.play();
}
function feelsResult() {
    if (sentiment == "positive") {
        feelsOutput.innerHTML = "Feels Rating: POSITIVE";
        $("#alien").attr("src", "images/reddit.png");
    }
    else if (sentiment == "negative") {
        feelsOutput.innerHTML = "Feels Rating: NEGATIVE";
        $("#alien").attr("src", "images/reddit-sad.png");
    }
    else {
        feelsOutput.innerHTML = "Feels Rating: MEH";
        $("#alien").attr("src", "images/reddit-meh.png");
    }
}
//So you can press enter as well as clicking the button
$('#userInput').keypress(function (e) {
    if (e.which == 13) {
        getValue();
        e.preventDefault();
    }
});
function buttonColor() {
    $("button").attr("id", "buttonloading");
}
