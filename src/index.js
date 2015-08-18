var extend = require("extend"),
    environment = require("environment"),
    emptyFunction = require("empty_function"),
    createXMLHttpRequest = require("./createXMLHttpRequest"),
    toUint8Array = require("./toUint8Array");


var window = environment.window,

    NativeXMLHttpRequest = window.XMLHttpRequest,
    NativeActiveXObject = window.ActiveXObject,

    XMLHttpRequestPolyfill = (
        NativeXMLHttpRequest ||
        (function getRequestObject(types) {
            var i = -1,
                il = types.length - 1,
                instance, type;

            while (i++ < il) {
                try {
                    type = types[i];
                    instance = new NativeActiveXObject(type);
                    break;
                } catch (e) {}
                type = null;
            }

            if (!type) {
                throw new Error("XMLHttpRequest not supported by this browser");
            }

            return createXMLHttpRequest(function createNativeObject() {
                return new NativeActiveXObject(type);
            });
        }([
            "Msxml2.XMLHTTP",
            "Msxml3.XMLHTTP",
            "Microsoft.XMLHTTP"
        ]))
    ),

    XMLHttpRequestPolyfillPrototype = XMLHttpRequestPolyfill.prototype;


if (!(XMLHttpRequestPolyfillPrototype.addEventListener || XMLHttpRequestPolyfillPrototype.attachEvent)) {
    XMLHttpRequestPolyfill = createXMLHttpRequest(function createNativeObject() {
        return new NativeXMLHttpRequest();
    });
    XMLHttpRequestPolyfillPrototype = XMLHttpRequestPolyfill.prototype;
}

XMLHttpRequestPolyfillPrototype.nativeSetRequestHeader = XMLHttpRequestPolyfillPrototype.setRequestHeader || emptyFunction;

XMLHttpRequestPolyfillPrototype.setRequestHeader = function(key, value) {
    (this.__requestHeaders || (this.__requestHeaders = {}))[key] = value;
    this.nativeSetRequestHeader(key, value);
};

XMLHttpRequestPolyfillPrototype.getRequestHeader = function(key) {
    return (this.__requestHeaders || (this.__requestHeaders = {}))[key];
};

XMLHttpRequestPolyfillPrototype.getRequestHeaders = function() {
    return extend({}, this.__requestHeaders);
};

if (!XMLHttpRequestPolyfillPrototype.setTimeout) {
    XMLHttpRequestPolyfillPrototype.setTimeout = function(ms) {
        this.timeout = ms;
    };
}

if (!XMLHttpRequestPolyfillPrototype.setWithCredentials) {
    XMLHttpRequestPolyfillPrototype.setWithCredentials = function(value) {
        this.withCredentials = !!value;
    };
}

if (!XMLHttpRequestPolyfillPrototype.sendAsBinary) {
    XMLHttpRequestPolyfillPrototype.sendAsBinary = function(str) {
        return this.send(toUint8Array(str));
    };
}


module.exports = XMLHttpRequestPolyfill;
