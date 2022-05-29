

import { Util } from 'maptalks';
import Service from './Service';

import Task from '../Support/Task';


class IdentifyTask extends Task {
    run() {
        return this.request('post', this._params);
    }
}




export default class IdentifyService extends Service {

    constructor(options = {}) {
        super(options.url, options);
    }


    query(options = {}) {
        const map = this.getMap();
        if (!map) {
            console.error('not find map');
        };
        const size = map.getSize();
        const extent = map.getExtent();
        options = Util.extend({}, {
            f: 'json',
            returnFieldName: true,
            returnGeometry: true,
            returnUnformattedValues: true,
            tolerance: 3,
            sr: '4326',
            imageDisplay: `${size.width},${size.height},96`,
            mapExtent: [extent.xmin, extent.ymin, extent.xmax, extent.ymax].join(','),
        }, options);
        this._task = this._task || new IdentifyTask(this);
        this._task.params = options;
        return this._task.run();
    }



}