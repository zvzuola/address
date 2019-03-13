<template>
  <sidebar>
    <el-button :disabled="!sandbox" @click="draw">空间查询</el-button>
  </sidebar>
</template>
<script>
import { mapState } from 'vuex';
import * as util from '@/utils/altizureUtil';
import PolygonsFromGeoJson from '@/libs/polygonsFromGeoJson';
import PolygonMarker from '@/libs/polygonMarker';
import Sidebar from '@/components/sidebar/Sidebar';

const { altizure } = window;

export default {
  components: {
    sidebar: Sidebar
  },
  computed: mapState({
    sandbox: state => state.sandbox,
    gs: state => state.gs
  }),
  mounted() {},
  beforeDestroy() {
    this.removeEventListener();
  },
  methods: {
    draw() {
      this.sandbox.renderer.domElement.addEventListener(
        'mousedown',
        this.handleMouseDown
      );
    },
    removeEventListener() {
      if (this.sandbox) {
        this.sandbox.renderer.domElement.removeEventListener(
          'mousedown',
          this.handleMouseDown
        );
      }

      document.removeEventListener('mousemove', this.handleMouseMove);
      document.removeEventListener('mouseup', this.handleMouseUp);
    },
    destructMarker(props) {
      const destruct = p => {
        if (this[p]) {
          this[p].destruct();
          this[p] = undefined;
        }
      };
      return !Array.isArray(props) ? destruct(props) : props.map(destruct);
    },

    handleMouseDown(e) {
      e.stopPropagation();
      e.preventDefault();
      this.destructMarker('drawPolygon');
      this.startPt = {
        x: e.pageX,
        y: e.pageY
      };

      console.log(
        this.sandbox.window.toLngLatAlt(e),
        this.sandbox.pick(e),
        this.sandbox.control.enabledOrbit
      );

      this.sandbox.control.enabledOrbit = false;

      document.addEventListener('mousemove', this.handleMouseMove);
      document.addEventListener('mouseup', this.handleMouseUp);
    },

    handleMouseMove(e) {
      const endPt = {
        x: e.pageX,
        y: e.pageY
      };

      const points = util.getView(this.sandbox, this.startPt, endPt);
      points.push(points[0]);

      const lnglatpoints = points.map(
        pt => new altizure.LngLatAlt(pt.lng, pt.lat, 0)
      );

      this.destructMarker('drawPolygon');
      this.drawPolygon = new PolygonMarker({
        sandbox: this.sandbox,
        volume: {
          points: lnglatpoints,
          top: 40,
          bottom: 0.1,
          color: 0x0000ff,
          opacity: 0.2
        }
      });
    },

    handleMouseUp(e) {
      const endPt = {
        x: e.pageX,
        y: e.pageY
      };
      const view = util.getView(this.sandbox, this.startPt, endPt);
      console.log(view);
      util.asyncGetGeojsonByView(view).then(geoJson => {
        this.destructMarker('drawPolygonsFromGeoJson');
        if (geoJson.features) {
          this.addVerticalPolygonsFromGeoJson(geoJson);
        }
      });
      this.sandbox.control.enabledOrbit = true;
      this.removeEventListener();
    },

    addVerticalPolygonsFromGeoJson(data) {
      const convertData = util.convertCoordinateFromGeoJSON(data, this.gs);
      this.drawPolygonsFromGeoJson = new PolygonsFromGeoJson({
        sandbox: this.sandbox,
        geoJson: convertData,
        options: { top: 40 }
      });
      this.drawPolygonsFromGeoJson.traverse((marker, i) => {
        const { elevation, height } = convertData.features[i].properties;
        marker.bottom = elevation + 12;
        marker.top = elevation + height + 12;
      });
    }
  }
};
</script>
