
import Task from './Task';
import merge from './../Utils/merge';

/**
 * @class ExportImageTask
 */
class FeaturesTask extends Task{

    constructor(service,params){
        super(service,params);
    }

    set params(value={}){
        this._params = merge({},this._params,value)
    }

    run(){
        return this.request('post',this._params);
    }

}

export default FeaturesTask;