import { cors } from "../Utils/Support";
import Service from "./../Services/Service";

/**
 * task是由serveice组成
 * -service
 * -job
 * task完成任务后回调job
 */

const options={
    proxy:false,
    useCors:cors
}

class Task{

    /**
     * 创建一个task，可以是基于url或者是service创建
     * @param {Any} endpoint 
     */
    constructor(endpoint){
        if(endpoint instanceof )
    }


}