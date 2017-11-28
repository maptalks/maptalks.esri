import { cors } from "../Utils/Support";
import Service from "./../Services/Service";
import merge from './../../Utils/merge';
/**
 * task是由serveice组成
 * -service
 * -job
 * task完成任务后回调job
 */

const options={
    proxy:false,
    useCors:cors
}

class Task{

    /**
     * 创建一个task，可以是基于url或者是service创建
     * @param {Service} endpoint 
     */
    constructor(endpoint){
        this._service = endpoint;
        this._formatted = false;
    }

    /**
     * @type {String}
     */
    set token(value){
        this._service.authenticate(value);
    }
    /**
     * 设置返回的值是否格式化
     */
    set formatted(boolean){
        this._formatted = boolean;
    }

    request(callback,context){
        if(this._service)
            return this._service.request(this.path)
    }

    /**
     * virtual function to be implemented by 
     */
    run(){
        throw Error(this.constructorName+'is no implemention run function')
    }

}
