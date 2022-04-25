/**
 * reference:
 * https://github.com/Esri/esri-leaflet/blob/master/src/Layers/ImageMapLayer.js
 */
import * as maptalks from 'maptalks';
import FeatureQueryService from './../Services/FeatureService';

export default class FeatureService {

    constructor(options = {}) {
        this._options = options;
        this._url = options.url;
        this._service = new FeatureQueryService(this._url);
        this._projection = options.projection;
        if (maptalks.Util.isString(this._projection)); {
            this._projection = maptalks.SpatialReference.getProjectionInstance(options.projection);
        }
    }


    /**
     * @param {Object} 查询条件, 参考arcgis的rest api参数规则
     * @param {Function} 查询结果的回调方法
     */
    query(option) {
        return this._service.query(option).then(resp => {
            const data = JSON.parse(resp);
            const geos = this._createGeometries(data.features, data.geometryType);
            return geos;
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
    addFeatures(features){
        return this._service.addFeatures(features).then(resp => {
            return JSON.parse(resp)
        });
    }

    /**
     * @param {geojson} features格式可参考http://resources.arcgis.com/en/help/arcgis-rest-api/#/Add_Features/02r30000010m000000/
    * @ {Function} 更新要素后的回调方法
    */
    updateFeatures(features){
        return this._service.updateFeatures(features).then(resp => {
            return JSON.parse(resp)
        });
    }

    /**
     * @param {Object} 指定删除的要素条件
    * @ {Function} 删除要素后的回调方法
    */
    deleteFeatures(option){
        return this._service.deleteFeatures(option).then(resp => {
            return JSON.parse(resp);
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
        const symbol = this._options.symbol || null;
        features.forEach(function(feature){
            const coords = project(feature.geometry, this._projection);
            geometries.push(new maptalks.Marker(coords, {
                symbol,
                properties: feature.attributes
            }));
        }.bind(this));
        return geometries;
    }

    _createLineString(features) {
        const geometries = [];
        const symbol = this._options.symbol || null;
        features.forEach(function(feature){
            const coords = project(feature.geometry.paths, this._projection);
            geometries.push(new maptalks.MultiLineString(coords,{
                properties: feature.attributes,
                symbol
            }));
        }.bind(this));
        return geometries;
    }

    _createPolygon(features) {
        const geometries = [];
        const symbol = this._options.symbol || null;
        features.forEach(function(feature){
            const coords = project(feature.geometry.rings, this._projection);
            geometries.push(new maptalks.Polygon(coords, {
                properties: feature.attributes,
                symbol
            }));
        }.bind(this));
        return geometries;
    }
}

const TEMP_COORD = new maptalks.Coordinate(0, 0);
const TEMP_COORD2 = new maptalks.Coordinate(0, 0);

function project(coords, projection) {
    if (!projection) {
        return coords;
    }
    if (Array.isArray(coords) && Array.isArray(coords[0])) {
        const result = [];
        for (let i = 0; i < coords.length; i++) {
            result.push(project(coords[i], projection));
        }
        return result;
    } else {
        if (Array.isArray(coords)) {
            TEMP_COORD2.set(coords[0], coords[1]);
        } else {
            TEMP_COORD2.set(coords.x, coords.y);
        }
        projection.unproject(TEMP_COORD2, TEMP_COORD);
        return [TEMP_COORD.x, TEMP_COORD.y];
    }
}
