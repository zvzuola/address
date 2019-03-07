<template>
  <div :class="$style['home']">
    <div id="page-content" :class="$style['container-map']"/>
    <div :class="$style.control">
      <checkbox
        v-show="showCheckbox"
        :data="data"
        :title="title"
        :defaultValue="['polygonMarker']"
        @change="checkboxChange"
      ></checkbox>
      <el-button @click="enableDraw">框选</el-button>
    </div>
    <el-dialog
      :visible.sync="dialogTableVisible"
      class="attribute-dlg"
      title="详细信息"
      :modal="false"
      :close-on-click-modal="false"
    >
      <div v-for="(value, key, index) in dlgData" class="attribute-row" :key="index">
        <!-- <span class="attribute-key" v-if="key == 'floor'">所在楼层:</span>
        <span class="attribute-key" v-else-if="key == 'height'">楼层高:</span>
        <span class="attribute-key" v-else-if="key == 'elevation'">楼层起始高:</span>
        <span class="attribute-key" v-else>{{key}}:</span>
        <span class="attribute-value" v-if="key !== '入驻主要企业'">{{value}}</span>
        <span class="attribute-list" v-else>
          <span v-for="(item,index) in value" :key="index">{{index+1}}. {{item}}</span>
        </span>-->
        <span class="attribute-key">
          {{key}}:
          <span class="attribute-value">{{value || '无'}}</span>
        </span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// @ is an alias to /src
import PolygonsFromGeoJson from '@/libs/polygonsFromGeoJson';
import PolygonMarker from '@/libs/polygonMarker';
// import TextTagMarker from '@/libs/textTagMarker';
// import TagMarker from '@/libs/tagMarker';
import PolyCylinderLineMarker from '@/libs/polyCylinderLineMarker';
import addPolyLineMarker, { clearPolyLineMarker } from '@/libs/polyLineMarker';
import websense from '@/utils/webscene';
import {
  convertCoordinateFromGeoJSON,
  debounce,
  getView
} from '@/utils/altizureUtil';
import axios from 'axios';
import * as turf from '@turf/turf';

import checkbox from '@/components/checkbox/Checkbox';

import boundary from '@/datas/boundary';
import community from '@/datas/community';
import jdzj from '@/datas/jdzj';
import avenue from '@/datas/avenue';
import scenic from '@/datas/scenic.json';
import zhaoshang from '@/datas/zhaoshang';

export default {
  name: 'Home',
  data() {
    return {
      dialogTableVisible: false,
      dlgData: [],
      data: [
        { label: 'polygonMarker', value: 'polygonMarker' },
        { label: 'polygonsFromGeoJson', value: 'polygonsFromGeoJson' },
        { label: 'tagMarker', value: 'tagMarker' },
        { label: 'textTagMarker', value: 'textTagMarker' },
        { label: 'polyCylinderLineMarker', value: 'polyCylinderLineMarker' },
        {
          label: 'verticalPolygonsFromGeoJson',
          value: 'verticalPolygonsFromGeoJson'
        }
      ],
      title: 'altizure基础功能',
      showCheckbox: false
    };
  },
  components: {
    checkbox
  },
  mounted() {
    websense().then(({ map, gs }) => {
      this.map = map;
      this.sandbox = map.sandbox;
      this.gs = gs;
      this.showCheckbox = true;
      this.addPolygonMarker(boundary, 'polygonMarker');

      this.map.sandbox.renderer.domElement.addEventListener(
        'mousedown',
        this.handleMouseDown
      );

      this.map.sandbox.on('cameraChange', debounce(this.cameraChange, 100));
      // console.log(markers, 0);
      // window.altizure.GeoJson.queryGeoJsonForAltizureProjectMarker(
      //   markers[0]
      // ).then(result => {
      //   console.log(result, 111);
      // });
    });
  },
  beforeDestroy() {
    this.sandbox.renderer.domElement.removeEventListener(
      'mousedown',
      this.handleMouseDown
    );
  },
  methods: {
    addPolygonMarker(points, prop) {
      this[prop] = new PolygonMarker({
        volume: {
          color: 0xf18100,
          opacity: 0.3,
          points,
          top: 30,
          bottom: 0
        },
        sandbox: this.sandbox,
        name: 'polygon'
      });
    },
    addPolygonsFromGeoJson(data, prop) {
      const convertData = convertCoordinateFromGeoJSON(data, this.gs);
      this[prop] = new PolygonsFromGeoJson({
        sandbox: this.sandbox,
        geoJson: convertData,
        options: { top: 40 }
      });
      this[prop].traverse(marker => {
        marker.on('click', () => {
          addPolyLineMarker(this.sandbox, marker);
        });
      });
      return this[prop];
    },
    addTextTagMarker(data, prop) {
      const convertData = convertCoordinateFromGeoJSON(data, this.gs);
      const labels = convertData.features.map(feature => ({
        text: feature.properties.Street,
        textStyle: {
          fillStyle: '#f5f2f1',
          font: '500 30px Arial',
          outlineWidth: 1.2,
          outlineStyle: '#e37373'
        },
        position: {
          lng: feature.geometry.coordinates[0],
          lat: feature.geometry.coordinates[1],
          alt: 60
        },
        sandbox: this.sandbox,
        scale: 30 // icon size
      }));
      this[prop] = new window.hky.TextTagLayer(labels);
      this[prop].addTo(this.map);
    },
    addPolyCylinderLineMarker(data, prop) {
      const convertData = convertCoordinateFromGeoJSON(data, this.gs);
      const options = convertData.features.map(feature => {
        const pointList = feature.geometry.coordinates.map(points => ({
          lng: points[0],
          lat: points[1],
          alt: 30
        }));
        return {
          name: 'pl',
          sandbox: this.sandbox,
          points: pointList,
          color: 'rgb(168, 171, 180)', // line color
          lineWidth: 8,
          opacity: 0.65
        };
      });
      this[prop] = new PolyCylinderLineMarker(options);
    },

    addTagMarker(data, prop) {
      const convertData = convertCoordinateFromGeoJSON(data, this.gs);
      let type;
      if (prop === 'scenicTag') {
        type = prop.replace('Tag', '');
      }
      const options = this.getTagOptions(convertData.features, type);
      this[prop] = new window.hky.TagLayer(options);
      this[prop].addTo(this.map);
      this[prop].traverse((marker, i) => {
        marker.interactable = true;
        marker.on('mouseenter', () => {
          marker.fixedSize = 40;
        });
        marker.on('mouseleave', () => {
          marker.fixedSize = 30;
        });
        marker.on('click', () => {
          this.dialogTableVisible = true;
          this.dlgData = convertData.features[i].properties;
        });
      });
    },

    addVerticalPolygonsFromGeoJson(data, prop) {
      const convertData = convertCoordinateFromGeoJSON(data, this.gs);

      this[prop] = new PolygonsFromGeoJson({
        sandbox: this.sandbox,
        geoJson: convertData,
        options: { top: 40 }
      });
      this[prop].traverse((marker, i) => {
        const { elevation, height } = convertData.features[i].properties;
        marker.bottom = elevation + 12;
        marker.top = elevation + height + 12;
      });
    },

    destructMarker(props) {
      clearPolyLineMarker();
      const destruct = p => {
        if (this[p]) {
          if (p === 'scenicTag' || p === 'textTagMarker') {
            this[p].remove();
          } else {
            this[p].destruct();
          }
          this[p] = undefined;
        }
      };
      return !Array.isArray(props) ? destruct(props) : props.map(destruct);
    },

    getTagOptions(features, type) {
      const iconMap = {
        scenic: './img/scenic.png' // 风景名胜
      };

      return features.map(project => {
        const [lng, lat] = project.geometry.coordinates;
        return {
          imgUrl: type ? iconMap[type] : iconMap[project.name],
          position: {
            lng,
            lat,
            alt: 0
          },
          sandbox: this.sandbox,
          pinLength: 30,
          fixedSize: 30
        };
      });
    },

    checkboxChange(e, v) {
      const allProps = [
        'polygonMarker',
        'polygonsFromGeoJson',
        'scenicTag',
        'textTagMarker',
        'polyCylinderLineMarker',
        'verticalPolygonsFromGeoJson'
      ];
      if (e.target.checked) {
        const value = v[0];
        this.destructMarker(allProps);
        this.dialogTableVisible = false;
        switch (value) {
          case 'polygonMarker':
            return this.addPolygonMarker(boundary, 'polygonMarker');
          case 'polygonsFromGeoJson':
            return this.addPolygonsFromGeoJson(
              community,
              'polygonsFromGeoJson'
            );
          case 'tagMarker':
            return this.addTagMarker(scenic, 'scenicTag');
          case 'textTagMarker':
            return this.addTextTagMarker(jdzj, 'textTagMarker');
          case 'polyCylinderLineMarker':
            return this.addPolyCylinderLineMarker(
              avenue,
              'polyCylinderLineMarker'
            );
          case 'verticalPolygonsFromGeoJson':
            return this.addVerticalPolygonsFromGeoJson(
              zhaoshang,
              'verticalPolygonsFromGeoJson'
            );
          default:
            break;
        }
      }
      this.sandbox.control.enabledOrbit = true;
      return this.destructMarker(allProps);
    },

    enableDraw() {
      this.sandbox.control.enabledOrbit = false;
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
      if (this.sandbox.control.enabledOrbit) return;
      this.sandbox.control.enabledOrbit = false;

      document.addEventListener('mousemove', this.handleMouseMove);
      document.addEventListener('mouseup', this.handleMouseUp);
    },

    handleMouseMove(e) {
      const endPt = {
        x: e.pageX,
        y: e.pageY
      };

      const points = getView(this.sandbox, this.startPt, endPt);
      points.push(points[0]);

      const lnglatpoints = points.map(
        pt => new window.altizure.LngLatAlt(pt.lng, pt.lat, 0)
      );

      this.destructMarker('drawPolygon');
      this.drawPolygon = new window.altizure.PolygonMarker({
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
      const view = getView(this.sandbox, this.startPt, endPt);
      console.log(view);

      const polygon = turf.polygon([
        [
          [view[0].lng, view[0].lat],
          [view[1].lng, view[1].lat],
          [view[2].lng, view[2].lat],
          [view[3].lng, view[3].lat],
          [view[0].lng, view[0].lat]
        ]
      ]);

      axios
        .get('http://192.168.253.1:3000/kjcx', {
          params: {
            extent: `${JSON.stringify(polygon.geometry)}`
          }
        })
        .then(res => {
          console.log(res.data);
          if (!res.data) return;
          const geoJson = res.data;
          if (this.drawPolygonsFromGeoJson) {
            this.destructMarker('drawPolygonsFromGeoJson');
          }
          this.addVerticalPolygonsFromGeoJson(
            geoJson,
            'drawPolygonsFromGeoJson'
          );
        });

      this.sandbox.control.enabledOrbit = true;
      document.removeEventListener('mousemove', this.handleMouseMove);
      document.removeEventListener('mouseup', this.handleMouseUp);
    },

    cameraChange() {
      console.log(this.sandbox.camera.pose.alt);
    }
  }
};
</script>
<style lang="scss" module>
.control {
  position: fixed;
  top: 100px;
  right: 20px;
  .draw-btn {
  }
}
.home {
  height: 100vh;
  width: 100vw;
}
.container-map {
  height: 100%;
  width: 100%;
}
</style>
