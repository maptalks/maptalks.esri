import Task from './Task'

class IdentifyTask extends Task{

    constructor(endpoint,params){
        super(endpoint,params);
        this._path = 'identify'
    }

    between(start,end){
        this._time = [start.valueOf(),end.valueOf()];
        return this;
    }

}

export default IdentifyTask;