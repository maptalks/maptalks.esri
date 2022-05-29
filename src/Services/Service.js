
import merge from './../Utils/merge';
import cors from './../Utils/cors';
import cleanUrl from './../Utils/cleanUrl';
import { Ajax, Util, GeoJSON } from 'maptalks';
import serializeParams from './../Utils/serializeParams';
import Promise from './../Utils/Promise';
import { hasService, outService, pushService } from '../servicequeryqueue';
import { arcgisToGeoJSON } from "@terraformer/arcgis"

const _options = {
    proxy: false,
    useCors: cors,
    timeout: 0
}

/**
 * service是帮助不同场景和服务，构建简易的request服务，获取相关信息
 * 针对arcgis发布的图层服务
 * 此service是基类，提供基本的request和添加token方法，应对具体服务需要额外拼装相关参数发送请求
 * @author axmand date 2017/11/30
 * @class Service
 */
class Service {
    /**
     * 
     * @param {Object} options
     * @param {String} options.url
     * @param {boolean} [options.proxy] defalut is false
     */
    constructor(url, options = {}) {
        //合并，更新options
        this._options = merge({}, _options, options);
        this._url = cleanUrl(url);
        this._token = this._options.token || null;
        this.id = Util.GUID();
    }

    getMap() {
        return this._options.map;
    }


    getQueryTaskId() {
        return `${Util.GUID()}_${new Date().getTime()}`;
    }


    /**
     * 设置token，用于授权验证
     * @param {String} token 
     */
    authenticate(token) {
        this._token = token;
    }
    /**
     * send a request to fetch data
     * @param {String} method set 'get' or 'post' to request data
     * @param {String} path  
     * @param {Object} params 
     * @returns {Promise}
     */
    request(method, path, params) {
        //1.构造请求
        let url = this._options.proxy ? this._options.proxy + '?' + this._url + path : this._url + path;
        //2.合并请求参数
        params = this._token ? merge({}, params, { token: this._token }) : merge({}, params);
        //3.发出请求
        method = method.toLowerCase();

        //current query 
        const queryId = params.__queryId || this.getQueryTaskId();
        this.queryId = queryId;
        pushService(Util.extend({}, this));

        const resolveCallback = (resolve, resp) => {
            //不包含该次的查询，说明其已经被新的query替代无需 resolve
            if (hasService(this, queryId) || (this.queryInGrids && this.queryInGrids(queryId))) {
                resolve(resp);
                outService(this);
            } else if (this._options['debug']) {
                console.warn(`${queryId} task is Discard`);
            }
        };
        //4.根据method发出请求
        if (method === 'get' && !this._options.useCors) {
            return new Promise(function (resolve, reject) {
                Ajax.jsonp(url + '?' + serializeParams(params), (err, resp) => {
                    err === null ? resolveCallback(resolve, resp) : reject(err);
                });
            });
        } else if (method === 'get') {
            return new Promise(function (resolve, reject) {
                Ajax.get(url + '?' + serializeParams(params), (err, resp) => {
                    err === null ? resolveCallback(resolve, resp) : reject(err);
                });
            });
        } else if (method === 'post') {
            return new Promise(function (resolve, reject) {
                Ajax.post({ url }, serializeParams(params), (err, resp) => {
                    err === null ? resolveCallback(resolve, resp) : reject(err);
                });
            });
        }
    }

    toGeometry(json) {
        if (typeof json === 'string') {
            json = JSON.parse(json);
        }
        const { spatialReference, features, results } = json;
        const geojsonFeatures = [];
        (features || results || []).forEach(feature => {
            const { attributes, geometry } = feature;
            if (!geometry) {
                return;
            }
            const geometryGeoJSON = arcgisToGeoJSON(Util.extend({ spatialReference }, geometry));
            if (geometryGeoJSON) {
                geojsonFeatures.push({
                    type: "Feature",
                    geometry: geometryGeoJSON,
                    properties: attributes
                });
            }
        });
        return geojsonFeatures.map(feature => {
            return GeoJSON.toGeometry(feature);
        });
    }
}

export default Service;
