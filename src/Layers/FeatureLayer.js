/**
 * reference:
 * https://github.com/Esri/esri-leaflet/blob/master/src/Layers/ImageMapLayer.js
 */
import * as maptalks from 'maptalks';
import FeatureService from './../Services/FeatureService';
import merge from './../Utils/merge';

const _options = {
    renderer: 'canvas'
};

export default class FeatureLayer extends maptalks.VectorLayer {

    constructor(id, url, options = {}) {
        super(id, options);
        this._options = merge({}, _options, options);
        this._url = url;
        this._service = new FeatureService(this._url);
    }
    
    onLoad() {
        if (this._cacheData) {
            return true;
        }
        this._service.query(this._options).then(resp => {
            const data = JSON.parse(resp);
            this._cacheData = data;
            const geos = this._createGeometries(data.features, data.geometryType);
            this.load();
            this.addGeometry(geos);
            this.fire('loadend',{ geometries: geos });
        }, err => {
            console.log(err);
        });
        return false;
    }
    
    /**
     * @param {Object} 查询条件, 参考arcgis的rest api参数规则
     * @param {Function} 查询结果的回调方法
     */
    query(option, callback) {
        this._service.query(option).then(resp => {
            const result = JSON.parse(resp);
            callback(result);
        }, err => {
            console.log(err);
            callback(err);
        });
    }
    
    /**
     * @param {geojson} features格式如下:
     [{
        "geometry" : {"x" : 113.25, "y" : 33.80},      
        "attributes" : {
        "id" : "1",
        "name" : "Joe Smith"
       }
     },
      {
     "geometry" : { "x" : 113.27, "y" : 34.086 },      
     "attributes" : {
       "id" : "2",
       "name" : "John Doe"
      }
     }
    ]
    参考http://resources.arcgis.com/en/help/arcgis-rest-api/#/Add_Features/02r30000010m000000/
    * @ {Function} 添加要素后的回调方法
    */
    addFeatures(features, callback){
        this._service.addFeatures(features).then(resp => {
            const result = JSON.parse(resp);
            callback(result);
        }, err => {
            console.log(err);
            callback(err);
        });
    }
    
    /**
     * @param {geojson} features格式可参考http://resources.arcgis.com/en/help/arcgis-rest-api/#/Add_Features/02r30000010m000000/
    * @ {Function} 更新要素后的回调方法
    */
    updateFeatures(features, callback){
        this._service.updateFeatures(features).then(resp => {
            const result = JSON.parse(resp);
            callback(result);
        }, err => {
            console.log(err);
            callback(err);
        });
    }

    /**
     * @param {Object} 指定删除的要素条件
    * @ {Function} 删除要素后的回调方法
    */
    deleteFeatures(option, callback){
        this._service.deleteFeatures(option).then(resp => {
            const result = JSON.parse(resp);
            callback(result);
        }, err => {
            console.log(err);
            callback(err);
        });
    }


    _createGeometries(features, type) {
        let geometries = null;
        switch(type) {
            case 'esriGeometryPoint':
                  geometries = this._createPoint(features);
                  break;
            case 'esriGeometryPolyline':
                  geometries = this._createLineString(features);
                  break;
            case 'esriGeometryPolygon':
                  geometries = this._createPolygon(features);
                  break;
            default:
                  break;
        }
        return geometries;
    }

    _createPoint(features) {
        const geometries = [];
        const symbol = this._options.symbol||undefined;
        features.forEach(function(feature){
           geometries.push(new maptalks.Marker(feature.geometry,{
                symbol: symbol,
                properties: feature.attributes
            }));
        }.bind(this));
        return geometries; 
    }

    _createLineString(features) {
        const geometries = [];
        const symbol = this._options.symbol||{ lineColor:'red' };
        features.forEach(function(feature){
           geometries.push(new maptalks.MultiLineString(feature.geometry.paths,{
                symbol: symbol,
                properties: feature.attributes
            }));
        }.bind(this));
        return geometries;
    }

    _createPolygon(features) {
        const geometries = [];
        const symbol = this._options.symbol||{lineColor:'red'};
        features.forEach(function(feature){
           geometries.push(new maptalks.Polygon(feature.geometry.rings,{
                symbol: symbol,
                properties: feature.attributes
            }));
        }.bind(this));
        return geometries;
    }
};


class FeatureLayerRenderer extends maptalks.renderer.VectorLayerCanvasRenderer {
};

FeatureLayer.registerRenderer('canvas', FeatureLayerRenderer);
