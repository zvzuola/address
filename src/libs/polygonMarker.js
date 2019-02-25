/**
 * 添加垂直挤出的多边形标记
 * options: {
    volume: {
      points: pts,
      top: 40, // top must be a number for PolygonMarker
      bottom: 20, // bottom must be a number for PolygonMarker
      color: 0xf18100,
      opacity: 0.2
    },
    sandbox,
    name,
    interactable: true
  }
 */
import BaseMarker from './baseMarker';

const { altizure } = window;

export default class PolygonMarker extends BaseMarker {
  constructor(options) {
    super();
    if (options instanceof Array) {
      this.markers = options.map(v => new altizure.PolygonMarker(v));
    } else {
      this.markers = new altizure.PolygonMarker(options);
    }
    this.traverse((marker) => {
      marker.interactable = true;
      marker.on('mouseenter', () => {
        marker.opacity = 0.3;
      });
      marker.on('mouseleave', () => {
        marker.opacity = 0.1;
      });
      marker.on('click', () => {
        marker.color = Math.random() * 0xffffff;
      });
    });
  }
}
