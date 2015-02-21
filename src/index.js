var indexOf = require("index_of"),
    extend = require("extend"),
    isFunction = require("is_function"),
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

            return createXMLHttpRequestFactory(type);
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

function createXMLHttpRequestFactory(createXMLHttpRequest) {

    function XMLHttpRequest() {
        var xhr = createXMLHttpRequest();

        function onreadystatechange(e) {
            var statusCode = +xhr.status,
                readyState = +xhr.readyState;

            xhr.dispatchEvent("readystatechange", e);
            xhr.dispatchEvent("progress", e);

            if (readyState === 4) {
                if ((statusCode > 199 && statusCode < 301) || statusCode === 304) {
                    xhr.dispatchEvent("load", e);
                } else {
                    xhr.dispatchEvent("error", e);
                }
            }
        }

        if (isFunction(xhr.attachEvent)) {
            xhr.attachEvent("onreadystatechange", onreadystatechange, true);
        } else {
            xhr.onreadystatechange = onreadystatechange;
        }

        xhr.setRequestHeader = emptyFunction;
        xhr.addEventListener = addEventListener;
        xhr.removeEventListener = removeEventListener;
        xhr.dispatchEvent = dispatchEvent;

        return xhr;
    }

    XMLHttpRequest.prototype = XMLHttpRequestPolyfill.prototype;
    XMLHttpRequest.prototype.constructor = XMLHttpRequest;

    return XMLHttpRequest;
}

function addEventListener(name, fn) {
    var events = this.__events__ || (this.__events__ = {}),
        eventList = events[name] || (events[name] = []);

    if (isFunction(fn)) {
        eventList[eventList.length] = fn;
    }
}

function removeEventListener(name, fn) {
    var events = this.__events__ || (this.__events__ = {}),
        eventList = events[name] || (events[name] = []),
        index = indexOf(eventList, fn);

    if (index !== -1) {
        eventList.splice(index, 1);
    }
}

function dispatchEvent(name, e) {
    var events = this.__events__ || (this.__events__ = {}),
        eventList = events[name] || (events[name] = []),
        i = -1,
        length = eventList.length - 1,
        event;

    while (i++ < length) {
        event.call(this, e);
    }
}

XMLHttpRequestPolyfill.prototype.nativeSetRequestHeader = XMLHttpRequestPolyfill.prototype.setRequestHeader;

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
