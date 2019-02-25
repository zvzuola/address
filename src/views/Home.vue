<template>
  <div :class="$style['home']">
    <div id="page-content" :class="$style['container-map']" style="width:100%;height:100%"/>
    <!-- <ul :class="$style['control']">
      <li>
        <el-checkbox @change="polygonMarkerChange">添加PolygonMarker</el-checkbox>
      </li>
      <li>
        <el-checkbox @change="polygonsFromGeoJsonChange">添加PolygonsFromGeoJson</el-checkbox>
      </li>
      <li>
        <el-checkbox @change="textTagMarkerChange">添加文本标记</el-checkbox>
      </li>
      <li>
        <el-checkbox @change="polyCylinderLineMarkerChange">添加主干线</el-checkbox>
      </li>
      <li>
        <el-checkbox @change="tagMarkerChange">添加图标</el-checkbox>
      </li>
    </ul>-->
    <el-dialog
      :visible.sync="dialogTableVisible"
      class="attribute-dlg"
      title="详细信息"
      :modal="false"
      :close-on-click-modal="false"
    >
      <div
        v-for="(value, key, index) in dlgData"
        v-if="scenicLabels[key]"
        class="attribute-row"
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
        <span class="attribute-key">{{scenicLabels[key]}}: {{value || '无'}}</span>
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

import boundary from '@/datas/boundary';
import community from '@/datas/community';
import jdzj from '@/datas/jdzj';
import avenue from '@/datas/avenue';
// import ggss from '@/datas/ggss';
import scenic from '@/datas/scenic.json';

export default {
  name: 'Home',
  data() {
    return {
      tagChecked: false,
      dialogTableVisible: false,
      dlgData: [],
      scenicLabels: {
        name: '景点名称',
        type: '景点类型',
        address: '地址',
        tel: '联系电话'
      }
    };
  },
  mounted() {
    websense().then(res => {
      this.sandbox = res.sandbox;
      this.gs = res.gs;

      const gui = new window.dat.GUI();
      gui.domElement.style = 'position:absolute;top:80px';
      const xcmyFolder = gui.addFolder('下城漫游');
      xcmyFolder.open();
      const addTagMarkerController = xcmyFolder
        .add({ hide: true }, 'hide')
        .setValue(false)
        .name('公共设施');
      addTagMarkerController.onChange(v => {
        if (v) {
          this.destructAll();
          this.addTagMarker();
        } else {
          this.destructTagMarker();
        }
      });

      // this.addTagMarker();
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
    polygonMarkerChange(val) {
      if (val) {
        this.addPolygonMarker();
      } else {
        this.destructPolygonMarker();
      }
    },
    addPolygonsFromGeoJson() {
      this.community = new PolygonsFromGeoJson({
        sandbox: this.sandbox,
        geoJson: community,
        options: { top: 40 }
      });
      this.community.traverse((marker, i) => {
        marker.on('click', () => {
          addPolyLineMarker(this.sandbox, marker);
          console.log(marker, community.features[i].properties);
        });
      });
    },
    destructPolygonsFromGeoJson() {
      if (this.community) {
        this.community.destruct();
        this.community = undefined;
      }
    },
    polygonsFromGeoJsonChange(val) {
      if (val) {
        this.addPolygonsFromGeoJson();
      } else {
        this.destructPolygonsFromGeoJson();
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
    textTagMarkerChange(val) {
      if (val) {
        this.addTextTagMarker();
      } else {
        this.destructTextTagMarker();
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
    polyCylinderLineMarkerChange(val) {
      if (val) {
        this.addPolyCylinderLineMarker();
      } else {
        this.destructPolyCylinderLineMarker();
      }
    },
    addTagMarker() {
      // const convertGgss = convertCoordinateFromGeoJSON(ggss.ggss, this.gs);
      const convertGgss = convertCoordinateFromGeoJSON(scenic, this.gs);

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

      const options = convertGgss.features.map(project => {
        const [lng, lat] = project.geometry.coordinates;
        return {
          // 图标地址 img url
          // imgUrl: iconMap[project.name],
          imgUrl: iconMap.scenic,
          // 图标位置 icon position
          position: {
            lng,
            lat,
            alt: 0 // 虽然高程都赋值为0，但是不知为何 有的高有的低。
          },
          sandbox: this.sandbox,
          // 指针[tagmarker指向地面点的指针]
          pinLength: 30,
          // 图标尺寸 如果设置了图标尺寸，则大小固定，再设置mouse的enter和leave的放大缩小设置fixedSize属性。 liuxiaoyan
          fixedSize: 30,
          // 图标比例：设置之后图标的大小相对模型调整。鼠标相应事件设置scale属性。
          scale: 1
        };
      });
      this.tag = new TagMarker(options);
      this.tag.traverse((marker, i) => {
        marker.on('click', () => {
          console.log(marker, convertGgss.features[i].properties);
          this.dialogTableVisible = true;
          this.dlgData = convertGgss.features[i].properties;
        });
      });
    },
    destructTagMarker() {
      if (this.tag) {
        this.tag.destruct();
        this.tag = undefined;
      }
    },
    tagMarkerChange(val) {
      if (val) {
        this.addTagMarker();
      } else {
        this.destructTagMarker();
      }
    },
    destructAll() {
      this.destructPolyCylinderLineMarker();
      this.destructTagMarker();
      this.destructPolygonMarker();
      this.destructPolygonsFromGeoJson();
      this.destructTextTagMarker();
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
