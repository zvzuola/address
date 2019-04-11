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

import * as altizureUtil from '@/utils/altizureUtil';
import BaseMarker from './baseMarker';

const { altizure } = window;
const noop = () => { };

export default class TextTagMarker extends BaseMarker {
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
    const { type, coordinates } = feature.geometry;
    if (type === 'Point') {
      const marker = new altizure.TextTagMarker({
        position: {
          lng: coordinates[0],
          lat: coordinates[1],
          alt: feature.properties.height || 90
        },
        sandbox: this.sandbox,
        ...this.getStyles(feature)
      });
      marker.feature = feature;
      marker.originFeature = feat;
      this.createMarkerCallback(marker);
      this.markersMap.set(key, marker);
    }
  }

  getStyles(feature) {
    const defaultStyles = {
      textStyle: {
        fillStyle: '#f5f2f1',
        font: '500 30px Arial',
        outlineWidth: 1.2,
        outlineStyle: '#e37373'
      }
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
