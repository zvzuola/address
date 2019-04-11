import * as altizureUtil from '@/utils/altizureUtil';
import BaseMarker from './baseMarker';

const { altizure } = window;
const noop = () => { };

/**
 * 标记标记始终朝向相机并保持其屏幕空间大小
 * options: {
    position: {lng: 121.62199313850867, lat: 31.21593319676947, alt: 0},
    radius: 100,
    top: 100,
    bottom: 1,
    color: 0x0000ff,
    opacity: 0.3,
    sandbox: sandbox
  }
 */
export default class CylinderVolumeMarker extends BaseMarker {
  constructor({
    geoJson,
    sandbox,
    gs,
    styles,
    createMarkerCallback,
  }) {
    super();
    this.sandbox = sandbox;
    this.geoJson = geoJson;
    this.gs = gs;
    this.styles = styles || {};
    this.createMarkerCallback = createMarkerCallback || noop;
    this.markersMap = new Map();
    this.renderTasks = [];
    this.pushRenderTasks(geoJson.features);
    this.createMarkersByRequestIdleCallback();
  }

  createMarker(feat) {
    const key = JSON.stringify(feat);
    if (this.markersMap.has(key)) {
      return;
    }
    const feature = altizureUtil.convertCoordinateFromFeature(feat, this.gs);
    const { coordinates } = feature.geometry;
    const marker = new altizure.CylinderVolumeMarker({
      position: {
        lng: coordinates[0],
        lat: coordinates[1],
        alt: 0
      },
      sandbox: this.sandbox,
      ...this.getStyles(feature)
    });
    marker.feature = feature;
    marker.originFeature = feat;
    this.createMarkerCallback(marker);
    this.markersMap.set(key, marker);
  }

  getStyles(feature) {
    const defaultStyles = {
      radius: 100,
      top: 100,
      bottom: 1,
      color: 0x0000ff,
      opacity: 0.3,
    };
    if (typeof this.styles === 'function') {
      return Object.assign({}, defaultStyles, this.styles(feature));
    }
    const styles = Object.assign({}, defaultStyles, this.styles);
    return styles;
  }

  createMarkersByRequestIdleCallback() {
    if (this.isRequestIdleCallbackScheduled) return;
    this.isRequestIdleCallbackScheduled = true;
    requestAnimationFrame(this.processPendingTasks);
  }

  processPendingTasks = () => {
    this.isRequestIdleCallbackScheduled = false;
    const tasks = this.renderTasks.splice(0, 30);
    tasks.forEach(v => this.createMarker(v));
    if (this.renderTasks.length > 0) {
      this.createMarkersByRequestIdleCallback();
    }
  }

  pushRenderTasks(features) {
    // this.renderTasks = _.unionWith(this.renderTasks, features, _.isEqual);
    this.renderTasks.push(...features);
  }

  destruct() {
    const markers = this.markersMap.values();
    for (const marker of markers) {
      marker.destruct();
    }
    this.markersMap.clear();
    this.renderTasks = [];
  }
}
