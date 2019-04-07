<template>
  <section>
    <div :class="$style['card-extent']" v-show="visible">
      <el-radio-group v-model="radioValue" @change="drawpolygon" :class="$style['radio-block']">
        <el-radio :label="1">框选查询</el-radio>
        <el-radio :label="2">缓冲区查询</el-radio>
      </el-radio-group>
      <!-- <el-checkbox v-model="checked">多边形</el-checkbox> -->
      <el-form :inline="true" :model="formInline">
        <el-form-item label="经度" v-show="formInline.epsg==='4326'">
          <el-input v-model="formInline.x" size="small"></el-input>
        </el-form-item>
        <el-form-item label="纬度" v-show="formInline.epsg==='4326'">
          <el-input v-model="formInline.y" size="small"></el-input>
        </el-form-item>
        <el-form-item label="缓冲区(m)">
          <el-input v-model="formInline.distance" size="small"></el-input>
        </el-form-item>
        <!-- <el-form-item>
          <el-button type="primary" @click="handleAddressSearch"  size="small">查询</el-button>
        </el-form-item> -->
      </el-form>
    </div>
  </section>
</template>

<script>
import {mapActions, mapState} from 'vuex';
import { getNearestAddressByLocation } from '@/api/index'
import * as util from '@/utils/altizureUtil';
import PolygonsFromGeoJson from '@/libs/polygonsFromGeoJson';
import PolygonMarker from '@/libs/polygonMarker';
import TagMarker from '@/libs/tagMarker'

const { altizure } = window;

export default {
  data(){
    return{
      visible: false,
      radioValue: 1,
      checked: false,
      Pointdata:[],
      formInline: {
        epsg: '4326',
        // addtype: '房屋',
        distance: '100',
        x: '119.97',//'120.165',
        y: '30.53',//'30.255',
        z: '0'
      }
    }
  },
  watch:{
    cardExtentVisible(val){
      this.visible = val;
    }
  },
  computed:{
    ...mapState({
      cardExtentVisible: state=>state.cardExtent.visible,
    })
  },
  beforeDestroy() {
    console.log('removeEventListener')
    this.removeEventListener();
  },
  methods:{
    ...mapActions({
      setAddrListVisible: 'cardAddrList/setVisible',
      setAddrListData: 'cardAddrList/setData',
      setSearchIconLoading: 'setSearchIconLoading',
      // setAddrDetailsVisible: 'cardAddrDetails/setVisible',
      // setAddrDetailsData: 'cardAddrDetails/setData',
    }),
    doExtentSearch(){
      console.log(this.radioValue)
      if(this.radioValue == 1){
        console.log('框选')
      }else{
        this.handleAddressSearch();
      }
    },
    //空间查询画多边形
    drawpolygon() {
      if(this.checked){
      // this.sandbox.renderer.domElement.addEventListener(
      //   'mousedown',
      //   this.handleMouseDown
      //   );
      }
    },
    handleRadioChange(val){
      // if(val == 1){
      //   //框选
      //   this.drawpolygon();
      // }else{
      //   //缓冲区查询
      // }
    },
    //缓冲区查询
    handleAddressSearch(){
      this.setSearchIconLoading(true);
      let param = {
        epsg: this.formInline.epsg,
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
        console.log(this.Pointdata)
        this.setAddrListData(this.Pointdata);
        this.setAddrListVisible(true);
        this.setSearchIconLoading(false);
        this.addTag();
      });
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
      util.asyncGetGeojsonByView(view).then(arr => {
        this.destructMarker('drawPolygonsFromGeoJson');
        // if (geoJson.features) {
          this.Pointdata = arr;
          this.addTag();
        // }
      });
      
      // this.Pointdata = geoJson.data.data;
      // this.addTag(Pointdata);
      this.sandbox.control.enabledOrbit = true;
      this.removeEventListener();
    },
    //addTag
    addTag(){
      // console.log(this.Pointdata)
      this.Pointdata.forEach(Pointdata =>{
        // console.log(Pointdata);
        // return
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
    }
  }
}
</script>

<style lang="scss" module>
.card-extent{
  background-color: $bg-color;
  margin-top: 5px;
  height: 90px;
  .radio-block{
    margin-left: 10px;
  }
  input{
    width: 80px;
    height: 25px!important;
    color: #fff;
  }
  label{
    font-size: 13px;
  }
}
</style>

