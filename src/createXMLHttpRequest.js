var EventEmitter = require("event_emitter");


module.exports = createXMLHttpRequest;


function createXMLHttpRequest(createNativeObject) {
    var XMLHttpRequestPrototype;


    function XMLHttpRequest() {
        var _this = this,
            nativeObject = createNativeObject();

        EventEmitter.call(this, -1);

        this.__requestHeaders = {};
        this.__nativeObject = nativeObject;

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

        nativeObject.onreadystatechange = function(e) {
            return XMLHttpRequest_onReadyStateChange(_this, e);
        };

        nativeObject.ontimeout = function(e) {
            if (_this.ontimeout) {
                _this.ontimeout(e);
            }
            _this.emit("timeout");
        };

        nativeObject.onerror = function(e) {
            if (_this.onerror) {
                _this.onerror(e);
            }
            _this.emit("error");
        };
    }
    EventEmitter.extend(XMLHttpRequest);
    XMLHttpRequestPrototype = XMLHttpRequest.prototype;

    function XMLHttpRequest_onReadyStateChange(_this, e) {
        var nativeObject = _this.__nativeObject;

        _this.readyState = nativeObject.readyState;

        if (_this.onreadystatechange) {
            _this.onreadystatechange(e);
        }
        _this.emit("readystatechange", e);

        switch (nativeObject.readyState) {
            case 3:
                if (_this.onprogress) {
                    _this.onprogress();
                }
                _this.emit("progress", e);
                break;
            case 4:
                _this.response = nativeObject.response || "";
                _this.responseText = nativeObject.responseText || _this.response;
                _this.responseType = nativeObject.responseType || "";
                _this.responseURL = nativeObject.responseURL || "";
                _this.responseXML = nativeObject.responseXML || _this.response;
                _this.status = nativeObject.status || 0;
                _this.statusText = nativeObject.statusText || "";

                if (_this.onload) {
                    _this.onload();
                }
                _this.emit("load", e);
                if (_this.onloadend) {
                    _this.onloadend();
                }
                _this.emit("loadend", e);
                break;
        }

        return _this;
    }

    XMLHttpRequestPrototype.attachEvent = function(type, fn) {
        return this.on(type.slice(2), fn);
    };
    XMLHttpRequestPrototype.detachEvent = function(type, fn) {
        return this.off(type.slice(2), fn);
    };

    XMLHttpRequestPrototype.addEventListener = XMLHttpRequestPrototype.on;
    XMLHttpRequestPrototype.removeEventListener = XMLHttpRequestPrototype.off;

    XMLHttpRequestPrototype.dispatchEvent = function(event) {
        return this.emit(event.type, event);
    };

    XMLHttpRequestPrototype.fireEvent = function(type, event) {
        return this.emit("on" + type, event);
    };

    XMLHttpRequestPrototype.abort = function() {
        try {
            if (this.onabort) {
                this.onabort();
            }
            _this.emit("abort", {});
            this.__nativeObject.abort();
        } catch (e) {}
    };

    XMLHttpRequestPrototype.setTimeout = function(ms) {
        this.timeout = ms;
        try {
            this.__nativeObject.timeout = ms;
        } catch (e) {}
    };

    XMLHttpRequestPrototype.setWithCredentials = function(value) {
        value = !!value;
        this.withCredentials = value;
        try {
            this.__nativeObject.withCredentials = value;
        } catch (e) {}
    };

    XMLHttpRequestPrototype.getAllResponseHeaders = function() {
        try {
            return this.__nativeObject.getAllResponseHeaders();
        } catch (e) {
            return null;
        }
    };

    XMLHttpRequestPrototype.getResponseHeader = function(header) {
        try {
            return this.__nativeObject.getResponseHeader(header);
        } catch (e) {
            return null;
        }
    };

    XMLHttpRequestPrototype.getResponseHeader = function(header) {
        try {
            return this.__nativeObject.getResponseHeader(header);
        } catch (e) {
            return null;
        }
    };

    XMLHttpRequestPrototype.open = function(method, url, async, user, password) {
        if (this.readyState === 0) {
            this.readyState = 1;
            return this.__nativeObject.open(method, url, async, user, password);
        } else {
            return undefined;
        }
    };

    XMLHttpRequestPrototype.overrideMimeType = function(mimetype) {
        try {
            return this.__nativeObject.overrideMimeType(mimetype);
        } catch (e) {}
    };

    XMLHttpRequestPrototype.send = function(data) {
        try {
            return this.__nativeObject.send(data);
        } catch (e) {}
    };

    XMLHttpRequestPrototype.setRequestHeader = function(key, value) {
        try {
            return this.__nativeObject.setRequestHeader(key, value);
        } catch (e) {}
    };

    return XMLHttpRequest;
}
