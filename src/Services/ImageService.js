import {cors} from './../Utils/Support';
import cleanUrl from './../Utils/cleanUrl';
import {AJAX} from 'maptalks';
import Service from './Service';

const options = {
    proxy:false,
    useCors:cors,
    timeout:0
}

/**
 * 提供query和identify操作
 */
export default class ImageService extends Service{

    query(){

    }

    identify(){
        
    }

}