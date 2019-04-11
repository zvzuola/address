import * as altizureUtil from '@/utils/altizureUtil';
import BaseMarker from './baseMarker';

const { altizure } = window;
const noop = () => { };

/**
 * 标记标记始终朝向相机并保持其屏幕空间大小
 * options: {
    // 图标地址 img url
    imgUrl: iconMap[project.name],
    // 图标位置 icon position
    position: {
      lng: project.geometry.coordinates[0],
      lat: project.geometry.coordinates[1],
      alt: 0 // 虽然高程都赋值为0，但是不知为何 有的高有的低。
    },
    sandbox,
    // 指针[tagmarker指向地面点的指针]
    pinLength: 30,
    // 图标尺寸 如果设置了图标尺寸，则大小固定，再设置mouse的enter和leave的放大缩小设置fixedSize属性。 liuxiaoyan
    fixedSize: 30
    // 图标比例：设置之后图标的大小相对模型调整。鼠标相应事件设置scale属性。
    scale: 1
  }
 */
export default class TagMarker extends BaseMarker {
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
      const marker = new altizure.TagMarker({
        position: {
          lng: coordinates[0],
          lat: coordinates[1],
          alt: coordinates[2] || 0
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
      pinLength: 30,
      fixedSize: 30,
      scale: 1,
      imgUrl: '',
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
