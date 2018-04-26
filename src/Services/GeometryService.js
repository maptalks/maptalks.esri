
import cors from './../Utils/cors';
import cleanUrl from './../Utils/cleanUrl';
import {Ajax} from 'maptalks';
import Service from './Service';
import MetadataTask from './../Support/MetadataTask';
import BufferTask from './../Support/BufferTask';


/**
 * default ImageService options
 */
const options = {
    proxy:false,
    useCors:cors,
    timeout:0
}
/**
 * GeometryService对应arcgis发布的的GeometryServervices,supported operations
 * -Buffer
 * -
 * -
 * -
 * -
 * -
 */
export default class GeometryService extends Service{
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
    

    _BufferParams(options) {
        return {
            geometries : options.geometries,
            inSR : options.inSR||4326,
            outSR : options.outSR||4326,
            bufferSR : options.bufferSR||4326,
            distances:options.distances||0.0001,
            unit:options.unit||9102,
            unionResults:options.unionResults||true,
            geodesic:options.geodesic||false,
            f:'pjson'
        }
    }


    buffer(options) {
       const params = this._BufferParams(options);
       this._BufferTask=this._BufferTask||new BufferTask(this);
       this._BufferTask.params = params;
       return this._BufferTask.run();
    }
}