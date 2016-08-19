var tape = require("tape"),
    XMLHttpRequestPolyfill = require("..");


tape("XMLHttpRequestPolyfill() should create XMLHttpRequest without any errors", function(assert) {
    var xhr = new XMLHttpRequestPolyfill();

    xhr.open("GET", "/test", true);

    xhr.setRequestHeader("Content-Type", "application/json");

    assert.equals(xhr.getRequestHeader("Content-Type"), "application/json");
    assert.deepEquals(xhr.getRequestHeaders(), {
        "Content-Type": "application/json"
    });

    xhr.addEventListener("readystatechange", function(e) {
        assert.equals(e.type, "readystatechange");
    });

    xhr.addEventListener("progress", function(e) {
        assert.equals(e.type, "progress");
    });

    xhr.addEventListener("loadstart", function(e) {
        assert.equals(e.type, "loadstart");
    });

    xhr.addEventListener("load", function(e) {
        assert.equals(e.type, "load");
    });

    xhr.addEventListener("loadend", function() {
        assert.equals(xhr.status, 404);
        assert.end();
    });

    xhr.send(null);
});
