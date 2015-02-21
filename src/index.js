var extend = require("extend"),
    emptyFunction = require("empty_function"),
    environment = require("environment");


var window = environment.window,

    ActiveXObject = window.ActiveXObject,

    XMLHttpRequestPolyfill = (
        window.XMLHttpRequest ||
        (function getRequestType(types) {
            var i = -1,
                il = types.length - 1,
                instance, type;

            while (i++ < il) {
                try {
                    type = types[i];
                    instance = type();
                    break;
                } catch (e) {}
            }

            if (!type) {
                throw new Error("XMLHttpRequest not supported by this browser");
            }

            return function XMLHttpRequest() {
                return type();
            };
        }([
            function createActiveObject() {
                return new ActiveXObject("Msxml2.XMLHTTP");
            },
            function createActiveObject() {
                return new ActiveXObject("Msxml3.XMLHTTP");
            },
            function createActiveObject() {
                return new ActiveXObject("Microsoft.XMLHTTP");
            }
        ]))
    );


XMLHttpRequestPolyfill.prototype.nativeSetRequestHeader = XMLHttpRequestPolyfill.prototype.setRequestHeader || emptyFunction;

XMLHttpRequestPolyfill.prototype.setRequestHeader = function setRequestHeader(key, value) {
    (this.__requestHeaders__ || (this.__requestHeaders__ = {}))[key] = value;
    return this.nativeSetRequestHeader(key, value);
};

XMLHttpRequestPolyfill.prototype.getRequestHeader = function getRequestHeader(key) {
    return (this.__requestHeaders__ || (this.__requestHeaders__ = {}))[key];
};

XMLHttpRequestPolyfill.prototype.getRequestHeaders = function getRequestHeaders() {
    return extend({}, this.__requestHeaders__);
};


module.exports = XMLHttpRequestPolyfill;
