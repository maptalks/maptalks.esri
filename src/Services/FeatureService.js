
import cors from './../Utils/cors';
import Service from './Service';
import MetadataTask from './../Support/MetadataTask';
import QueryTask from './../Support/QueryTask';
import FeaturesTask from './../Support/FeaturesTask';
import { Util } from 'maptalks';
import { outService } from '../servicequeryqueue';

/**
 * default ImageService options
 */
const options = {
    proxy: false,
    useCors: cors,
    timeout: 0
};

/**
 * imageService对应arcgis发布的的supported operations
 * -Export Image
 * -Query
 * -Identify
 * -Coumpute Histograms
 * -Get Samples
 * -Compute Class Statistics
 */
export default class FeatureService extends Service {
    constructor(options = {}) {
        super(options.url, options);
        this.gridQueries = {};
        this.gridIndex = 0;
    }

    queryInGrids(queryId) {
        return this.gridQueries[queryId];
    }
    /**
     * 获取服务的　?f=json 配置信息
     * @returns {Promise}
     */
    metadata() {
        /**
         * @type {MetadataTask}
         */
        this._metadataTask = this._metadataTask || new MetadataTask(this);
        return this._metadataTask.run();
    }

    _QueryParams(option) {
        const geometry = option.geometry || '';
        const condition = {
            where: option.where || '1=1',
            geometry: (geometry instanceof Object) ? JSON.stringify(geometry) : geometry,
            geometryType: option.geometryType || 'esriGeometryPoint',
            inSR: option.inSR || '',
            spatialRel: option.esriSpatialRelIntersects || 'esriSpatialRelIntersects',
            relationParam: option.relationParam || '',
            objectIds: option.objectIds || '',
            time: option.time || '',
            returnCountOnly: option.returnCountOnly || false,
            returnGeometry: option.returnGeometry || true,
            maxAllowableOffset: option.maxAllowableOffset || '',
            outSR: option.outSR || '',
            text: option.text || '',
            outFields: option.outFields || '*'
        };
        return condition;
    }

    _AddParams(features) {
        return {
            features: features,
            gdbVersion: '',
            rollbackOnFailure: true,
            f: 'pjson'
        }
    }

    _UpdateParams(features) {
        return {
            features: features,
            gdbVersion: '',
            rollbackOnFailure: true,
            f: 'pjson'
        }
    }

    _deleteParams(option) {
        if (option.objectIds) {
            return {
                objectIds: option.objectIds,
                f: 'pjson'
            }
        } else {
            const geometry = option.geometry;
            return {
                where: option.where || '1=1',
                geometry: (geometry instanceof Object) ? JSON.stringify(geometry) : geometry,
                geometryType: option.geometryType || 'esriGeometryPoint',
                inSR: option.inSR || '',
                spatialRel: option.esriSpatialRelIntersects || 'esriSpatialRelIntersects',
                f: 'pjson'
            };
        }
    }

    /**
     *
     * @param {*} extent
     * @returns
     */
    quarterExtent(extent) {
        const [xmin, ymin, xmax, ymax] = extent.split(',').map(number => {
            return parseFloat(number);
        });
        const extents = [];
        for (let i = 0, cols = 2; i < cols; i++) {
            const minx = xmin + (xmax - xmin) / cols * i, maxx = minx + (xmax - xmin) / cols;
            for (let j = 0, rows = 2; j < rows; j++) {
                const miny = ymin + (ymax - ymin) / rows * j, maxy = miny + (ymax - ymin) / rows;
                extents.push([minx, miny, maxx, maxy].join(','));
            }
        }
        return extents;
    }

    _getGrids(params) {
        const extents = this.quarterExtent(params.geometry);
        const grids = extents.map(extent => {
            const queryId = this.getQueryTaskId();
            const service = Util.extend({ id: this.id, queryId, result: null });
            this.gridQueries[queryId] = service;
            const options = Util.extend({}, params, { geometry: extent, __queryId: queryId });
            const task = new QueryTask(this);
            task.params = options;
            return {
                queryId,
                params: options,
                task
            };
        });
        return grids;
    }

    _gridsQuery(grids, callback) {
        grids.forEach(grid => {
            grid.task.run().then(res => {
                const { queryId, params } = grid;
                let result = {};
                try {
                    result = JSON.parse(res);
                } catch (error) {
                    console.error(error);
                }
                if (result && result.features.length >= 1000) {
                    //delete parent tile
                    delete this.gridQueries[queryId];
                    //tile children
                    const grids = this._getGrids(params);
                    this._gridsQuery(grids, callback);
                } else if (this.gridQueries[queryId]) {
                    this.gridQueries[queryId].result = result;
                    this.gridIndex++;
                }
                if (this.gridIndex === Object.keys(this.gridQueries).length) {
                    callback();
                }
            })
        });
    }

    _mergeGridQueryResult() {
        const result = {};
        for (const id in this.gridQueries) {
            Util.extend(result, this.gridQueries[id].result);
        }
        result.features = [];
        for (const id in this.gridQueries) {
            const features = (this.gridQueries[id].result || {}).features || [];
            features.forEach(feature => {
                result.features.push(feature);
            });
        }
        return result;
    }

    query(option = {}) {
        for (const id in this.gridQueries) {
            outService(this.gridQueries[id]);
        }
        this.gridQueries = {};
        this.gridIndex = 0;
        const params = this._QueryParams(option);
        if (option.gridQuery) {
            const grids = this._getGrids(params);
            return new Promise((resolve, reject) => {
                this._gridsQuery(grids, () => {
                    resolve(JSON.stringify(this._mergeGridQueryResult()));
                });
            });
        } else {
            this._queryTask = this._queryTask || new QueryTask(this);
            this._queryTask.params = params;
            return this._queryTask.run();
        }
    }

    addFeatures(features) {
        const params = this._AddParams(features);
        this._FeaturesTask = this._FeaturesTask || new FeaturesTask(this);
        this._FeaturesTask.params = params;
        this._FeaturesTask._path = 'addFeatures';
        return this._FeaturesTask.run();
    }

    updateFeatures(features) {
        const params = this._UpdateParams(features);
        this._FeaturesTask = this._FeaturesTask || new FeaturesTask(this);
        this._FeaturesTask.params = params;
        this._FeaturesTask._path = 'updateFeatures';
        return this._FeaturesTask.run();
    }

    deleteFeatures(option = {}) {
        const params = this._deleteParams(option);
        this._FeaturesTask = this._FeaturesTask || new FeaturesTask(this);
        this._FeaturesTask.params = params;
        this._FeaturesTask._path = 'deleteFeatures';
        return this._FeaturesTask.run();
    }
}
