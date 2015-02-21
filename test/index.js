var XMLHttpRequestPolyfill = require("../src/index");


var xhr = new XMLHttpRequestPolyfill();


xhr.addEventListener("load", function(e) {
    console.log(e, xhr);
});

xhr.open("GET", "index.html", true);

xhr.setRequestHeader("Content-Type", "text/html");

xhr.send();
