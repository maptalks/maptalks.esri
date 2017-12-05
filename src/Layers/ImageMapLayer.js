/**
 * reference:
 * https://github.com/Esri/esri-leaflet/blob/master/src/Layers/ImageMapLayer.js
 */
import * as maptalks from 'maptalks';
import ImageService from './../Services/ImageService';
import merge from './../Utils/merge';
import Delaunay from './../Utils/delaunay';

const _options = {
    renderer: maptalks.Browser.webgl ? 'gl' : 'canvas',
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

    onLoad() {
        if (this.cacheData) {
            return true;
        }
        //export image 用于render
        let params = this._buildExportParams();
        this._service.exportImage(params).then(resp => {
            //获取结果图片地址
            this._cacheData = JSON.parse(resp);
            this._buildDelaunay();
            //
            this.load();
        }, err => {

        });
        return false;
    }

    get cacheData() {
        return this._cacheData;
    }

    get tin(){
        return {
            vertices:this._vertices,
            triangles:this._triangles
        };
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

    _buildDelaunay() {
        const width = 800,
            height=600;
        let vertices = new Array(256), i, x, y;
        for (i = vertices.length; i--;) {
            do {
                x = Math.random() - 0.5;
                y = Math.random() - 0.5;
            } while (x * x + y * y > 0.25);
            x = (x * 0.96875 + 0.5) * width;
            y = (y * 0.96875 + 0.5) * height;
            vertices[i] = [x, y];
        }
        let triangles = Delaunay.triangulate(vertices);
        this._vertices = vertices;
        this._triangles = triangles;
    }

}


class ImageCanvasRenderer extends maptalks.renderer.CanvasRenderer {


    onAdd() {

    }

    draw() {
        this.prepareCanvas();
        this._drawImage();
    }

    _drawImage() {
        let imgObj = this.layer.cacheData;
        const nw = new maptalks.Coordinate(imgObj.extent.xmin, imgObj.extent.ymax)
        let that = this;
        if (!!imgObj) {
            let img = new Image();
            img.onload = () => {
                const pt = this.getMap()._prjToContainerPoint(nw);
                this.context.drawImage(img, pt.x, pt.y);
                this.completeRender();
            };
            img.src = imgObj.href;
        }
    }

    drawOnInteracting() {
        //this.draw()
        //交互时的绘制，无需请求新的图片，直接绘制上一次获取到的map image
    }

    hitDetect() {
        return false;
    }

    //事件结束后的回调函数

    onZoomEnd() {
        super.onZoomEnd();
    }

    onMoveEnd() {
        super.onMoveEnd();
    }

    onDragRotateEnd() {
        super.onDragRotateEnd();
    }

};

ImageMapLayer.registerRenderer('canvas', ImageCanvasRenderer);

ImageMapLayer.registerRenderer('gl', class extends maptalks.renderer.ImageGLRenderable(ImageCanvasRenderer) {

    draw() {
        this.prepareCanvas();
        this._drawImage();
    }

    _drawImage() {
        const imgObj = this.layer.cacheData;
        const map = this.getMap(),
            glZoom = map.getGLZoom(),
            glScale = map.getGLScale();
        const that = this;
        if (!!imgObj) {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = function () {
                const nw = new maptalks.Coordinate(imgObj.extent.xmin, imgObj.extent.ymax);
                let pt = that.layer.getMap()._prjToPoint(nw, glZoom);
                const w = img.width * glScale,
                    h = img.height * glScale;
                that.drawGLtin(img,that.layer.tin, pt.x, pt.y, w, h, 1);
                that.completeRender();
            }
            img.src = imgObj.href;
        }
    }

    drawOnInteracting() {
        //this.draw()
        //交互时的绘制，无需请求新的图片，直接绘制上一次获取到的map image
    }

    onCanvasCreate() {
        this.prepareGLCanvas();
    }

    resizeCanvas(canvasSize) {
        if (!this.canvas) {
            return;
        }
        super.resizeCanvas(canvasSize);
        this.resizeGLCanvas();
    }

    clearCanvas() {
        if (!this.canvas) {
            return;
        }
        super.clearCanvas();
        this.clearGLCanvas();
    }

    getCanvasImage() {
        if (this.glCanvas && this.isCanvasUpdated()) {
            const ctx = this.context;
            if (maptalks.Browser.retina) {
                ctx.save();
                ctx.scale(1 / 2, 1 / 2);
            }
            // draw gl canvas on layer canvas
            ctx.drawImage(this.glCanvas, 0, 0);
            if (maptalks.Browser.retina) {
                ctx.restore();
            }
        }
        return super.getCanvasImage();
    }

    onRemove() {
        this.removeGLCanvas();
    }
});
