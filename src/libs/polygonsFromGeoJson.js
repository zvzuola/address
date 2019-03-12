/**
 * 创建图层，给图层绑定事件
 * 需要依赖插件 altizure-plugin-geojson
 */
// import { polygonsFromGeoJson } from 'altizure-plugin-geojson';
import BaseMarker from './baseMarker';

const { altizure } = window;
const { polygonsFromGeoJson } = altizure.GeoJson;

export default class PolygonsFromGeoJson extends BaseMarker {
  constructor({ geoJson, sandbox, options = {} }) {
    super();
    this.markers = polygonsFromGeoJson(geoJson, sandbox, Object.assign({}, {
      top: 20,
      bottom: 0,
      color: 0xff0000,
      opacity: 0.2
    }, options));
    this.sandbox = sandbox;

    this.traverse((marker) => {
      marker.interactable = true;
      marker.on('mouseenter', () => {
        marker.opacity = 1;
      });
      marker.on('mouseleave', () => {
        marker.opacity = 0.3;
      });
    });
  }
}
