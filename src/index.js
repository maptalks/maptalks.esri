/**
 * packed all functions in ESRI namespace
 */
import ImageMapLayer from './Layers/ImageMapLayer';
import FeatureLayerService from './Layers/FeatureLayerService';
import GeometryService from './Services/GeometryService';

const esri = {
    ImageMapLayer: ImageMapLayer,
    FeatureLayerService: FeatureLayerService,
    GeometryService: GeometryService
};

export { esri }
