<template>
  <div :class="$style['home']">
    <div id="page-content" :class="$style['container-map']"/>
    <checkbox
      v-show="showCheckbox"
      :data="data"
      :title="title"
      :defaultValue="['polygonMarker']"
      @change="checkboxChange"
    ></checkbox>
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
import TextTagMarker from '@/libs/textTagMarker';
import TagMarker from '@/libs/tagMarker';
import PolyCylinderLineMarker from '@/libs/polyCylinderLineMarker';
import addPolyLineMarker, { clearPolyLineMarker } from '@/libs/polyLineMarker';
import websense from '@/utils/webscene';
import { convertCoordinateFromGeoJSON } from '@/utils/altizureUtil';

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
    websense().then(({ sandbox, gs }) => {
      this.sandbox = sandbox;
      this.gs = gs;
      this.showCheckbox = true;
      this.addPolygonMarker(boundary, 'polygonMarker');
    });
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
    addPolygonsFromGeoJson(geoJson, prop) {
      this[prop] = new PolygonsFromGeoJson({
        sandbox: this.sandbox,
        geoJson,
        options: { top: 40 }
      });
      this[prop].traverse(marker => {
        marker.on('click', () => {
          addPolyLineMarker(this.sandbox, marker);
        });
      });
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
      this[prop] = new TextTagMarker(labels);
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
      this[prop] = new TagMarker(options);
      this[prop].traverse((marker, i) => {
        marker.on('click', () => {
          this.dialogTableVisible = true;
          this.dlgData = convertData.features[i].properties;
        });
      });
    },

    addVerticalPolygonsFromGeoJson(geoJson, prop) {
      this[prop] = new PolygonsFromGeoJson({
        sandbox: this.sandbox,
        geoJson,
        options: { top: 40 }
      });
      this[prop].traverse((marker, i) => {
        const { elevation, height } = geoJson.features[i].properties;
        marker.bottom = elevation;
        marker.top = elevation + height;
      });
    },

    destructMarker(props) {
      clearPolyLineMarker();
      const destruct = p => {
        if (this[p]) {
          this[p].destruct();
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
      return this.destructMarker(allProps);
    }
  }
};
</script>
<style lang="scss" module>
.home {
  height: 100vh;
  width: 100vw;
}
.container-map {
  height: 100%;
  width: 100%;
}
</style>
