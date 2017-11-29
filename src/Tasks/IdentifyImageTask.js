import IdentifyTask from './IdentifyTask';
import {AJAX} from 'maptalks';


/**
 * 通过identify读取配置，设置属性
 */
class IdentifyImageTask extends IdentifyTask{

    constructor(){
        super();
    }

    /**
     * overwrite run function for image identify
     */
    run(callback,context){
        //调用service的reques方法，获取相应属性后设置进service
        this.request(function(error,response){
            callback.call(context,)
        },this)
    }

}

