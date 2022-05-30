import ImageService from "./ImageService";
import { Util } from 'maptalks';

class DynamicMapService extends ImageService {

    query(options = {}) {
        options = Util.extend({}, {
            format: 'png',
            transparent: true,
            dpi: 96
        }, options);
        const map = this._options.map;
        if (!map) {
            console.error('not find map');
        };
        const params = this._buildExportParams(options);
        return this.exportImage(params);
    }
}

export default DynamicMapService;