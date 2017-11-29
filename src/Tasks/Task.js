import { cors } from "../Utils/Support";
import Service from "./../Services/Service";
import merge from './../Utils/merge';
import { AJAX } from 'maptalks';

/**
 * task是由serveice组成
 * -service
 * -job
 * task完成任务后回调job
 */

const options = {
    proxy: false,
    useCors: cors
}

class Task {

    /**
     * 创建一个task，可以是基于url或者是service创建
     * @param {Service} service 
     */
    constructor(endpoint, options) {
        this._service = service;
        this._formatted = false;
        this._params = params || {};
    }

    /**
     * @type {String}
     */
    set token(value) {
        this._service.authenticate(value);
    }
    /**
     * 设置返回的值是否格式化
     */
    set formatted(boolean) {
        this._formatted = boolean;
    }

    request(callback, context) {
        let params = merge({}, this._params);
        if (this._service)
            return this._service.request(this.path, params, callback, context);
        else
            return this._locRequest()
    }

    _locRequest(method, path, params, callback, context) {
        let url = this._url;
        //4.根据method发出请求
        if ((method === 'GET' || method === 'REQUEST') && !this._options.useCors) {
            return AJAX.jsonp(url + '?' + serializeParams(_params), (resp) => {
                !!context ? callback(resp) : callback.call(context, resp);
            });
        } else {
            return AJAX.post(url, params, (resp) => {
                !!context ? callback(resp) : callback.call(context, resp);
            });
        }
    }


    /**
     * virtual function to be implemented by 
     */
    run() {
        throw Error(this.constructorName + 'is no implemention run function')
    }

}

export default Task;