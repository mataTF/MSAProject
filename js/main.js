var file;
function getValue() {
    var userAccount = document.getElementById("userInput");
    function sendRedditRequest(file, callback) {
        $.ajax({
            url: "https://www.reddit.com/user/" + userAccount.value + "/comments/.json",
            type: "GET",
            data: file,
            processData: false
        })
            .done(function (data) {
            var length = data.data.children.length;
            //for(var i =0; i<length; i++){
            //console.log(data.data.children[i].data.body);
            //var comments = data.data.children[i].data.body.val;
            //analyze(comments);
            //}
            callback(data);
            //analyze(comments);
        });
    }
    sendRedditRequest(file, function (data) {
        //var comments = data.data.children[1].data.body;
        //console.log(comments);
        //analyze();
        var length = data.data.children.length;
        for (var i = 0; i < length; i++) {
            var temp = data.data.children[i].data.body;
            var results = results + temp;
        }
        analysis(results);
        //console.log(results);
    });
    //console.log(comments);
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
        var res = scores["65-100"];
        console.log(res);
    });
}
/*function analyze(){
    var form = new FormData();
    form.append("txt", "Hello there mate");

    function requestAnalysis(){
        $.ajax({
            url: "http://sentiment.vivekn.com/api/text/",
            method: "POST",
            mimeType: "multipart/form-data",
            data: form,
            processData: false
        })
        .done(function (data) {
                console.log("Done");
                console.log(data.result.sentiment);
                

            })
    }
    requestAnalysis();
}
analyze();*/ 
