
import Task from './Task';
import merge from './../Utils/merge';

/**
 * @class ExportImageTask
 */
class QueryTask extends Task{

    constructor(service,params){
        super(service,params);
        this._path = 'query';
    }

    set params(value={}){
        this._params = merge({},this._params,value)
    }

    run(){
        return this.request('get',this._params);
    }

}

export default QueryTask;