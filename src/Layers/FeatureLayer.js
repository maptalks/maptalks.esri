/**
 * reference:
 * https://github.com/Esri/esri-leaflet/blob/master/src/Layers/ImageMapLayer.js
 */
import * as maptalks from 'maptalks';
import FeatureService from './../Services/FeatureService';
import merge from './../Utils/merge';

const _options = {
    renderer:'canvas'
};
//http://117.36.75.134:6080/arcgis/rest/services/LT/JSD/FeatureServer/3
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
        const params = this._buildParams();
        this._service.query(params).then(resp => {
            const data = JSON.parse(resp);
            this._cacheData = data;
            const geos = this._createGeometries(data.features, data.geometryType);
            this.load();
            this.addGeometry(geos);
            this.fire('loadend',{geometries:geos});
        }, err => {
            console.log(err);
        });
        return false;
    }
    
    addFeatures(features, callback){
        this._service.addFeatures(features).then(resp => {
            const result = JSON.parse(resp);
            callback(result);
        }, err => {
            console.log(err);
            callback(err);
        })
    }
    
    _buildParams() {
        const params = {
        }; 
        return params;
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
                symbol:symbol,
                properties:feature.attributes
            }));
        }.bind(this));
        return geometries; 
    }

    _createLineString(features) {
        const geometries = [];
        const symbol = this._options.symbol||{lineColor:'red'};
        features.forEach(function(feature){
           geometries.push(new maptalks.LineString(feature.geometry.paths[0],{
                symbol:symbol,
                properties:feature.attributes
            }));
        }.bind(this));
        return geometries;
    }

    _createPolygon(features) {
        const geometries = [];
        const symbol = this._options.symbol||{lineColor:'red'};
        features.forEach(function(feature){
           geometries.push(new maptalks.Polygon(feature.geometry.rings,{
                symbol:symbol,
                properties:feature.attributes
            }));
        }.bind(this));
        return geometries;
    }
};


class FeatureLayerRenderer extends maptalks.renderer.VectorLayerCanvasRenderer {

};

FeatureLayer.registerRenderer('canvas', FeatureLayerRenderer);

