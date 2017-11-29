import Task from './Task'

class IdentifyTask extends Task{

    constructor(){
        super();
        this._path = 'identify'
    }

    between(start,end){
        this._time = [start.valueOf(),end.valueOf()];
        return this;
    }

}

export default IdentifyTask;