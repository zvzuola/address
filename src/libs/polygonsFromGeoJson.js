/**
 * 创建图层，给图层绑定事件
 * 需要依赖插件 altizure-plugin-geojson
 */
// import { polygonsFromGeoJson } from 'altizure-plugin-geojson';
import addPolyLineMarker from './polyLineMarker';
import BaseMarker from './baseMarker';

const { altizure } = window;
const { polygonsFromGeoJson } = altizure.GeoJson;

export default class PolygonsFromGeoJson extends BaseMarker {
  constructor({ geoJson, sandbox, options = {} }) {
    super();
    this.markers = polygonsFromGeoJson(geoJson, sandbox, Object.assign({}, {
      top: 20,
      bottom: 0,
      color: 0xffffff,
      opacity: 0.2
    }, options));
    this.sandbox = sandbox;

    this.traverse((marker) => {
      marker.interactable = true;
      marker.initColor = 0xff0000 * Math.random();
      marker.color = marker.initColor;
      marker.on('click', () => {
        addPolyLineMarker(this.sandbox, marker);
        // request({ properties: poly.properties, type: '社区类' }) // 发送一个事件，传递给 2D UI 响应
      });
      marker.on('mouseenter', () => {
        marker.color = 0xff0000;
      });
      marker.on('mouseleave', () => {
        marker.color = marker.initColor;
      });
    });
  }
}
