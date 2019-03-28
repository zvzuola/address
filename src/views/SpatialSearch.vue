  <template>
    <sidebar>
      <el-button :disabled="!sandbox" @click="draw">空间查询</el-button>


      <el-form :inline="true" :model="formInline">
        <el-form-item label="经度" v-show="formInline.espg==='4326'">
          <el-input v-model="formInline.x" size="small"></el-input>
        </el-form-item>
        <el-form-item label="纬度" v-show="formInline.espg==='4326'">
          <el-input v-model="formInline.y" size="small"></el-input>
        </el-form-item>
        <el-form-item label="缓冲区">
          <el-input v-model="formInline.distance" size="small"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAddressSearch"  size="small">查询</el-button>
        </el-form-item>
      </el-form>
    </sidebar>
  </template>
  <script>
  import { mapState } from 'vuex';
  import * as util from '@/utils/altizureUtil';
  import PolygonsFromGeoJson from '@/libs/polygonsFromGeoJson';
  import PolygonMarker from '@/libs/polygonMarker';
  import Sidebar from '@/components/sidebar/Sidebar';

  import {getNearestAddressByLocation} from '@/api/index'
  import TagMarker from '@/libs/tagMarker'

  const { altizure } = window;

  export default {
    name:'SpatialSearch',
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
    data() {
        return {
          Pointdata:[],
          inputType:'1',//经纬度输入方式
          formInline: {
            espg: '4326',
            // addtype: '房屋',
            distance: '100',
            x: '120.165',
            y: '30.255',
            z: '0'
          }
        }
      },
    methods: {
      //地址查询
      handleAddressSearch(){
        let param = {
          espg: this.formInline.espg,
          //addtype: '地址',
          distance: this.formInline.distance,
          x: this.formInline.x,
          y: this.formInline.y,
          //z: this.formInline.z
          // pageSize: 10,
          // currentpage:1
        }
        getNearestAddressByLocation(param).then(arr=>{
          this.Pointdata = arr;
          this.addTag();
        });
      },
      //addTag
      addTag(){
        console.log(this.Pointdata)
        this.Pointdata.forEach(Pointdata =>{
          const tag = new TagMarker({
            // 图标地址 img url
            imgUrl: './img/tagDemo.png',
            // 图标位置 icon position
            position: {
              lng: Pointdata.lon,
              lat: Pointdata.lat,
              alt: 0 // 虽然高程都赋值为0，但是不知为何 有的高有的低。
            },
            sandbox:this.sandbox,
            // 指针[tagmarker指向地面点的指针]
            pinLength: 30,
            // 图标尺寸 如果设置了图标尺寸，则大小固定，再设置mouse的enter和leave的放大缩小设置fixedSize属性。 liuxiaoyan
            fixedSize: 30,
            // 图标比例：设置之后图标的大小相对模型调整。鼠标相应事件设置scale属性。
            scale: 1
          })
        })
          this.sandbox.camera.flyTo({
          lng: 120.165,
          lat: 30.255,
          alt: 1000,
          north: 0,
          tilt: 0
          })
          },

      //空间查询
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

