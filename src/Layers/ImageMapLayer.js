/**
 * reference:
 * https://github.com/Esri/esri-leaflet/blob/master/src/Layers/ImageMapLayer.js
 */
import * as maptalks from 'maptalks';

const options={
    updateInterval:150,
    format:'jpgpng',
    transparent:true,
    f:'image',
    url,
}


export default class ImageMapLayer extends maptalks.Layer{

    constructor(id,options){

    }

}


ImageMapLayer.registerRenderer('canvas',class extends maptalks.renderer.CanvasRenderer{

    draw(){

    }

});
