
import cors from './../Utils/cors';
import cleanUrl from './../Utils/cleanUrl';
import {Ajax} from 'maptalks';
import Service from './Service';
import MetadataTask from './../Support/MetadataTask';
import QueryTask from './../Support/QueryTask';
import AddFeaturesTask from './../Support/AddFeaturesTask';


/**
 * default ImageService options
 */
const options = {
    proxy:false,
    useCors:cors,
    timeout:0
}
/**
 * imageService对应arcgis发布的的supported operations
 * -Export Image
 * -Query
 * -Identify
 * -Coumpute Histograms
 * -Get Samples
 * -Compute Class Statistics
 */
export default class FeatureService extends Service{
    /**
     * 获取服务的　?f=json 配置信息
     * @returns {Promise}
     */
    metadata(){
        /**
         * @type {MetadataTask}
         */
        this._metadataTask = this._metadataTask || new MetadataTask(this);
        return this._metadataTask.run();
    }
    
    _parserQueryParams(option) {
        const geometry = option.geometry || '';
        const condition = {
            where: option.where || '1=1',
            geometry: (geometry instanceof Object) ? JSON.stringify(geometry) : geometry,
            geometryType: option.geometryType || 'esriGeometryPoint',
            inSR: option.inSR || '',
            spatialRel: option.esriSpatialRelIntersects || 'esriSpatialRelIntersects',
            relationParam: option.relationParam || '',
            objectIds: option.objectIds || '',
            time: option.time || '',
            returnCountOnly: option.returnCountOnly || false,
            returnGeometry: option.returnGeometry || true,
            maxAllowableOffset: option.maxAllowableOffset||'',
            outSR: option.outSR || '',
            text:option.text||'',
            outFields: option.outFields || '*'
        };
        return condition;
    }

    _parserAddFeaturesParams(features) {
        return {
            features: features,
            gdbVersion:'',
            rollbackOnFailure: true,
            f:'json'
        }
    }

    query(option={}){
        const params = this._parserQueryParams(option);
        this._queryTask=this._queryTask||new QueryTask(this);
        this._queryTask.params = params;
        return this._queryTask.run();
    }
    
    /**
     *features为geojson，格式如下:
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
     */
    addFeatures(features) {
       const params = this._parserAddFeaturesParams(features);
       this._addFeaturesTask=this._addFeaturesTask||new AddFeaturesTask(this);
       this._addFeaturesTask.params = params;
       return this._addFeaturesTask.run();
    }
    /**
     * 获取配置信息，用于设置加载位置等
     */
    identify(){
        //return new IdentifyImageTask(this);   
    }

}