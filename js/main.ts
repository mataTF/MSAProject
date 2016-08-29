var file;
var output : HTMLParagraphElement = <HTMLParagraphElement> document.getElementById("textarea");
var gender: string = "neutral";
var sentiment: string = "none";

function getValue(){
    //Called when user clicks the button
    var userAccount : HTMLInputElement = <HTMLInputElement> document.getElementById("userInput");

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
            }
        })
        .fail(function (error) {
            output.innerHTML = "Try again soon";
            console.log(error.getAllResponseHeaders());
});
    }

    sendRedditRequest(file,function(data){
        //Call request function and put all comment data into one big string for analysis
        
        //var length = data.data.children.length;
        for(var i = 0; i<10; i++){
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
    }); 
}

function writeResult() {
    var ending: string = "";
    var img : HTMLImageElement = <HTMLImageElement> $("#image")[0];
    console.log(sentiment);
    if(gender == "male"){
        if(sentiment == "positive"){
            ending = "positive man";
        }
        else if(sentiment == "negative"){
            ending = "negative guy";
        }
        else{
            ending = ending = "Guy";
            console.log("worked but neutral");
        }
    }
    else
    {
        if(sentiment == "positive"){
            ending = "positive lass";
        }
        else if(sentiment == "negative"){
            ending = "negative female";
        }
        else{
            ending = ending = "Girl";
            console.log("worked but neutral");
        }
    }

    output.innerHTML = "You write like " + ending;
}
//So you can press enter as well as clicking the button
$('#userInput').keypress(function(e) {
    if (e.which == 13) {
        getValue();
        e.preventDefault();
    }
});