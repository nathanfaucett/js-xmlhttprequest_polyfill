var assert = require("assert"),
    XMLHttpRequestPolyfill = require("../src/index");


describe("XMLHttpRequestPolyfill", function() {
    it("should create XMLHttpRequest without any errors", function() {
        var xhr = new XMLHttpRequestPolyfill();
        assert(xhr);
    });
});
