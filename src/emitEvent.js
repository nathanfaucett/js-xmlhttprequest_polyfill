module.exports = emitEvent;


function emitEvent(object, type, event) {
    var onevent = "on" + type;

    if (object[onevent]) {
        object[onevent](event);
    }

    object.emitArg(type, event);
}
