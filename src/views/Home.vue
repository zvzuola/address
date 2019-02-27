<template>
  <div :class="$style['home']">
    <div id="page-content" :class="$style['container-map']"/>
    <!-- <checkbox :data="data" @change="checkboxChange"></checkbox> -->
    <el-dialog
      :visible.sync="dialogTableVisible"
      class="attribute-dlg"
      title="详细信息"
      :modal="false"
      :close-on-click-modal="false"
    >
      <div
        v-for="(value, key, index) in dlgData"
        class="attribute-row"
        v-if="key !== 'id' && key !== 'location'"
        :key="index"
      >
        <!-- <span class="attribute-key" v-if="key == 'floor'">所在楼层:</span>
        <span class="attribute-key" v-else-if="key == 'height'">楼层高:</span>
        <span class="attribute-key" v-else-if="key == 'elevation'">楼层起始高:</span>
        <span class="attribute-key" v-else>{{key}}:</span>
        <span class="attribute-value" v-if="key !== '入驻主要企业'">{{value}}</span>
        <span class="attribute-list" v-else>
          <span v-for="(item,index) in value" :key="index">{{index+1}}. {{item}}</span>
        </span>-->
        <!-- 风景名胜 -->
        <span
          class="attribute-key"
          v-if="type === 'scenic' && scenicLabels[key]"
        >{{scenicLabels[key]}}: {{value || '无'}}</span>
        <span class="attribute-key" v-if="type === 'ggss'">{{key}}: {{value || '无'}}</span>
        <span
          class="attribute-key"
          v-if="type === 'accommodation' || type === 'food'"
        >{{commonLabels[key]}}: {{value || '无'}}</span>
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

// import checkbox from '@/components/checkbox/Checkbox';

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
      scenicLabels: {
        name: '景点名称',
        type: '景点类型',
        address: '地址',
        tel: '联系电话'
      },
      commonLabels: {
        name: '名称',
        type: '类型',
        address: '地址',
        tel: '联系电话'
      },
      type: 'scenic',
      data: [
        { label: '风景名胜', value: 'scenic' },
        { label: '公共设施', value: 'ggss' }
      ]
    };
  },
  // components: {
  //   checkbox
  // },
  mounted() {
    websense().then(res => {
      this.sandbox = res.sandbox;
      this.gs = res.gs;

      const gui = new window.dat.GUI();
      gui.domElement.style = 'position:absolute;top:80px';
      const xcmyFolder = gui.addFolder('下城漫游');
      xcmyFolder.open();

      const scenicController = xcmyFolder
        .add({ hide: true }, 'hide')
        // .setValue(false)
        .name('风景名胜');
      scenicController.onChange(v => {
        this.dialogTableVisible = false;
        if (v) {
          this.type = 'scenic';
          ggssController.setValue(false);
          accommodationController.setValue(false);
          foodController.setValue(false);
          this.destructAll();
          this.addScenicTagMarker();
        } else {
          this.destructScenicTagMarker();
        }
      });

      const ggssController = xcmyFolder
        .add({ hide: true }, 'hide')
        .setValue(false)
        .name('公共设施');
      ggssController.onChange(v => {
        this.dialogTableVisible = false;
        if (v) {
          this.type = 'ggss';
          scenicController.setValue(false);
          accommodationController.setValue(false);
          foodController.setValue(false);
          this.destructAll();
          this.addGgssTagMarker();
        } else {
          this.destructGgssTagMarker();
        }
      });

      const accommodationController = xcmyFolder
        .add({ hide: true }, 'hide')
        .setValue(false)
        .name('住宿');
      accommodationController.onChange(v => {
        this.dialogTableVisible = false;
        if (v) {
          this.type = 'accommodation';
          ggssController.setValue(false);
          scenicController.setValue(false);
          foodController.setValue(false);
          this.destructAll();
          this.addAccommodationTagMarker();
        } else {
          this.destructAccommodationTagMarker();
        }
      });

      const foodController = xcmyFolder
        .add({ hide: true }, 'hide')
        .setValue(false)
        .name('餐饮');
      foodController.onChange(v => {
        this.dialogTableVisible = false;
        if (v) {
          this.type = 'food';
          ggssController.setValue(false);
          scenicController.setValue(false);
          accommodationController.setValue(false);
          this.destructAll();
          this.addFoodTagMarker();
        } else {
          this.destructFoodTagMarker();
        }
      });

      this.addScenicTagMarker();
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
    destructPolygonMarker() {
      if (this.polygonMarker) {
        this.polygonMarker.destruct();
        this.polygonMarker = undefined;
      }
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
    destructPolygonsFromGeoJson() {
      if (this.community) {
        this.community.destruct();
        this.community = undefined;
      }
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
    destructTextTagMarker() {
      if (this.textTagMarker) {
        this.textTagMarker.destruct();
        this.textTagMarker = undefined;
      }
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
    destructPolyCylinderLineMarker() {
      if (this.avenue) {
        this.avenue.destruct();
        this.avenue = undefined;
      }
    },

    addScenicTagMarker() {
      const convertGgss = convertCoordinateFromGeoJSON(scenic, this.gs);
      const options = this.getTagOptions(convertGgss.features, 'scenic');
      this.tag = new TagMarker(options);
      this.tag.traverse((marker, i) => {
        marker.on('click', () => {
          this.dialogTableVisible = true;
          this.dlgData = convertGgss.features[i].properties;
        });
      });
    },
    destructScenicTagMarker() {
      if (this.tag) {
        this.tag.destruct();
        this.tag = undefined;
      }
    },

    addAccommodationTagMarker() {
      const convertGgss = convertCoordinateFromGeoJSON(accommodation, this.gs);
      const options = this.getTagOptions(convertGgss.features, 'scenic');
      this.accommodationTag = new TagMarker(options);
      this.accommodationTag.traverse((marker, i) => {
        marker.on('click', () => {
          this.dialogTableVisible = true;
          this.dlgData = convertGgss.features[i].properties;
        });
      });
    },
    destructAccommodationTagMarker() {
      if (this.accommodationTag) {
        this.accommodationTag.destruct();
        this.accommodationTag = undefined;
      }
    },

    addFoodTagMarker() {
      const convertGgss = convertCoordinateFromGeoJSON(food, this.gs);
      const options = this.getTagOptions(convertGgss.features, 'scenic');
      this.foodTag = new TagMarker(options);
      this.foodTag.traverse((marker, i) => {
        marker.on('click', () => {
          this.dialogTableVisible = true;
          this.dlgData = convertGgss.features[i].properties;
        });
      });
    },
    destructFoodTagMarker() {
      if (this.foodTag) {
        this.foodTag.destruct();
        this.foodTag = undefined;
      }
    },

    addGgssTagMarker() {
      const convertGgss = convertCoordinateFromGeoJSON(ggss.ggss, this.gs);
      const options = this.getTagOptions(convertGgss.features);
      this.ggssTag = new TagMarker(options);
      this.ggssTag.traverse((marker, i) => {
        marker.on('click', () => {
          this.dialogTableVisible = true;
          this.dlgData = convertGgss.features[i].properties;
        });
      });
    },
    destructGgssTagMarker() {
      if (this.ggssTag) {
        this.ggssTag.destruct();
        this.ggssTag = undefined;
      }
    },

    destructAll() {
      this.destructPolyCylinderLineMarker();
      this.destructPolygonMarker();
      this.destructPolygonsFromGeoJson();
      this.destructTextTagMarker();
      this.destructScenicTagMarker();
      this.destructGgssTagMarker();
      this.destructAccommodationTagMarker();
      this.destructFoodTagMarker();
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
        scenic: './img/tagDemo.png' // 风景名胜
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
      console.log(e, v);
      if (e.target.checked) {
        const value = v[0];
        this.destructAll();
        switch (value) {
          case 'scenic':
            return this.addScenicTagMarker();
          case 'ggss':
            return this.addGgssTagMarker();
          default:
            break;
        }
      }
      return this.destructAll();
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
