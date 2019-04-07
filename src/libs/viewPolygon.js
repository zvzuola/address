import * as turf from '@turf/turf';
import * as altizureUtil from '@/utils/altizureUtil';
import * as api from '@/api/api';
import PolygonMarker from '@/libs/polygonMarker';

const getStyles = () => ({
  color: 0x0000ff,
  opacity: 0.5
});

export default class ViewPolygon {
  constructor({
    sandbox,
    gs
  }) {
    this.gs = gs;
    this.sandbox = sandbox;
    this.refreshMarkers = altizureUtil.debounce(this.refreshMarkers, 500).bind(this);
    this.refreshMarkers();
    this.sandbox.on('cameraChange', this.refreshMarkers);
  }

  getGeojsonByPolygon(polygon) {
    const level = altizureUtil.getLevel(this.sandbox);
    this.loadingResident = true;
    return api.getGeojson(polygon, level).then(geoJson => {
      this.loadingResident = false;
      return geoJson;
    });
  }

  updateLevel(level) {
    const changed = this.level !== level;
    if (changed && this.markers) {
      // 层级变化
      this.markers.destruct();
    }
    this.level = level;
    return changed;
  }

  refreshMarkers = () => {
    const level = altizureUtil.getLevel(this.sandbox);
    const view = altizureUtil.getView(this.sandbox);
    if (level === -1) {
      return;
    }
    const levelChanged = this.updateLevel(level);
    const polygon = altizureUtil.getPolygonFromView(view);
    // this.drawViewPolygon({ features: [polygon] });
    if (!this.polygon || levelChanged) {
      this.polygon = polygon;
      this.addMarkers(this.polygon);
      return;
    }

    const removePolygon = turf.difference(this.polygon, polygon);
    const addPolygon = turf.difference(polygon, this.polygon);
    console.log('addpolygon');
    // if (!addPolygon) return;
    if (removePolygon) {
      this.removeMarkers(removePolygon);
    }
    if (addPolygon) {
      this.updateMarkers(addPolygon);
    }
    // this.drawRemovePolygon({ features: [removePolygon] });
    // this.drawAddPolygon({ features: [addPolygon] });
    this.polygon = polygon;
  }

  addMarkers(polygon) {
    return this.getGeojsonByPolygon(polygon).then(geoJson => {
      if (!geoJson.features) return;
      this.markers = new PolygonMarker({
        sandbox: this.sandbox,
        gs: this.gs,
        geoJson,
        styles: getStyles,
        // createMarkerCallback: this.createPolygonMarkerCallback
      });
    });
  }

  updateMarkers(polygon) {
    return this.getGeojsonByPolygon(polygon).then(geoJson => {
      if (!geoJson.features) return;
      this.markers.addMarkers(geoJson);
    });
  }

  removeMarkers(polygon) {
    return this.getGeojsonByPolygon(polygon).then(geoJson => {
      if (!geoJson.features) return;
      this.markers.removeMarkers(geoJson);
    });
  }

  drawViewPolygon(geoJson) {
    if (this.vpolygon) {
      this.vpolygon.destruct();
      this.vpolygon = undefined;
    }
    this.vpolygon = new PolygonMarker({
      sandbox: this.sandbox,
      gs: this.gs,
      geoJson,
      styles: () => ({
        color: 0xf18100,
        top: 30,
        bottom: 10,
        opacity: 0.5
      }),
    });
  }

  drawRemovePolygon(geoJson) {
    if (this.removePolygon) {
      this.removePolygon.destruct();
      this.removePolygon = undefined;
    }
    this.removePolygon = new PolygonMarker({
      sandbox: this.sandbox,
      gs: this.gs,
      geoJson,
      styles: () => ({
        color: 'blue',
        top: 30,
        bottom: 10,
        opacity: 0.5
      }),
    });
  }

  drawAddPolygon(geoJson) {
    if (this.addPolygon) {
      this.addPolygon.destruct();
      this.addPolygon = undefined;
    }
    this.addPolygon = new PolygonMarker({
      sandbox: this.sandbox,
      gs: this.gs,
      geoJson,
      styles: () => ({
        color: 'red',
        top: 30,
        bottom: 10,
        opacity: 0.5
      }),
    });
  }

  destruct() {
    if (this.markers) {
      this.markers.destruct();
      this.markers = undefined;
    }
    if (this.vpolygon) {
      this.vpolygon.destruct();
      this.vpolygon = undefined;
    }
    if (this.removePolygon) {
      this.removePolygon.destruct();
      this.removePolygon = undefined;
    }
    if (this.addPolygon) {
      this.addPolygon.destruct();
      this.addPolygon = undefined;
    }
    this.sandbox.off('cameraChange', this.refreshMarkers);
  }
}
