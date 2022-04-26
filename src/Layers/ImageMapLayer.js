/**
 * reference:
 * https://github.com/Esri/esri-leaflet/blob/master/src/Layers/ImageMapLayer.js
 */
import * as maptalks from 'maptalks';
import ImageService from './../Services/ImageService';

const options = {
    renderer: maptalks.Browser.webgl ? 'gl' : 'canvas',
    updateInterval: 150,
    format: 'jpgpng',
    transparent: true,
    f: 'image',
};

const TEMP_EXTENT = new maptalks.Extent();
const TEMP_COORD = new maptalks.Coordinate(0, 0);
const TEMP_POINT = new maptalks.Point(0, 0);
const TEMP_POINT2 = new maptalks.Point(0, 0);
const BBOX = [];

export default class ImageMapLayer extends maptalks.ImageLayer {

    constructor(id, options = {}) {
        super(id, [], options);
        this._url = options.url;
        this._service = new ImageService(this._url);
        this._esriImages = [];
    }

    getEvents() {
        return {
            'zoomend': function () {
                this._currentParamString = null;
                this._reLoad();
            },
            'moveend rotateend': function () {
                this._reLoad();
            }
        }
    }

    _reLoadOnZoomEnd() {
        const params = this._buildExportParams();

        const renderer = this.getRenderer();
        if (this._requesting || renderer && renderer.isLoadingResource()) {
            this._lastParams = params;
            return;
        }
        //export image 用于render
        this._requestImage(params);
    }

    _reLoad() {
        const params = this._buildExportParams();

        const renderer = this.getRenderer();
        if (this._requesting || renderer && renderer.isLoadingResource()) {
            // this._lastParams = params;
            return;
        }
        //export image 用于render
        this._requestImage(params);
    }

    _requestImage(params) {
        const paramString = JSON.stringify(params);
        if (paramString === this._currentParamString) {
            return;
        }
        this._requesting = true;
        this._currentParamString = paramString;
        this._service.exportImage(params).then(resp => {
            //获取结果图片地址
            const image = JSON.parse(resp);
            image.url = image.href;
            const extent = image.extent;
            const projection = this.getMap().getProjection();
            const e = new maptalks.Extent(extent).convertTo(c => projection.unproject(c, TEMP_COORD));
            image.extent = [e.xmin, e.ymin, e.xmax, e.ymax];
            this._esriImages[0] = image;
            this.setImages(this._esriImages);
            this._requesting = false;
            if (this._lastParams) {
                this._requestImage(this._lastParams);
                delete this._lastParams;
            }
            const renderer = this.getRenderer();
            if (renderer) {
                renderer.setToRedraw();
            }
        }, err => {
            console.log(err);
        });
    }

    onAdd() {
        this._reLoad();
        super.onAdd();
    }


    _buildExportParams() {
        const params = {},
            map = this.getMap(),
            mapExtent = map.getExtent();
        const paramExtent = this.options.extent && TEMP_EXTENT.set(...this.options.extent);

        const extent = paramExtent || mapExtent;

        BBOX[0] = extent.xmin;
        BBOX[1] = extent.ymin;
        BBOX[2] = extent.xmax;
        BBOX[3] = extent.ymax;
        params.bbox = BBOX;
        //计算size
        const min = TEMP_COORD.set(params.bbox[0], params.bbox[1]);
        const ptMin = map.coordToContainerPoint(min, null, TEMP_POINT);
        const max = TEMP_COORD.set(params.bbox[2], params.bbox[3]);
        const ptMax = map.coordToContainerPoint(max, null, TEMP_POINT2);
        const w = Math.abs(Math.floor(ptMax.x - ptMin.x)),
            h = Math.abs(Math.floor(ptMax.y - ptMin.y));
        params.size = w + ',' + h;
        params.format = this.options.format;
        params.transparent = this.options.transparent;
        const projection = map.getProjection();
        //}{axmand debug
        params.bboxSR = this.options.bboxSR || '4326';
        //强制要求是4326
        const code = projection.code;
        params.imageSR = this.options.imageSR || code.substring('EPSG:'.length);
        return params;
    }
}

ImageMapLayer.mergeOptions(options);

ImageMapLayer.registerRenderer('canvas', maptalks.renderer.ImageLayerCanvasRenderer);
ImageMapLayer.registerRenderer('gl', maptalks.renderer.ImageLayerGLRenderer);

