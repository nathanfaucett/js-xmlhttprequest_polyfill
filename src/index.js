var extend = require("extend"),
    environment = require("environment");


var window = environment.window,

    ActiveXObject = window.ActiveXObject,

    XMLHttpRequestPolyfill = (
        window.XMLHttpRequest ||
        (function getRequestObjectType(types) {
            var i = -1,
                il = types.length - 1,
                instance, createType;

            while (i++ < il) {
                try {
                    createType = types[i];
                    instance = createType();
                    break;
                } catch (e) {}
            }

            if (!createType) {
                throw new Error("XMLHttpRequest not supported by this browser");
            }

            return function XMLHttpRequest() {
                return createType();
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
    ),

    XMLHttpRequestPolyfillPrototype = XMLHttpRequestPolyfill.prototype;


if (XMLHttpRequestPolyfillPrototype.setRequestHeader) {
    XMLHttpRequestPolyfillPrototype.nativeSetRequestHeader = XMLHttpRequestPolyfillPrototype.setRequestHeader;

    XMLHttpRequestPolyfillPrototype.setRequestHeader = function setRequestHeader(key, value) {
        (this.__requestHeaders__ || (this.__requestHeaders__ = {}))[key] = value;
        return this.nativeSetRequestHeader(key, value);
    };
}

XMLHttpRequestPolyfillPrototype.getRequestHeader = function getRequestHeader(key) {
    return (this.__requestHeaders__ || (this.__requestHeaders__ = {}))[key];
};

XMLHttpRequestPolyfillPrototype.getRequestHeaders = function getRequestHeaders() {
    return extend({}, this.__requestHeaders__);
};


module.exports = XMLHttpRequestPolyfill;
