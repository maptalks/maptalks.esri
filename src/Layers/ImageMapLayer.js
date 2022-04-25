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

const TEMP_COORD = new maptalks.Coordinate(0, 0);

export default class ImageMapLayer extends maptalks.ImageLayer {

    constructor(id, options = {}) {
        super(id, [], options);
        this._url = options.url;
        this._service = new ImageService(this._url);
        this._esriImages = [];
    }

    getEvents() {
        return {
            'zoomend moveend rotateend': function () {
                this._reLoad();
            }
        }
    }

    _reLoad() {
        //export image 用于render
        const params = this._buildExportParams();
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
            const renderer = this.getRenderer();
            if (renderer) {
                renderer.setToRedraw();
            }
        }, err => {
            console.log(err);
        });
        return true;
    }

    onAdd() {
        this._reLoad();
        super.onAdd();
    }


    _buildExportParams() {
        const params = {},
            map = this.getMap(),
            mapExtent = map.getExtent();
        const paramExtent = this.options.extent && new maptalks.Extent(this.options.extent);

        const extent = paramExtent ? paramExtent.intersection(mapExtent) : mapExtent;

        params.bbox = [extent.xmin, extent.ymin, extent.xmax, extent.ymax];
        //计算size
        const min = new maptalks.Coordinate(params.bbox[0], params.bbox[1]);
        const ptMin = map.coordToContainerPoint(min);
        const max = new maptalks.Coordinate(params.bbox[2], params.bbox[3]);
        const ptMax = map.coordToContainerPoint(max);
        const w = Math.floor(ptMax.x - ptMin.x),
            h = Math.abs(Math.floor(ptMax.y - ptMin.y));
        params.size = w + ',' + h;
        params.format = this.options.format;
        params.transparent = this.options.transparent;
        const projection = map.getProjection();
        //}{axmand debug
        params.bboxSR = '4326';
        //强制要求是4326
        const code = projection.code;
        params.imageSR = code.substring('EPSG:'.length);
        return params;
    }
}

ImageMapLayer.mergeOptions(options);

ImageMapLayer.registerRenderer('canvas', maptalks.renderer.ImageLayerCanvasRenderer);
ImageMapLayer.registerRenderer('gl', maptalks.renderer.ImageLayerGLRenderer);

