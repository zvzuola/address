<template>
  <section>
    <div id="search_left_panel">
      <el-input clearable 
      placeholder="请输入地址" 
      v-model="input" 
      @clear="handleInputClear"
      class="input-with-select">
        <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
      </el-input>
      <div :class="$style['address-wrapper']" v-show="isVisible">
        <div>
          <el-select v-model="value" clearable placeholder="选择辖区" size="small"
          :class="$style['address-select']"> 
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              >
            </el-option>
          </el-select>
          <el-select v-model="value" clearable placeholder="选择街道" size="small"
          :class="$style['address-select']"> 
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              >
            </el-option>
          </el-select>
        </div>
        <div :class="$style['address-list']">
          <ul>
            <li v-for="(item,index) in addressList" :key="index">
              <div>{{index+1}}</div>
              <div>地址：{{item.address}}</div>
              <div>辖区：{{item.county}}</div>
              <div>街道：{{item.street}}</div>
              <div>社区：{{item.community}}</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div id="search_righttop_panel" :class="$style['tool-box']">
      <div v-for="(item,index) in toolBoxList" :key="index" 
      :class="[$style['tool-button'],{[$style['tool-btn-active']]: index == toolBtnActive}]" @click="handleToolBtnClick(index)">
        <svg-icon :icon="item.icon" :class="$style['tool-icon']"/>
        <span>{{item.title}}</span>
      </div>
    </div>
    <div id="tool_panel_extent" v-show="toolPanelVisible[1]" 
    :class="$style['tool-panel']">空间查询</div>
  </section>
</template>

<script>
import Sidebar from '@/components/sidebar/Sidebar';
import { getAddressList } from '@/api/index'

export default {
  name: 'Home',
  components: {
    sidebar: Sidebar
  },
  data() {
    return {
      toolBtnActive: -1,
      isVisible: false,
      toolPanelVisible: [0,0,0,0],
      input:'',
      toolBoxList:[
        {
          title: '下城区',
          icon: 'building',
        },
        {
          title: '空间查询',
          icon: 'building',
        },
        {
          title: '匹配引擎',
          icon: 'building',
        },
        {
          title: '底图',
          icon: 'building',
        },
      ],
      addressList:[],
      value:'',
      options: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
    };
  },
  mounted() {
    this.getAddress();
  },
  beforeDestroy() {},
  methods: {
    handleSearch(){
      if(!this.input) {
        return;
      }
      this.isVisible = true;
    },
    handleInputClear(){
      this.isVisible = false;
    },
    handleToolBtnClick(index){
      this.toolPanelVisible = [0,0,0,0];
      this.toolPanelVisible[index] = 1;
      this.toolBtnActive = index;
      switch (index) {
        case 0:
          console.log('下城区')
          break;
        case 1:
          console.log('空间查询')
          break;
        case 2:
          console.log('匹配引擎')
          break;
        case 3:
          console.log('底图')
          break;
        default:
          break;
      }
    },
    getAddress(){
      getAddressList().then(res=>{
        if(res.success){
          this.addressList = res.data;
        }
      })
    },
  }
};
</script>
<style lang="scss" module>
$bg-color: #fff;
$hover-color: #eee;

.address-wrapper{
  background-color: $bg-color;
  margin-top: 5px;
}

.address-list{
  height: 300px;
  overflow-y:scroll;
  ul{
    // padding-left: 10px;
    li{
      margin-bottom: 5px;
      &:hover{
        background-color: $hover-color;
        cursor: pointer;
      }
    }
  }
}

.address-select{
  width: 100px;
}

.tool-box{
  display: flex;
  position: absolute;
  right: 20px;
  top: 70px;
  background-color: $color1;
  padding: 8px 13px;
  .tool-button{
    font-size: 15px;
    justify-content: center;
    flex-direction: row;
    color: $color6;
    &:hover{
      color: $color4;
      cursor: pointer;
    }
    &:nth-child(n+2)::before{
      content:'';
      border-left: 1px solid $color6;
      margin-right: 10px;
      margin-left: 10px;
    }
    .tool-icon{
      margin-right: 3px;
    }
  }
  .tool-btn-active{
    color: $color4;
  }
}

.tool-panel{
  background-color: $color1;
  width: 200px;
  height: 200px;
  position: absolute;
  right: 90px;
  top: 115px;
}

</style>

<style lang="scss">
#search_left_panel{
  position: absolute;
  width: 400px;
  left: 20px;
  .el-input__inner,
  .el-input-group__append{
    border-radius: 0px;
  }
  
}

</style>

