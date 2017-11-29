
import merge from './../Utils/merge';
import {cors} from './../Utils/Support';
import cleanUrl from './../Utils/cleanUrl';
import {Ajax} from 'maptalks';
import serializeParams  from './../Utils/serializeParams';

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
        this._token = null;
    }

    /**
     * 设置token，用于授权验证
     * @param {String} token 
     */
    authenticate(token){
        this._token = token;
    }

    metadata(callback,context){
        return this._request('GET','',{},callback,context);
    }

    get(path,params,callback,context){
        return this._request('GET',path,params,callback,context);
    }

    request(path,params,callback,context){
        return this._request('REQUEST',path,params,callback,context);
    }

    _request(method,path,params,callback,context){
        //1.构造请求
        let url = this._options.proxy?this._options.proxy+'?'+this._url+path:this._url+path;
        //2.合并请求参数
        params = !!this._token? merge({},params,{token:this._token}):merge({},params);
        //3.发出请求
        method = method.toUpperCase();
        //4.根据method发出请求
        //(method === 'GET' || method === 'REQUEST') && !this._options.useCors
        if((method==='GET'||method ==='REQUEST')&&!this._options.useCors){
            return Ajax.jsonp(url+'?'+serializeParams(_params),(resp)=>{
                !!context?callback(resp):callback.call(context,resp);
            });
        }else{
            return Ajax.get(url+'?'+serializeParams(_params),params,(resp)=>{
                !!context?callback(resp):callback.call(context,resp);
            });
        }
    }


}

export default Service;