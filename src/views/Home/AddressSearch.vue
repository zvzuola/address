<template>
  <section>
    <div :class="$style['search-container']" id="search_container">
      <el-input
        clearable
        placeholder="请输入地址"
        v-model="input"
        :type="inputType"
        rows="6"
        resize="none"
        @clear="handleInputClear"
        class="input-with-select"
      >
      </el-input>
      <el-tooltip class="item" effect="dark" content="搜索" placement="bottom" :class="$style['search-btn']">
        <div :class="$style['icon-search']" @click="handleSearch"><i :class="searchIcon"/></div>
      </el-tooltip>
    </div>
    <el-tooltip class="item" effect="dark" content="空间查询" placement="bottom">
      <div :class="$style['extent-search']" @click="handleExtentClick"><i :class="extentBtnIcon"/></div>
    </el-tooltip>

    <el-tooltip class="item" effect="dark" content="匹配引擎" placement="bottom">
      <div :class="$style['match-search']" @click="handleMatchClick"><i :class="matchBtnIcon"/></div>
    </el-tooltip>
    
    <card-result></card-result>
    <card-extent ref="cardExtent"></card-extent>
    <card-addr-list></card-addr-list>
    <card-addr-details></card-addr-details>
    <card-match-list ref="cardMathList"></card-match-list>

  </section>
</template>

<script>
import {mapActions, mapState} from 'vuex';
import cityData from '@/../public/data/city.json'
import * as api from '@/api/index'
import {SEARCH_STATUS} from '@/const'
import cardResult from './components/CardResult'
import cardAddrList from './components/CardAddrList'
import cardAddrDetails from './components/CardAddrDetails'
import cardExtent from './components/CardExtent'
import cardMatchList from './components/CardMatchList'

export default {
  name: 'AddressSearch',
  components:{
    'card-result': cardResult,
    'card-addr-list': cardAddrList,
    'card-addr-details': cardAddrDetails,
    'card-extent': cardExtent,
    'card-match-list': cardMatchList,
  },
  data(){
    return{
      input: '',
      addressList: [],
      extentBtnIcon:'el-icon-news',
      matchBtnIcon: 'el-icon-date',
    }
  },
  watch:{
    searchStatus(val){
      switch(val){
        case SEARCH_STATUS.SEARCH:
          this.switchToText();
          break;
        case SEARCH_STATUS.EXTENT:
          this.switchToText();
          this.setMatchBtnCloseIcon(false);
          break;
        case SEARCH_STATUS.MATCH:
          this.switchToTextarea();
          this.setExtentBtnCloseIcon(false);
          break;
        default:
          break;
      }
    }
  },
  computed:{
    ...mapState({
      searchStatus: state=>state.searchBtn.status,
      searchIcon: state=>state.searchBtn.icon,
      inputType: state=>state.searchInput.type,
    })
  },
  methods:{
    ...mapActions({
      setAddrListVisible: 'cardAddrList/setVisible',
      setAddrDetailsVisible: 'cardAddrDetails/setVisible',
      setCardResultVisible: 'cardResult/setVisible',
      setExtentVisible: 'cardExtent/setVisible',
      switchToSearch: 'switchToSearch',
      switchToExtent: 'switchToExtent',
      switchToMatch: 'switchToMatch',
      setSearchIconLoading: 'setSearchIconLoading',
      setAddrListData: 'cardAddrList/setData',
      switchToText: 'switchToText',
      switchToTextarea: 'switchToTextarea',
      setMatchListVisible: 'cardMatchList/setVisible',
      setRequestAddr: 'cardAddrList/setAddr',
      setRequestTotalNum: 'cardAddrList/setTotalNum',
    }),
    setExtentBtnCloseIcon(isClose){
      if(isClose){
        this.extentBtnIcon = 'el-icon-close';
        this.setExtentVisible(true);
      }else{
        this.extentBtnIcon = 'el-icon-news';
        this.setExtentVisible(false);
      }
      //关闭其他所有面板
      this.setAddrListVisible(false);
      this.setAddrDetailsVisible(false);
      this.setCardResultVisible(false);
    },
    isExtentBtnCloseIcon(){
      return this.extentBtnIcon == 'el-icon-close';
    },
    setMatchBtnCloseIcon(isClose){
      if(isClose){
        this.matchBtnIcon = 'el-icon-close';
      }else{
        this.matchBtnIcon = 'el-icon-date';
        this.setMatchListVisible(false);
        this.input = '';
      }
      //关闭其他所有面板
      this.setAddrListVisible(false);
      this.setAddrDetailsVisible(false);
    },
    isMatchBtnCloseIcon(){
      return this.matchBtnIcon == 'el-icon-close';
    },
    handleSearch() {
      this.setCardResultVisible(false);
      //判断当前是什么查询
      switch(this.searchStatus){
        case SEARCH_STATUS.SEARCH:
          this.getAddress(this.input);
          break;
        case SEARCH_STATUS.EXTENT:
          this.$refs['cardExtent'].doExtentSearch();
          break;
        case SEARCH_STATUS.MATCH:
          this.$refs['cardMathList'].doMatchSearch(this.input);
          break;
        default:
          break;
      }
    },
    handleExtentClick(){
      // this.$router.push('extent');
      if(this.isExtentBtnCloseIcon()){
        this.setExtentBtnCloseIcon(false);
        this.switchToSearch();
      }else{
        this.setExtentBtnCloseIcon(true);
        this.switchToExtent();
      }
    },
    handleMatchClick(){
      if(this.isMatchBtnCloseIcon()){
        this.setMatchBtnCloseIcon(false);
        this.switchToSearch();
      }else{
        this.setMatchBtnCloseIcon(true);     
        this.switchToMatch();
      }
    },
    handleInputClear() {
      this.setAddrListVisible(false);
      this.setAddrDetailsVisible(false);
      this.setCardResultVisible(false);
    },
    getAddress(val) {
      if (!val) {
        this.$message('请输入查询信息！');
        return;
      }
      this.setSearchIconLoading(true);
      const param = {
        addr: val,
        extent: 'null',
        scale: 0,
        pageSize: 10,
        currentPage: 1
      }
      api.getAddressQuery(param).then(res => {
        if (res.success) {
          this.addressList = res.data.data;
          this.setAddrListData(this.addressList);
          this.setSearchIconLoading(false);
          this.setAddrListVisible(true);
          this.setRequestAddr(val);
          this.setRequestTotalNum(res.data.totalSize);
        }
      });
    },

  },
};
</script>

<style lang="scss" module>
.search-container{
  display: flex;
  background-color: $color1;
  .search-btn{
    height: 40px;
  }
  .icon-search{
    padding:9px 10px 0px 5px;
    i{
      font-size: 22px;
    }
    &:hover{
      cursor: pointer;
    }
 
  }
}
.extent-search{
  background-color: $color1;
  padding:8px 10px 8px 10px;
  position: absolute;
    right: -50px;
    top: 0px;
  i{
    font-size: 22px;
  }
  &:hover{
    cursor: pointer;
    background-color: #fff;
  }
}

.match-search{
  background-color: $color1;
  padding:8px 10px 8px 10px;
  position: absolute;
    right: -92px;
    top: 0px;
  i{
    font-size: 22px;
  }
  &:hover{
    cursor: pointer;
    background-color: #fff;
  }
}
</style>

<style lang="scss">
#search_container{
  .el-input__inner,
  .el-textarea__inner {
    background-color: transparent;
    border-radius: 0px;
    border: 0;
  }
  .el-textarea__inner{
    min-height: 40px!important;
    padding-top: 10px;
  }
}
</style>



