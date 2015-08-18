var environment = require("environment");


var Uint8Array = environment.window.Uint8Array || Array;


module.exports = toUint8Array;


function toUint8Array(str) {
    var length = str.length,
        ui8 = new Uint8Array(length),
        i = -1,
        il = length - 1;

    while (i++ < il) {
        ui8[i] = str.charCodeAt(i) & 0xff;
    }

    return ui8;
}
