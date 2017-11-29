/**
 * 序列化params，递交给Ajax方法
 * @function
 * @param {Object} params 
 */
const serializeParams = function (params) {
    let data = '';
    params.f = params.f || 'json';

    for (var key in params) {
        if (params.hasOwnProperty(key)) {
            var param = params[key];
            var type = Object.prototype.toString.call(param);
            var value;

            if (data.length) {
                data += '&';
            }

            if (type === '[object Array]') {
                value = (Object.prototype.toString.call(param[0]) === '[object Object]') ? JSON.stringify(param) : param.join(',');
            } else if (type === '[object Object]') {
                value = JSON.stringify(param);
            } else if (type === '[object Date]') {
                value = param.valueOf();
            } else {
                value = param;
            }

            data += encodeURIComponent(key) + '=' + encodeURIComponent(value);
        }
    }

    return data;
}

export default serializeParams;