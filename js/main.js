var file;
var output = document.getElementById("textarea");
var gender = "neutral";
function getValue() {
    //Called when user clicks the button
    var userAccount = document.getElementById("userInput");
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
            }
        })
            .fail(function (error) {
            output.innerHTML = "Try again soon";
            console.log(error.getAllResponseHeaders());
        });
    }
    sendRedditRequest(file, function (data) {
        //Call request function and put all comment data into one big string for analysis
        //var length = data.data.children.length;
        for (var i = 0; i < 10; i++) {
            var temp = data.data.children[i].data.body;
            var results = results + " " + temp;
        }
        analysis(results);
    });
}
;
function analysis(param) {
    function sendAgeRequest(file, callback) {
        //May be better to use POST
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "http://api.datumbox.com/1.0/GenderDetection.json?api_key=dfd1797a759929a7a7a7b23970f18c44",
            "method": "POST",
            "headers": {
                "content-type": "application/x-www-form-urlencoded"
            },
            "data": {
                "text": param
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
    writeResult();
}
function writeResult() {
    //output.innerHTML = "You write like " + ageGroup;
    var ending = "";
    var img = $("#image")[0];
    if (gender == "male") {
        ending = "Guy";
    }
    else {
        ending = "Girl";
    }
    output.innerHTML = "You write like " + ending;
}
//So you can press enter as well as clicking the button
$('#userInput').keypress(function (e) {
    if (e.which == 13) {
        getValue();
        e.preventDefault();
    }
});
