/**
 * reference:
 * https://github.com/Esri/esri-leaflet/blob/master/src/Layers/ImageMapLayer.js
 */
import * as maptalks from 'maptalks';

import ImageService from './../Services/ImageService';

const options={
    updateInterval:150,
    format:'jpgpng',
    transparent:true,
    f:'image',
    url,
}


export default class ImageMapLayer extends maptalks.Layer{

    constructor(id,options){
        super(id,options);
        this._url = options.url;
        this._service = new ImageService(this._url);
        this._identify();
    }

    _identify(){
        this._service.identify().run(function(resp){
            var s ="";
        },this);
    }
}


ImageMapLayer.registerRenderer('canvas',class extends maptalks.renderer.CanvasRenderer{

    draw(){

    }

});
