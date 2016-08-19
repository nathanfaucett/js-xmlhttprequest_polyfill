var tryCallFunction = require("./tryCallFunction");


var EventPolyfillPrototype;


module.exports = EventPolyfill;


function EventPolyfill(type, nativeEvent) {

    this.__nativeEvent = nativeEvent;

    this.type = type;
    this.bubbles = nativeEvent.bubbles;
    this.cancelBubble = nativeEvent.cancelBubble;
    this.cancelable = nativeEvent.cancelable;
    this.currentTarget = nativeEvent.currentTarget;
    this.defaultPrevented = nativeEvent.defaultPrevented;
    this.eventPhase = nativeEvent.eventPhase;
    this.isTrusted = nativeEvent.isTrusted;
    this.path = nativeEvent.path;
    this.returnValue = nativeEvent.returnValue;
    this.srcElement = nativeEvent.srcElement;
    this.target = nativeEvent.target;
    this.timeStamp = nativeEvent.timeStamp;
}
EventPolyfillPrototype = EventPolyfill.prototype;

EventPolyfillPrototype.AT_TARGET = 2;
EventPolyfillPrototype.BLUR = 8192;
EventPolyfillPrototype.BUBBLING_PHASE = 3;
EventPolyfillPrototype.CAPTURING_PHASE = 1;
EventPolyfillPrototype.CHANGE = 32768;
EventPolyfillPrototype.CLICK = 64;
EventPolyfillPrototype.DBLCLICK = 128;
EventPolyfillPrototype.DRAGDROP = 2048;
EventPolyfillPrototype.FOCUS = 4096;
EventPolyfillPrototype.KEYDOWN = 256;
EventPolyfillPrototype.KEYPRESS = 1024;
EventPolyfillPrototype.KEYUP = 512;
EventPolyfillPrototype.MOUSEDOWN = 1;
EventPolyfillPrototype.MOUSEDRAG = 32;
EventPolyfillPrototype.MOUSEMOVE = 16;
EventPolyfillPrototype.MOUSEOUT = 8;
EventPolyfillPrototype.MOUSEOVER = 4;
EventPolyfillPrototype.MOUSEUP = 2;
EventPolyfillPrototype.NONE = 0;
EventPolyfillPrototype.SELECT = 16384;

EventPolyfillPrototype.preventDefault = function() {
    return tryCallFunction(this.__nativeEvent, "preventDefault");
};

EventPolyfillPrototype.stopImmediatePropagation = function() {
    return tryCallFunction(this.__nativeEvent, "stopImmediatePropagation");
};

EventPolyfillPrototype.stopPropagation = function() {
    return tryCallFunction(this.__nativeEvent, "stopPropagation");
};
