
import cors from './../Utils/cors';
import cleanUrl from './../Utils/cleanUrl';
import {Ajax} from 'maptalks';
import Service from './Service';
import IdentifyImageTask from './../Support/IdentifyImageTask';
import MetadataTask from './../Support/MetadataTask';
import ExportImageTask from './../Support/ExportImageTask';


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
export default class ImageService extends Service{
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

    GetSamples(){

    }

    CouputeClassStatistics(){

    }

    ComputeHistograms(){

    }

    exportImage(params){
        /**
         * @type {ExportImageTask}
         */
        this._exportImageTask=this._exportImageTask||new ExportImageTask(this);
        this._exportImageTask.params = params;
        return this._exportImageTask.run();
    }

    query(){

    }
    /**
     * 获取配置信息，用于设置加载位置等
     */
    identify(){
        return new IdentifyImageTask(this);   
    }

}