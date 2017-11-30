import IdentifyTask from './IdentifyTask';
import { Ajax } from 'maptalks';

/**
 * 通过identify读取配置，设置属性
 */
class IdentifyImageTask extends IdentifyTask {

    /**
     * overwrite run function for image identify
     */
    run(callback, context) {
        //调用service的reques方法，获取相应属性后设置进service
        this.request(function (error, response) {
            let resp = this._resolveResponse(response);
            callback.call(context, resp);
        }, this)
    }
    /**
     * 解析identify返回的结果
     * @param {String} response 
     */
    _resolveResponse(response) {
        let location = response.location,
            catalogItems = response.catalogItems,
            catalogItemVisibilities = response.catalogItemVisibilities;
        //
        let geoJson = {
            'pixel': {
                'type': 'Feature',
                'geometry': {
                    'type': 'Point',
                    'coordinates': [location.x, location.y]
                },
                'crs': {
                    'type': 'EPSG',
                    'properties': {
                        'code': location.spatialReference.wkid
                    }
                },
                'properties': {
                    'OBJECTID': response.objectId,
                    'name': response.name,
                    'value': response.value
                },
                'id': response.objectId
            }
        }
        //
        if (response.properties && response.properties.Values) {
            geoJSON.pixel.properties.values = response.properties.Values;
        }
        //
        if (catalogItems && catalogItems.features) {
            geoJSON.catalogItems = responseToFeatureCollection(catalogItems);
            if (catalogItemVisibilities && catalogItemVisibilities.length === geoJSON.catalogItems.features.length) {
                for (var i = catalogItemVisibilities.length - 1; i >= 0; i--) {
                    geoJSON.catalogItems.features[i].properties.catalogItemVisibility = catalogItemVisibilities[i];
                }
            }
        }
        return geoJSON;
    }

}


export default IdentifyImageTask;