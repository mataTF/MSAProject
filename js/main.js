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
            for (var i = 0; i < length; i++) {
                console.log(data.data.children[i].data.body);
            }
            //var comments = data.data.children[0].data.body.val;
            //analyze(comments);
        });
    }
    sendRedditRequest();
    //console.log(comments);
}
;
function analyze(text) {
    var form = new FormData();
    form.append("txt", text);
    function requestAnalysis() {
        $.ajax({
            url: "http://sentiment.vivekn.com/api/text/",
            type: "POST",
            mimeType: "multipart/form-data",
            data: form,
            processData: false
        })
            .done(function (data) {
            console.log("Done");
            console.log(data.result.sentiment);
        });
    }
}
