/**
 * trim leading and trailing spaces, but not spaces inside the url
 */
var trimText = (function (isNative) {
    return function (input) {
        return isNative ? isNative.apply(input) : ((input || '') + '').replace(/^\s+|\s+$/g, '');
    }
})(String.prototype.trim);


export default trimText;