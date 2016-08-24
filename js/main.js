var file;
var output = document.getElementById("textarea");
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
            callback(data);
        });
    }
    sendRedditRequest(file, function (data) {
        //Call request function and put all comment data into one big string for analysis
        var length = data.data.children.length;
        for (var i = 0; i < length; i++) {
            var temp = data.data.children[i].data.body;
            var results = results + " " + temp;
        }
        analysis(results);
        console.log(results);
    });
}
;
function analysis(param) {
    function sendUclassifyRequest(file, callback) {
        $.ajax({
            url: "https://api.uclassify.com/v1/uclassify/ageanalyzer/Classify?readkey=FWCr4N9FAiiD&text=" + param,
            type: "GET",
            data: file,
            processData: false
        })
            .done(function (data) {
            callback(data);
        });
    }
    sendUclassifyRequest(file, function (scores) {
        //Shitty sort method
        var g1 = scores["13-17"];
        var g2 = scores["18-25"];
        var g3 = scores["26-35"];
        var g4 = scores["36-50"];
        var g5 = scores["51-65"];
        var g6 = scores["65-100"];
        var array = [g1, g2, g3, g4, g5, g6];
        var biggest = Math.max.apply(Math, array);
        console.log(biggest);
        switch (biggest) {
            case g1:
                output.innerHTML = "You are 13-17";
                break;
            case g2:
                output.innerHTML = "you are 18-25";
                break;
            case g3:
                console.log("you are 26-35");
                break;
            case g4:
                output.innerHTML = "you are 36-50";
                break;
            case g5:
                output.innerHTML = "you are 51-65";
                break;
            case g6:
                output.innerHTML = "you are 65-100";
                break;
            default:
                console.log("bung");
        }
    });
}
