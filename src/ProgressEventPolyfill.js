var inherits = require("inherits"),
    EventPolyfill = require("./EventPolyfill");


module.exports = ProgressEventPolyfill;


function ProgressEventPolyfill(type, nativeEvent) {

    EventPolyfill.call(this, type, nativeEvent);

    this.lengthComputable = nativeEvent.lengthComputable;
    this.loaded = nativeEvent.loaded;
    this.total = nativeEvent.total;
}
inherits(ProgressEventPolyfill, EventPolyfill);
