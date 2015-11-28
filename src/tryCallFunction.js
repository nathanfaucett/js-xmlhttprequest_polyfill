module.exports = tryCallFunction;


function tryCallFunction(object, name, a0, a1, a2, a3, a4) {
    try {
        return object[name](a0, a1, a2, a3, a4);
    } catch (e) {}
}
