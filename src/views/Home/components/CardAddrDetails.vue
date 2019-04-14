<template>
  <section>
    <div
      :class="$style['cards-level2']"
      v-show="visible"
    >
      <div
        id="returnfixed"
        :class="$style['return-fixed']"
        @click="handleReturnClick"
      ><i class="el-icon-arrow-left"></i>返回</div>
      <div :class="$style['item-pic']"></div>
      <div :class="$style['item-content']">
        <div :class="$style['item-name']">
          {{data.name}}
          <el-tag type="warning" size="mini" :class="$style['tag']">A</el-tag>
        </div>
        <div :class="$style['item-address']">{{data.address}}</div>
        <div>附属POI</div>
        <div>相关主题</div>
      </div>
      <div id="radar_chart" :class="$style['radar-chart']"></div>
    </div>
  </section>
</template>

<script>
import echarts from 'echarts';
import {mapActions, mapState} from 'vuex';
import {SEARCH_STATUS} from '@/const'

export default {
  data(){
    return{
      visible: false,
      data: {},
      chart: null,
    }
  },
  watch:{
    addrDetailsVisible(val){
      this.visible = val;
      if(val){
        this.updateChart([85, 65, 55, 90, 82]);
      }
    },
    addrDetailsData:{
      deep: true,
      handler: function(val){
        this.data = val;
      }
    }
  },
  computed:{
    ...mapState({
      searchStatus: state=>state.searchBtn.status,
      addrDetailsData: state=>state.cardAddrDetails.data,
      addrDetailsVisible: state=>state.cardAddrDetails.visible,
    })
  },
  methods:{
    ...mapActions({
      setVisible: 'cardAddrDetails/setVisible',
      setAddrListVisible: 'cardAddrList/setVisible',
    }),
    handleReturnClick(){
      this.setVisible(false);
      //返回上一级，先判断search状态
      // if(this.searchStatus == SEARCH_STATUS.SEARCH){
        this.setAddrListVisible(true);
      // }
    },
    createChart(){
      const color = '#00c2ff';
      let option = {
        backgroundColor: 'transparent',
        color: [color],
        radar: [{
          indicator: [{
              text: 'indic1',
              max: 100
            },
            {
              text: 'indic2',
              max: 100
            },
            {
              text: 'indic3',
              max: 100
            },
            {
              text: 'indic4',
              max: 100
            },
            {
              text: 'indic5',
              max: 100
            }
          ],

          textStyle: {
            color: 'red'
          },
          center: ['50%', '50%'],
          radius: 110,
          startAngle: 90,
          splitNumber: 3,
          orient: 'horizontal', // 图例列表的布局朝向,默认'horizontal'为横向,'vertical'为纵向.
          // shape: 'circle',
          // backgroundColor: {
          //     image:imgPath[0]
          // },
          name: {
            formatter: '{value}',
            textStyle: {
              fontSize: 14, //外圈标签字体大小
              color: '#cae4ff',//'#5b81cb' //外圈标签字体颜色
            }
          },
          splitArea: { // 坐标轴在 grid 区域中的分隔区域，默认不显示。
            show: false,
            areaStyle: { // 分隔区域的样式设置。
              color: ['#141c42', '#141c42'], // 分隔区域颜色。分隔区域会按数组中颜色的顺序依次循环设置颜色。默认是一个深浅的间隔色。
            }
          },
          // axisLabel:{//展示刻度
          //     show: true
          // },
          axisLine: { //指向外圈文本的分隔线样式
            lineStyle: {
              color: '#394c60', //'#153269'
            }
          },
          splitLine: {
            lineStyle: {
              color: '#394c60',//'#113865', // 分隔线颜色
              width: 1, // 分隔线线宽
            }
          }
        }, ],
        series: [{
          name: '雷达图',
          type: 'radar',
          itemStyle: {
            emphasis: {
              lineStyle: {
                width: 4
              }
            }
          },
          data: [{
            name: '空间画像',
            value: [0, 0, 0, 0, 0],
            areaStyle: {
              normal: { // 单项区域填充样式
                color: {
                  type: 'linear',
                  x: 0, //右
                  y: 0, //下
                  x2: 1, //左
                  y2: 1, //上
                  colorStops: [{
                    offset: 0,
                    color: color
                  }, {
                    offset: 0.5,
                    color: 'rgba(0,0,0,0)'
                  }, {
                    offset: 1,
                    color: color
                  }],
                  globalCoord: false
                },
                opacity: 1 // 区域透明度
              }
            },
            symbolSize: 2.5, // 单个数据标记的大小，可以设置成诸如 10 这样单一的数字，也可以用数组分开表示宽和高，例如 [20, 10] 表示标记宽为20，高为10。
            label: { // 单个拐点文本的样式设置                            
              normal: {
                show: true, // 单个拐点文本的样式设置。[ default: false ]
                position: 'top', // 标签的位置。[ default: top ]
                distance: 2, // 距离图形元素的距离。当 position 为字符描述值（如 'top'、'insideRight'）时候有效。[ default: 5 ]
                color: 'auto', // 文字的颜色。如果设置为 'auto'，则为视觉映射得到的颜色，如系列色。[ default: "#fff" ]
                fontSize: 14, // 文字的字体大小
                formatter: function (params) {
                  return params.value;
                }
              }
            },
            itemStyle: {
              normal: { //图形悬浮效果
                borderColor: color,
                borderWidth: 2.5
              }
            },
            // lineStyle: {
            //     normal: {
            //         opacity: 0.5// 图形透明度
            //     }
            // }
          }]
        }, ]
      };
      this.chart = echarts.init(document.getElementById("radar_chart"), "dark");
      this.chart.setOption(option);
    },
    updateChart(itemData){
      console.log('update chart')
      let option = this.chart.getOption();
      option.series[0].data[0].value = itemData;
      this.chart.setOption(option); 
    }
  },
  mounted(){
    console.log('create chart')
    setTimeout(() => {
      this.createChart();
    },10);
    
  }

}
</script>

<style lang="scss" module>
.cards-level2{
  background-color: $color1;
  margin-top: 5px;
  overflow-y: auto;
  max-height: 90vh;
  position: relative;
  @include scrollbar;
  .return-fixed{
    cursor: pointer;
    position: absolute;
    top: 5px;
    left: 5px;
    color: #fff;
    padding: 3px 7px 3px 3px;
    background-color: rgba($color: $color1,$alpha: 0.6);
    &:hover{
      color: $color4;
    }
  }
  .item-pic{
    height: 150px;
    background-image: url('/img/doodles.png');
  }
  .item-content{
    margin: 15px;
    color: $color9;
    .item-name{
      font-size: 18px;
      font-weight: bold;
      color: $color4;
      position: relative;
      .tag{
        position: absolute;
        top: 3px;
        margin-left: 10px;
      }
    }
    .item-address{
      margin-top: 5px;
      font-size: 16px;
    }
    
  }
  .radar-chart{
    height: 300px;
    width: 400px;
    // background-color: #1c2630;
  }
}
</style>
