import {cors} from './../Utils/Support';
import cleanUrl from './../Utils/cleanUrl';
import {Ajax} from 'maptalks';
import Service from './Service';
import IdentifyImageTask from './../Tasks/IdentifyImageTask';

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

    GetSamples(){
        
    }

    CouputeClassStatistics(){

    }

    ComputeHistograms(){

    }

    exportImage(){

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