# maptalks.esri

A plugin to load ArcGIS service.

## Install

```shell
npm i maptalks.esri --save
```

## Usage

### In Browser
```html
<script src="https://unpkg.com/maptalks/dist/maptalks.js"></script>
<script src="https://unpkg.com/maptalks.esri/dist/maptalks.esri.js"></script>
<script type="text/javascript">
    const service = new maptalks.esri.FeatureLayerService(/* params */);
    const imageLayer = new maptalks.esri.ImageMapLayer(/* params */);
</script>
```

### ESM Module

```js
import { FeatureLayerService, ImageMapLayer } from 'maptalks.esri';
const service = new FeatureLayerService(/* params */);
const imageLayer = new ImageMapLayer(/* params */);
```

## Code samples

### Load FeatureLayer Service

```js
const service = new maptalks.esri.FeatureLayerService({
    url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/Earthquakes_Since1970/MapServer/0',
    // 数据的坐标系，不设置时则默认使用map的坐标系，如果设置，则会按该坐标系转换为map的坐标系
    projection: 'EPSG:3857',
    symbol: {
        markerType: 'ellipse',
        markerWidth: 12,
        markerHeight: 12,
        markerFill: '#f00',
        markerFillOpacity: 0.5,
        markerLineColor: '#000',
        markerLineWidth: 2
    }
});

const pointLayer = new maptalks.PointLayer('polygon');
const groupLayer = new maptalks.GroupGLLayer('group', [pointLayer]).addTo(map);

service.query().then(features => {
    const geometries = service.toGeometry(features);
    pointLayer.addGeometry(geometries);
    const extent = pointLayer.getExtent();
    const zoom = map.getFitZoom(extent);
    map.setCenterAndZoom(extent.getCenter(), zoom);
});
```

### Load Image Map Service

```js
var map = new maptalks.Map('mapDiv', {
    center: [-122.23, 37.75],
    zoom: 10,
    attribution: {
        content: '&copy; <a href="http://osm.org">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/">CARTO</a>'
    },
    baseLayer: new maptalks.TileLayer('base', {
        urlTemplate: 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
        subdomains: ['a', 'b', 'c', 'd']
    })
});
const extent = map.getExtent();
//esri imagelayer
var imageLayer = new maptalks.esri.ImageMapLayer('imagemaplayer',{
    renderer : 'gl',
    extent: [extent.xmin, extent.ymin, extent.xmax, extent.ymax],
    url: 'https://landsat.arcgis.com/arcgis/rest/services/Landsat/PS/ImageServer'
});

map.addLayer(imageLayer);
```

## Demo

* [FeatureLayerService's Demo](https://maptalks.org/maptalks.esri/demo/FeatureLayer.html)
* [ImageMapLayer's Demo](https://maptalks.org/maptalks.esri/demo/ImageLayer.html)
