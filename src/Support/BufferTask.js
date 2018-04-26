
import Task from './Task';
import merge from './../Utils/merge';

/**
 * @class Support BufferTask
 */
class BufferTask extends Task{

    constructor(service,params){
        super(service,params);
        this._path = 'buffer';
    }

    set params(value={}){
        this._params = merge({},this._params,value)
    }

    run(){
        return this.request('post',this._params);
    }

}

export default BufferTask;