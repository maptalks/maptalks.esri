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
};

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
        const params = this._buildExportParams();
        this._service.exportImage(params).then(resp => {
            //获取结果图片地址
            this._cacheData = JSON.parse(resp);
            this._width = this._cacheData.width;
            this._height = this._cacheData.height;
            this._buildDelaunay();
            this.load();
        }, err => {
            console.log(err);
        });
        return false;
    }

    get cacheData() {
        return this._cacheData;
    }

    get tin() {
        return {
            w:this._width,
            h:this._height,
            vertices: this._vertices,
            triangles: this._triangles
        };
    }

    _buildExportParams() {
        //空的params
        const map = this.getMap(),
            params = {},
            prjExtent = map.getProjExtent(),
            mapSize = map.getSize();
        params.bbox = [prjExtent.xmin, prjExtent.ymin, prjExtent.xmax, prjExtent.ymax];
        params.size = mapSize.width + ',' + mapSize.height;
        params.format = this._options.format;
        params.transparent = this._options.transparent;
        //}{axmand debug
        params.bboxSR = '';
        params.imageSR = '';
        return params;
    }

    _buildDelaunay() {
        const vertices = new Array(48),
            w = this._width,
            h = this._height;
        let i, x, y;
        for (i = vertices.length; i--;) {
            do {
                x = Math.random() - 0.5;
                y = Math.random() - 0.5;
            } while (x * x + y * y > 0.25);
            x = (x * 0.96875 + 0.5) * w;
            y = (y * 0.96875 + 0.5) * h;
            vertices[i] = [x, y];
        }
        const triangles = Delaunay.triangulate(vertices);
        //更新vertices
        for (i = vertices.length; i--;) {
            vertices[i] = vertices[i].concat(Math.random() * 30);
        }
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
        const imgObj = this.layer.cacheData,
            nw = new maptalks.Coordinate(imgObj.extent.xmin, imgObj.extent.ymax);
        if (imgObj) {
            const img = new Image();
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

}

ImageMapLayer.registerRenderer('canvas', ImageCanvasRenderer);

ImageMapLayer.registerRenderer('gl', class extends maptalks.renderer.ImageGLRenderable(ImageCanvasRenderer) {

    draw() {
        this.prepareCanvas();
        this._drawImage();
    }

    _drawImage() {
        const imgObj = this.layer.cacheData,
            that = this;
        const map = this.getMap(),
            glZoom = map.getGLZoom(),
            glScale = map.getGLScale(),
            vertices = this.layer.tin.vertices,
            triangles = this.layer.tin.triangles,
            w = this.layer.tin.w,
            h = this.layer.tin.h,
            len = vertices.length;

        if (imgObj) {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = function () {
                const nw = new maptalks.Coordinate(imgObj.extent.xmin, imgObj.extent.ymax);
                const pt = that.layer.getMap()._prjToPoint(nw, glZoom);
                const vtcs = [],
                    txcoord = [];
                for (let i = 0; i < len; i++) {
                    //1.build vertices
                    vtcs.push(pt.x + vertices[i][0] * glScale);
                    vtcs.push(pt.y + vertices[i][1] * glScale);
                    vtcs.push(vertices[i][2]);
                    //2.build txcoord
                    txcoord.push(vertices[i][0] / w);
                    txcoord.push(vertices[i][1] / h);
                }
                that.drawTinImage(img, vtcs, txcoord, triangles, 1);
                that.completeRender();
            };
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
