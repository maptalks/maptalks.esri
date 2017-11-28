import IdentifyTask from './IdentifyTask';
import {AJAX} from 'maptalks';



class IdentifyImageTask extends IdentifyTask{

    constructor(){
        super();
    }

    /**
     * overwrite run function for image identify
     */
    run(){
        AJAX.jsonp(this.)
    }

}

