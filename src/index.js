var extend = require("@nathanfaucett/extend"),
    EventEmitter = require("@nathanfaucett/event_emitter"),
    EventPolyfill = require("./EventPolyfill"),
    ProgressEventPolyfill = require("./ProgressEventPolyfill"),
    tryCallFunction = require("./tryCallFunction"),
    trySetValue = require("./trySetValue"),
    emitEvent = require("./emitEvent"),
    toUint8Array = require("./toUint8Array"),
    createNativeXMLHttpRequest = require("./createNativeXMLHttpRequest");


var hasNativeProgress = false,
    XMLHttpRequestPolyfillPrototype;


module.exports = XMLHttpRequestPolyfill;


function XMLHttpRequestPolyfill(options) {
    var _this = this,
        nativeXMLHttpRequest = createNativeXMLHttpRequest(options || {});

    EventEmitter.call(this, -1);

    this.__requestHeaders = {};
    this.__nativeXMLHttpRequest = nativeXMLHttpRequest;

    this.onabort = null;
    this.onerror = null;
    this.onload = null;
    this.onloadend = null;
    this.onloadstart = null;
    this.onprogress = null;
    this.onreadystatechange = null;
    this.ontimeout = null;

    this.readyState = 0;
    this.response = "";
    this.responseText = "";
    this.responseType = "";
    this.responseURL = "";
    this.responseXML = null;
    this.status = 0;
    this.statusText = "";
    this.timeout = 0;
    this.withCredentials = false;

    nativeXMLHttpRequest.onreadystatechange = function(e) {
        return XMLHttpRequestPolyfill_onReadyStateChange(_this, e || {});
    };

    nativeXMLHttpRequest.ontimeout = function(e) {
        emitEvent(_this, "timeout", new EventPolyfill("timeout", e || {}));
    };

    nativeXMLHttpRequest.onerror = function(e) {
        emitEvent(_this, "error", new EventPolyfill("error", e || {}));
    };

    if ("onprogress" in nativeXMLHttpRequest) {
        hasNativeProgress = true;
        nativeXMLHttpRequest.onprogress = function(e) {
            emitEvent(_this, "progress", new ProgressEventPolyfill("progress", e || {}));
        };
    }
}
EventEmitter.extend(XMLHttpRequestPolyfill);
XMLHttpRequestPolyfillPrototype = XMLHttpRequestPolyfill.prototype;


function XMLHttpRequestPolyfill_onReadyStateChange(_this, e) {
    var nativeXMLHttpRequest = _this.__nativeXMLHttpRequest,
        response;

    _this.status = nativeXMLHttpRequest.status || 0;
    _this.statusText = nativeXMLHttpRequest.statusText || "";
    _this.readyState = nativeXMLHttpRequest.readyState;

    switch (nativeXMLHttpRequest.readyState) {
        case 1:
            emitEvent(_this, "loadstart", new EventPolyfill("loadstart", e));
            break;
        case 3:
            XMLHttpRequestPolyfill_onProgress(_this, e);
            break;
        case 4:
            response = nativeXMLHttpRequest.response || "";

            _this.response = response;

            if (nativeXMLHttpRequest.responseType !== "arraybuffer") {
                _this.responseText = nativeXMLHttpRequest.responseText || response;
                _this.responseXML = nativeXMLHttpRequest.responseXML || response;
            } else {
                _this.responseText = "";
                _this.responseXML = "";
            }

            _this.responseType = nativeXMLHttpRequest.responseType || "";
            _this.responseURL = nativeXMLHttpRequest.responseURL || "";

            emitEvent(_this, "load", new EventPolyfill("load", e));
            emitEvent(_this, "loadend", new EventPolyfill("loadend", e));

            break;
    }

    emitEvent(_this, "readystatechange", new EventPolyfill("readystatechange", e));

    return _this;
}

function XMLHttpRequestPolyfill_onProgress(_this, e) {
    var event;

    if (!hasNativeProgress) {
        event = new ProgressEventPolyfill("progress", e);

        event.lengthComputable = false;
        event.loaded = 1;
        event.total = 1;

        emitEvent(_this, "progress", event);

        return event;
    }
}

XMLHttpRequestPolyfillPrototype.abort = function() {
    emitEvent(this, "abort", new EventPolyfill("abort", {}));
    tryCallFunction(this.__nativeXMLHttpRequest, "abort");
};

XMLHttpRequestPolyfillPrototype.setTimeout = function(ms) {
    this.timeout = ms;
    trySetValue(this.__nativeXMLHttpRequest, "timeout", ms);
};

XMLHttpRequestPolyfillPrototype.setWithCredentials = function(value) {
    value = !!value;
    this.withCredentials = value;
    trySetValue(this.__nativeXMLHttpRequest, "withCredentials", value);
};

XMLHttpRequestPolyfillPrototype.getAllResponseHeaders = function() {
    return tryCallFunction(this.__nativeXMLHttpRequest, "getAllResponseHeaders");
};

XMLHttpRequestPolyfillPrototype.getResponseHeader = function(header) {
    return tryCallFunction(this.__nativeXMLHttpRequest, "getResponseHeader", header);
};

XMLHttpRequestPolyfillPrototype.open = function(method, url, async, user, password) {
    if (this.readyState === 0) {
        this.readyState = 1;
        return tryCallFunction(this.__nativeXMLHttpRequest, "open", method, url, async, user, password);
    } else {
        return undefined;
    }
};

XMLHttpRequestPolyfillPrototype.overrideMimeType = function(mimetype) {
    tryCallFunction(this.__nativeXMLHttpRequest, "overrideMimeType", mimetype);
};

XMLHttpRequestPolyfillPrototype.send = function(data) {
    this.__nativeXMLHttpRequest.responseType = this.responseType;
    tryCallFunction(this.__nativeXMLHttpRequest, "send", data);
};

XMLHttpRequestPolyfillPrototype.setRequestHeader = function(key, value) {
    this.__requestHeaders[key] = value;
    tryCallFunction(this.__nativeXMLHttpRequest, "setRequestHeader", key, value);
};

XMLHttpRequestPolyfillPrototype.getRequestHeader = function(key) {
    return this.__requestHeaders[key];
};

XMLHttpRequestPolyfillPrototype.getRequestHeaders = function() {
    return extend({}, this.__requestHeaders);
};

XMLHttpRequestPolyfillPrototype.sendAsBinary = function(string) {
    return this.send(toUint8Array(string));
};
