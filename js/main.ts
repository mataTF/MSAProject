var file;
var output : HTMLParagraphElement = <HTMLParagraphElement> document.getElementById("textarea");
var gender: string = "neutral";
var ageGroup: string = "none";

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
        console.log(results);
    });
};

function analysis(param){

    function sendAgeRequest(file, callback) : void {
        //May be better to use POST
        $.ajax({
            url: "https://api.uclassify.com/v1/uclassify/ageanalyzer/Classify?readkey=FWCr4N9FAiiD&text=" + param,
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
    sendAgeRequest(file, function(scores){
        //Shitty sort method
        var g1: number = scores["13-17"];
        var g2: number = scores["18-25"];
        var g3: number = scores["26-35"];
        var g4: number = scores["36-50"];
        var g5: number = scores["51-65"];
        var g6: number = scores["65-100"];

        var array: number [] = [g1,g2,g3,g4,g5,g6];
        var biggest: number = Math.max.apply(Math, array);
        //console.log(biggest);
        switch(biggest){
            case g1:
                //writeResult("a Child");     //13-17
                ageGroup = "13-17";
                break;
            case g2:
                //writeResult("a 18-25 year old");     //18-25
                ageGroup = "18-25";
                break;
            case g3:
                //writeResult("a 26-35 year old");     //26-35
                ageGroup = "26-35";
                break;
            case g4:
                //writeResult("a Middle aged person");     //36-50
                ageGroup = "36-50";
                break;
            case g5:
                //writeResult("You are approaching retirement");     //51-65
                ageGroup = "51-65";
                break;
            case g6:
                //writeResult("a Senior citizen");
                ageGroup = "65-100";
                break;
            default:
                console.log("bung");
        }
    });

    function sendGenderRequest(file, callback) : void {
        //May be better to use POST
        $.ajax({
            url: "https://api.uclassify.com/v1/uclassify/genderanalyzer_v5/Classify?readkey=FWCr4N9FAiiD&text=" + param,
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
    sendGenderRequest(file, function(scores){
        //console.log(scores);
        var male: number = scores["male"];
        var female: number = scores["female"];
        var array: number [] = [male, female];
        var biggest: number = Math.max.apply(Math, array);
        
        switch(biggest){
            case male:
                gender = "male";
                break;
            case female:
                gender = "female";
                break;
            default:
                console.log("Bung genderreq");
        }
        writeResult();
    })  
}

function writeResult() {
    //output.innerHTML = "You write like " + ageGroup;
    console.log(gender);
    console.log(ageGroup);
    var ending: string = "";
    var img : HTMLImageElement = <HTMLImageElement> $("#image")[0];

    if(gender === "male"){
        switch(ageGroup){
            case "13-17":
                ending = "a little boy" ;
                break;
            case "18-25":
                ending = "an 18-25 year old man";
                break;
            case "26-35":
                ending = "a 26-35 year old man";
                break;
            case "36-50":
                ending = "a 36-50 year old man";
                break;
            case "51-65":
                ending = "an old man approaching retirement";
                break;
            case "65-100":
                ending = "an elderly man";
                break;
            default:
                console.log("bung writesresult male");
        }
    }
    else {
        switch(ageGroup) {
            case "13-17":
                ending = "a little girl" ;
                break;
            case "18-25":
                ending = "an 18-25 year old woman";
                break;
            case "26-35":
                ending = "a 26-35 year old woman";
                break;
            case "36-50":
                ending = "a 36-50 year old woman";
                break;
            case "51-65":
                ending = "an old woman approaching retirement";
                break;
            case "65-100":
                ending = "an elderly lady";
                //img.src = "https://imgflip.com/s/meme/Grandma-Finds-The-Internet.jpg";
                //img.style.display = "block";
                break;
            default:
                console.log("bung writeresult else");
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