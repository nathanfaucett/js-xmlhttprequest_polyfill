xmlhttprequest_polyfill
=======

xmlhttprequest polyfill for the browser

```javascript
var XMLHttpRequestPolyfill = require("@nathanfaucett/xmlhttprequest_polyfill");


var xhr = new XMLHttpRequestPolyfill();


xhr.open("GET", "/test", true);

xhr.setRequestHeader("Content-Type", "application/json");

xhr.getRequestHeader("Content-Type") === "application/json";
xhr.getRequestHeaders() === {
    "Content-Type": "application/json"
};

xhr.addEventListener("readystatechange", function(e) {
    e.type === "readystatechange";
});
xhr.addEventListener("progress", function(e) {
    e.type === "progress";
});
xhr.addEventListener("loadstart", function(e) {
    e.type === "loadstart";
});
xhr.addEventListener("load", function(e) {
    e.type === "load";
});
xhr.addEventListener("loadend", function() {
    xhr.status === 404;
});

xhr.send(null);
```
