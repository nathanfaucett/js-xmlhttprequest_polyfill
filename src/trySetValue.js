module.exports = trySetValue;


function trySetValue(object, name, key, value) {
    try {
        return (object[name][key] = value);
    } catch (e) {}
}
