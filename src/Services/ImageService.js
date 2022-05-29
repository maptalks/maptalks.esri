
import cors from './../Utils/cors';
// import cleanUrl from './../Utils/cleanUrl';
import { Util, Coordinate, Point } from 'maptalks';
import Service from './Service';
import IdentifyImageTask from './../Support/IdentifyImageTask';
import MetadataTask from './../Support/MetadataTask';
import ExportImageTask from './../Support/ExportImageTask';


// const TEMP_EXTENT = new maptalks.Extent();
const TEMP_COORD = new Coordinate(0, 0);
const TEMP_POINT = new Point(0, 0);
const TEMP_POINT2 = new Point(0, 0);
const BBOX = [];
/**
 * default ImageService options
 */
const options = {
    proxy: false,
    useCors: cors,
    timeout: 0
}
/**
 * imageService对应arcgis发布的的supported operations
 * -Export Image
 * -Query
 * -Identify
 * -Coumpute Histograms
 * -Get Samples
 * -Compute Class Statistics
 */
export default class ImageService extends Service {

    constructor(options = {}) {
        super(options.url, options);
    }
    /**
     * 获取服务的　?f=json 配置信息
     * @returns {Promise}
     */
    metadata() {
        /**
         * @type {MetadataTask}
         */
        this._metadataTask = this._metadataTask || new MetadataTask(this);
        return this._metadataTask.run();
    }

    GetSamples() {

    }

    CouputeClassStatistics() {

    }

    ComputeHistograms() {

    }

    exportImage(params) {
        /**
         * @type {ExportImageTask}
         */
        this._exportImageTask = this._exportImageTask || new ExportImageTask(this);
        this._exportImageTask.params = params;
        return this._exportImageTask.run();
    }

    query(options = {}) {
        options = Util.extend({}, {
            format: 'png',
            transparent: true,
        }, options);
        const map = this._options.map;
        if (!map) {
            console.error('not find map');
        };
        const params = this._buildExportParams(options);
        return this.exportImage(params);
    }

    _buildExportParams(options) {
        const map = this._options.map;
        const params = {},
            mapExtent = map.getExtent();
        const extent = mapExtent;
        BBOX[0] = extent.xmin;
        BBOX[1] = extent.ymin;
        BBOX[2] = extent.xmax;
        BBOX[3] = extent.ymax;
        params.bbox = BBOX;
        //计算size
        const min = TEMP_COORD.set(params.bbox[0], params.bbox[1]);
        const ptMin = map.coordToPoint(min, null, TEMP_POINT);
        const max = TEMP_COORD.set(params.bbox[2], params.bbox[3]);
        const ptMax = map.coordToPoint(max, null, TEMP_POINT2);
        const w = Math.abs(Math.floor(ptMax.x - ptMin.x)),
            h = Math.abs(Math.floor(ptMax.y - ptMin.y));
        params.size = w + ',' + h;
        params.format = options.format;
        params.transparent = options.transparent;
        const projection = map.getProjection();
        //}{axmand debug
        params.bboxSR = options.bboxSR || '4326';
        //强制要求是4326
        const code = projection.code;
        params.imageSR = options.imageSR || code.substring('EPSG:'.length);
        return params;
    }
    /**
     * 获取配置信息，用于设置加载位置等
     */
    identify() {
        return new IdentifyImageTask(this);
    }

}