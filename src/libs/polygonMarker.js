/**
 * 创建楼层marker
 */
// import { diff } from 'deep-diff';
import _ from 'lodash';
import BaseMarker from './baseMarker';
import * as altizureUtil from '@/utils/altizureUtil';

const { altizure } = window;
const noop = () => { };
export default class PolygonMarker extends BaseMarker {
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
      // if (this.markersMap.get(key)) {
      //   this.markersMap.get(key).destruct();
      // }
    }
    const feature = altizureUtil.convertCoordinateFromFeature(feat, this.gs);
    const { type, coordinates } = feature.geometry;
    if (type === 'Polygon') {
      const marker = new altizure.PolygonMarker({
        volume: {
          points: coordinates[0].map(lnglat => new altizure.LngLatAlt(lnglat[0], lnglat[1], 0)),
          ...this.getStyles(feature)
        },
        sandbox: this.sandbox,
      });
      marker.feature = feature;
      marker.originFeature = feat;
      this.createMarkerCallback(marker);
      this.markersMap.set(key, marker);
    }
  }

  getStyles(feature) {
    const defaultStyles = {
      top: 20,
      bottom: 0.1,
      color: 255,
      opacity: 0.3
    };
    const { elevation, height } = feature.properties;
    if (elevation && height) {
      defaultStyles.bottom = parseInt(elevation, 10);
      defaultStyles.top = parseInt(elevation, 10) + parseInt(height, 10);
    }
    let styles = typeof this.styles === 'function' ? this.styles(feature) : this.styles;
    styles = Object.assign({}, defaultStyles, styles);
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

  replaceMarkers(geoJson) {
    this.destruct();
    this.geoJson = geoJson;
    this.pushRenderTasks(geoJson.features);
    this.createMarkersByRequestIdleCallback();
  }

  addMarkers(geoJson) {
    this.geoJson = {
      ...geoJson,
      features: [...this.geoJson.features, ...geoJson.features]
    };
    this.pushRenderTasks(geoJson.features);
    this.createMarkersByRequestIdleCallback();
  }

  pushRenderTasks(features) {
    this.renderTasks = _.unionWith(this.renderTasks, features, _.isEqual);
  }

  removeMarkers(geoJson) {
    if (!geoJson.features) return;
    geoJson.features.forEach(feature => {
      this.removeMarkerByfeature(feature);
    });
  }

  removeMarkerByfeature(feature) {
    const key = JSON.stringify(feature);
    if (this.markersMap.has(key)) {
      if (this.markersMap.get(key)) {
        this.markersMap.get(key).destruct();
      }
      this.markersMap.delete(key);
    }
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
