
import merge from './../../Utils/merge';
import {cors} from './../../Utils/Support';
import cleanUrl from './../../Utils/cleanUrl';
import {AJAX} from 'maptalks';

const _options={
    proxy:false,
    useCors:cors,
    timeout:0
}

/**
 * service是帮助不同场景和服务，构建简易的request服务，获取相关信息
 * 针对arcgis发布的图层服务
 * -imagelayer service
 * -
 * @class Service
 */
class Service{

    /**
     * 
     * @param {Object} options
     * @param {String} options.url
     * @param {boolean} [options.proxy] defalut is false
     */
    constructor(url,options){
        //合并，更新options
        this._options = merge({},_options,options);
        this._url = cleanUrl(url);
    }

    /**
     * 设置token，用于授权验证
     * @param {String} token 
     */
    authenticate(token){

    }

    metadata(callback,context){
        return this._request('GET','',{},callback,context);
    }

    get(path,params,callback,context){
        return this._request('GET',path,params,callback,context);
    }

    request(path,params,callback,context){
        
    }

    _request(method,path,params,callback,context){

    }


}

export default Service;