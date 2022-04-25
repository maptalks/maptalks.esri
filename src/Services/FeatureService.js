
import cors from './../Utils/cors';
import Service from './Service';
import MetadataTask from './../Support/MetadataTask';
import QueryTask from './../Support/QueryTask';
import FeaturesTask from './../Support/FeaturesTask';


/**
 * default ImageService options
 */
const options = {
    proxy: false,
    useCors: cors,
    timeout: 0
};

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
    
    _QueryParams(option) {
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
            text: option.text||'',
            outFields: option.outFields || '*'
        };
        return condition;
    }

    _AddParams(features) {
        return {
            features: features,
            gdbVersion: '',
            rollbackOnFailure: true,
            f: 'pjson'
        }
    }

    _UpdateParams(features) {
       return {
            features: features,
            gdbVersion: '',
            rollbackOnFailure: true,
            f: 'pjson'
        } 
    }

   _deleteParams(option) {
        if(option.objectIds) {
            return {
                objectIds: option.objectIds,
                f: 'pjson'
            }
        } else {
            const geometry = option.geometry;
            return {
                where: option.where || '1=1',
                geometry: (geometry instanceof Object) ? JSON.stringify(geometry) : geometry,
                geometryType: option.geometryType || 'esriGeometryPoint',
                inSR: option.inSR || '',
                spatialRel: option.esriSpatialRelIntersects || 'esriSpatialRelIntersects',
                f: 'pjson'
            };
        }
   }

    query(option={}){
        const params = this._QueryParams(option);
        this._queryTask=this._queryTask||new QueryTask(this);
        this._queryTask.params = params;
        return this._queryTask.run();
    }
    
    addFeatures(features) {
       const params = this._AddParams(features);
       this._FeaturesTask=this._FeaturesTask||new FeaturesTask(this);
       this._FeaturesTask.params = params;
       this._FeaturesTask._path = 'addFeatures';
       return this._FeaturesTask.run();
    }

    updateFeatures(features) {
       const params = this._UpdateParams(features);
       this._FeaturesTask=this._FeaturesTask||new FeaturesTask(this);
       this._FeaturesTask.params = params;
       this._FeaturesTask._path = 'updateFeatures';
       return this._FeaturesTask.run();
    }

    deleteFeatures(option={}) {
       const params = this._deleteParams(option);
       this._FeaturesTask=this._FeaturesTask||new FeaturesTask(this);
       this._FeaturesTask.params = params;
       this._FeaturesTask._path = 'deleteFeatures';
       return this._FeaturesTask.run();
    }
}
