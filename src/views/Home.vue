<template>
  <sidebar>
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
  </sidebar>
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
      isVisible: false,
      input:'',
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

</style>
