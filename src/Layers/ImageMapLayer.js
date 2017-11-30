/**
 * reference:
 * https://github.com/Esri/esri-leaflet/blob/master/src/Layers/ImageMapLayer.js
 */
import * as maptalks from 'maptalks';
import ImageService from './../Services/ImageService';
import merge from './../Utils/merge';

const _options = {
    updateInterval: 150,
    format: 'jpgpng',
    transparent: true,
    f: 'image',
}


export default class ImageMapLayer extends maptalks.Layer {

    constructor(id, options = {}) {
        super(id, options);
        this._options = merge({}, _options, options);
        this._url = options.url;
        this._service = new ImageService(this._url);
    }
    /**
     * 当layer加载到map后，调用onAdd方法
     */
    onAdd() {
        //export image 用于render
        let params = this._buildExportParams(),
            that = this;
        this._service.exportImage(params).then(function (resp) {
            //获取结果图片地址
            that._cacheData = JSON.parse(resp);
        }, function (err) {

        })
    }

    get cacheData() {
        return this._cacheData;
        // if (this._cacheData === null)
        //     return null;
        // let [...cacheData] = [this._cacheData];
        // this._cacheData = null;
        // return cacheData[0];
    }

    _buildExportParams() {
        //空的params
        let map = this.getMap(),
            params = {},
            prj_extent = map.getProjExtent(),
            map_size = map.getSize();
        params.bbox = [prj_extent.xmin, prj_extent.ymin, prj_extent.xmax, prj_extent.ymax];
        params.size = map_size.width + ',' + map_size.height;
        params.format = this._options.format;
        params.transparent = this._options.transparent;
        //}{axmand debug
        params.bboxSR = "";
        params.imageSR = "";
        return params;
    }


}


ImageMapLayer.registerRenderer('canvas', class extends maptalks.renderer.CanvasRenderer {


    onAdd() {

    }

    draw() {
        this.prepareCanvas();
        this._drawImage();
        this.completeRender();
    }

    _drawImage() {
        let imgObj = this.layer.cacheData;
        let that = this;
        if (!!imgObj) {
            let img = new Image();
            img.src = imgObj.href;
            img.onload = function () {
                let pt = that.layer.getMap()._prjToContainerPoint(new maptalks.Coordinate(imgObj.extent.xmin, imgObj.extent.ymax));
                that.context.drawImage(img, pt.x, pt.y);
            }
        }
    }

    drawOnInteracting() {
        this.draw();
    }

});
