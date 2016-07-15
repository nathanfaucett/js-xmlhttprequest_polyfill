var environment = require("@nathanfaucett/environment");


var window = environment.window,
    NativeXMLHttpRequest = window.XMLHttpRequest,

    createNativeXMLHttpRequest, NativeActiveXObjectType;


if (NativeXMLHttpRequest) {
    createNativeXMLHttpRequest = function createNativeXMLHttpRequest(options) {
        return new NativeXMLHttpRequest(options);
    };
} else {
    (function getNativeActiveXObject(types) {
        var NativeActiveXObject = window.ActiveXObject,
            i = -1,
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

        NativeActiveXObjectType = type;
    }([
        "Msxml2.XMLHTTP",
        "Msxml3.XMLHTTP",
        "Microsoft.XMLHTTP"
    ]));

    createNativeXMLHttpRequest = function createNativeXMLHttpRequest() {
        return new NativeActiveXObject(NativeActiveXObjectType);
    };
}


module.exports = createNativeXMLHttpRequest;
