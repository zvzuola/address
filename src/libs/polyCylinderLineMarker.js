/**
 * 添加线
 * options: {
    sandbox: sandbox,
    points: pts,
    lineWidth: 0.5,
    depthTest: true,
    color: 0xff111,
    labelsVisible: true,
    textOptions: defaultTextOptions
  }
 */
import BaseMarker from './baseMarker';

const { altizure } = window;

export default class PolyCylinderLineMarker extends BaseMarker {
  constructor(options) {
    super();
    if (options instanceof Array) {
      this.markers = options.map(v => new altizure.PolyCylinderLineMarker(v));
    } else {
      this.markers = new altizure.PolyCylinderLineMarker(options);
    }
  }
}
