var environment = require("@nathanfaucett/environment");


var Uint8Array = environment.window.Uint8Array || Array;


module.exports = toUint8Array;


function toUint8Array(string) {
    var length = string.length,
        ui8 = new Uint8Array(length),
        i = -1,
        il = length - 1;

    while (i++ < il) {
        ui8[i] = string.charCodeAt(i) & 0xff;
    }

    return ui8;
}
