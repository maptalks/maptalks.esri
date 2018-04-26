/**
 * packed all functions in ESRI namespace
 */
import ImageMapLayer from './Layers/ImageMapLayer';
import FeatureLayer from './Layers/FeatureLayer';
import GeometryService from './Services/GeometryService';

const esri = {
    ImageMapLayer : ImageMapLayer,
    FeatureLayer : FeatureLayer,
    GeometryService :GeometryService
}



export {esri}