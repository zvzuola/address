import BaseMarker from './baseMarker';

const { altizure } = window;

/**
 * 创建文本标记
 * options: {
    text: b.properties.Street,
    // text style
    textStyle: {
      fillStyle: '#f5f2f1',
      font: '500 30px Arial',
      outlineWidth: 1.2,
      outlineStyle: '#e37373'
    },
    // icon position
    position: {
      lng: b.geometry.coordinates[0],
      lat: b.geometry.coordinates[1],
      alt: 60
    },
    // scene
    sandbox,
    scale: 30 // icon size
  }
 */
export default class TextTagMarker extends BaseMarker {
  constructor(options) {
    super();
    if (options instanceof Array) {
      this.markers = options.map(v => new altizure.TextTagMarker(v));
    } else {
      this.markers = new altizure.TextTagMarker(options);
    }
  }
}
