
import cors from './../Utils/cors';
import Service from "./../Services/Service";
import merge from './../Utils/merge';
import { Ajax } from 'maptalks';

/**
 * default task options
 */
const taskOptions = {
    proxy: false,
    useCors: cors
}
/**
 * Task赋予Service相应的support能力
 * Task主要是支持以下操作
 * -query
 * -identify
 * -metadata
 * -exportImage
 * -...
 * @class Task
 */
class Task {
    /**
     * 创建一个task，可以是基于url或者是service创建
     * @param {Service} service 
     */
    constructor(service, options = {}) {
        /**
         * @type {Service}
         */
        this._service = service;
        /**
         * @type {boolean}
         */
        this._formatted = false;
        /**
         * @type {Object}
         */
        this._params = {};
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

    set params(value = {}) {
        this._params = merge({}, this._params, value)
    }
    /**
     * 提交request
     * @param {String} method set request method such as 'get' 'set'
     * @param {Object} params 
     * @returns {Promise}
     */
    request(method, params) {
        let _params = merge({}, this._params, params);
        return this._service.request(method, this._path || '', _params);
    }
    /**
     * virtual function to be implemented by 
     */
    run() {
        throw Error(this.constructorName + 'is no implemention run function')
    }
}

export default Task;
