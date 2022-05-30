# maptalks.esri

A plugin to load ArcGIS service.

## Demo

* [FeatureLayerService's Demo](https://maptalks.org/maptalks.esri/demo/FeatureLayer.html)
* [FeatureLayerService Dynamic Condition Demo](https://maptalks.org/maptalks.esri/demo/FeatureLayer-where.html)
* [ImageLayerService Demo](https://maptalks.org/maptalks.esri/demo/ImageLayer.html)
* [IdentifyService Demo](https://maptalks.org/maptalks.esri/demo/identify.html)
* [DynamicMapLayer Demo](https://maptalks.org/maptalks.esri/demo/DynamicMapLayer.html)
* [DynamicMapLayer 4326 Demo](https://maptalks.org/maptalks.esri/demo/DynamicMapLayer-4326.html)

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
    const service1 = new maptalks.esri.ImageLayerService(/* params */);
</script>
```

### ESM Module

```js
import { FeatureLayerService, ImageLayerService } from 'maptalks.esri';
const service = new FeatureLayerService(/* params */);
const service1 = new ImageLayerService(/* params */);
```

## Code samples

### Load FeatureLayer Service

```js
const service = new maptalks.esri.FeatureLayerService({
    url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/Earthquakes_Since1970/MapServer/0',
    // 数据的坐标系，不设置时则默认使用map的坐标系，如果设置，则会按该坐标系转换为map的坐标系
    // projection: 'EPSG:3857',
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

function query() {
    const extent = map.getExtent();
    const geometry = [extent.xmin, extent.ymin, extent.xmax, extent.ymax].join(',');
    service.query({
        geometry: geometry,
        geometryType: 'esriGeometryEnvelope'
    }).then(json => {
        json = JSON.parse(json);
        console.log('fetures count:', json.features.length);
        const geometries = service.toGeometry(json);
        pointLayer.clear();
        pointLayer.addGeometry(geometries);
                // map.setCenterAndZoom(extent.getCenter(), zoom);
    });
}
map.on('viewchange', query);
query();
```

### Load Image Map Service

```js

var service = new maptalks.esri.ImageLayerService({
    url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/PoolPermits/MapServer/export',
    debug: true,
    map,
    // 数据的坐标系，不设置时则默认使用map的坐标系，如果设置，则会按该坐标系转换为map的坐标系
    // projection: 'EPSG:3857',
});

 var imageLayer = new maptalks.ImageLayer('imagemaplayer');
 map.addLayer(imageLayer);

function query() {
    service.query().then(json => {
        json = JSON.parse(json);
        if (json.href) {
            const extent = map.getExtent();
            const geometry = [extent.xmin, extent.ymin, extent.xmax, extent.ymax];
            imageLayer.setImages([{
                url: json.href,
                    extent: geometry
                }]);
        }
    })
}

 map.on('viewchange', query);
 query();
```
