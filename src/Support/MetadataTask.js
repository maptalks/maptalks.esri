

import Task from './Task';


/**
 * @class MetadataTask
 */
class MetadataTask extends Task{

    /**
     * 
     * @param {Service} service 
     * @param {Object} options 
     */
    constructor(service,options={}){
        super(service,options);
        this._path = "";
    }

    /**
     * 构造 url+'?f=json'形式，获取metadata
     */
    run(){
        return this.request('get',{});
    }

}

export default MetadataTask;