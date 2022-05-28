
import Task from './Task';
import merge from './../Utils/merge';

/**
 * @class ExportImageTask
 */
class ExportImageTask extends Task{

    constructor(endpoint,params){
        super(endpoint,params);
        // this._path = 'exportImage'
    }

    set params(value={}){
        this._params = merge({},this._params,value)
    }

    run(){
       return this.request('get',this._params);
    }

}

export default ExportImageTask;