var extend = require("extend"),
    environment = require("environment"),
    emptyFunction = require("empty_function"),
    createXMLHttpRequest = require("./createXMLHttpRequest");


var window = environment.window,

    Uint8Array = window.Uint8Array || Array,

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


if (!XMLHttpRequestPolyfillPrototype.addEventListener || !XMLHttpRequestPolyfillPrototype.attachEvent) {
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
        var length = str.length,
            ui8 = new Uint8Array(length),
            i = -1,
            il = length - 1;

        while (i++ < il) {
            ui8[i] = str.charCodeAt(i) & 0xff;
        }

        return this.send(ui8);
    };
}


module.exports = XMLHttpRequestPolyfill;
