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

    xhr.addEventListener("load", function() {
        assert.equals(xhr.status, 404);
        assert.end();
    });

    xhr.send(null);
});
