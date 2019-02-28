<template>
  <div :class="$style['home']">
    <div id="page-content" :class="$style['container-map']"/>
    <checkbox
      v-show="showCheckbox"
      :data="data"
      :title="title"
      :defaultValue="['scenic']"
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
import addPolyLineMarker from '@/libs/polyLineMarker';
import websense from '@/utils/webscene';
import { convertCoordinateFromGeoJSON } from '@/utils/altizureUtil';

import checkbox from '@/components/checkbox/Checkbox';

import boundary from '@/datas/boundary';
import community from '@/datas/community';
import jdzj from '@/datas/jdzj';
import avenue from '@/datas/avenue';
import ggss from '@/datas/ggss';
import scenic from '@/datas/scenic.json';
import accommodation from '@/datas/accommodation.json';
import food from '@/datas/food.json';

export default {
  name: 'Home',
  data() {
    return {
      dialogTableVisible: false,
      dlgData: [],
      data: [
        { label: '风景名胜', value: 'scenic' },
        { label: '公共设施', value: 'ggss' },
        { label: '住宿', value: 'accommodation' },
        { label: '餐饮', value: 'food' }
      ],
      title: '下城漫游',
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
      this.addTagMarker(scenic, 'scenicTag');
    });
  },
  methods: {
    addPolygonMarker() {
      this.polygonMarker = new PolygonMarker({
        volume: {
          color: 0xf18100,
          opacity: 0.3,
          points: boundary,
          top: 30,
          bottom: 0
        },
        sandbox: this.sandbox,
        name: 'polygon'
      });
    },
    addPolygonsFromGeoJson() {
      this.community = new PolygonsFromGeoJson({
        sandbox: this.sandbox,
        geoJson: community,
        options: { top: 40 }
      });
      this.community.traverse(marker => {
        marker.on('click', () => {
          addPolyLineMarker(this.sandbox, marker);
        });
      });
    },
    addTextTagMarker() {
      const streetLabel = convertCoordinateFromGeoJSON(jdzj, this.gs);
      const labels = streetLabel.features.map(b => ({
        text: b.properties.Street,
        textStyle: {
          fillStyle: '#f5f2f1',
          font: '500 30px Arial',
          outlineWidth: 1.2,
          outlineStyle: '#e37373'
        },
        position: {
          lng: b.geometry.coordinates[0],
          lat: b.geometry.coordinates[1],
          alt: 60
        },
        sandbox: this.sandbox,
        scale: 30 // icon size
      }));
      this.textTagMarker = new TextTagMarker(labels);
    },
    addPolyCylinderLineMarker() {
      const convertAvenue = convertCoordinateFromGeoJSON(avenue, this.gs);
      const options = convertAvenue.features.map(road => {
        const pointlist = road.geometry.coordinates.map(points => ({
          lng: points[0],
          lat: points[1],
          alt: 30
        }));
        return {
          name: 'pl',
          sandbox: this.sandbox,
          points: pointlist,
          color: 'rgb(168, 171, 180)', // line color
          lineWidth: 8,
          opacity: 0.65
        };
      });
      this.avenue = new PolyCylinderLineMarker(options);
    },

    addTagMarker(data, prop) {
      const convertData = convertCoordinateFromGeoJSON(data, this.gs);
      let type;
      if (
        prop === 'scenicTag' ||
        prop === 'foodTag' ||
        prop === 'accommodationTag'
      ) {
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

    destructMarker(props) {
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
        zhzf: './img/zhzf.png', // 综合执法
        scjg: './img/scjg.png', // 市场监管
        bmfw: './img/bmfw.png', // 便民服务
        zzgz: './img/zzgz.png', // 综治工作
        ggcs: './img/ggcs.png', // 公共厕所
        ggzxczld: './img/ggzxczld.png', // 公共自行车租赁点  ggzxczld
        gjzd: './img/gjzd.png', // 公交站点
        zdry: './img/person.png', // 重点人员
        yjsp: './img/shop.png', // 沿街商铺
        scenic: './img/scenic.png', // 风景名胜
        accommodation: './img/accommodation.png', // 住宿
        food: './img/food.png' // 餐饮
      };

      return features.map(project => {
        const [lng, lat] = project.geometry.coordinates;
        return {
          imgUrl: type ? iconMap[type] : iconMap[project.name],
          position: {
            lng,
            lat,
            alt: 0 // 虽然高程都赋值为0，但是不知为何 有的高有的低。
          },
          sandbox: this.sandbox,
          pinLength: 30,
          fixedSize: 30
        };
      });
    },

    checkboxChange(e, v) {
      const allProps = ['ggssTag', 'foodTag', 'accommodationTag', 'scenicTag'];
      if (e.target.checked) {
        const value = v[0];
        this.destructMarker(allProps);
        this.dialogTableVisible = false;
        switch (value) {
          case 'scenic':
            return this.addTagMarker(scenic, 'scenicTag');
          case 'ggss':
            return this.addTagMarker(ggss.ggss, 'ggssTag');
          case 'accommodation':
            return this.addTagMarker(accommodation, 'accommodationTag');
          case 'food':
            return this.addTagMarker(food, 'foodTag');
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
.control {
  position: fixed;
  top: 80px;
  right: 20px;
  list-style: none;
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
