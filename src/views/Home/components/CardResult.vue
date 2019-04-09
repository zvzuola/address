<template>
  <section>
    <div
      :class="$style['cards-level0']" 
      v-show="visible"
      @mouseover="handleCardHover"
    >
      共找到{{totalNum}}个搜索结果
      <!-- {{message}} -->
    </div>
  </section>
</template>

<script>
import {mapActions, mapState} from 'vuex';

export default {
  // props:{
  //   message:{
  //     type: String,
  //     default(){
  //       return '';
  //     }
  //   }
  // },
  data(){
    return{
      visible: false,
      dataList: {}
    }
  },
  watch:{
    resultVisible(val){
      this.visible = val;
    },
    addrListData:{
      deep: true,
      handler: function(val){
        this.dataList = val;
      }
    }
  },
  computed:{
    ...mapState({
      resultVisible: state=>state.cardResult.visible,
      addrListVisible: state=>state.cardAddrList.visible,
      addrListData: state=>state.cardAddrList.data,
      totalNum: state=>state.cardAddrList.totalNum,
    })
  },
  methods:{
    ...mapActions({
      setVisible: 'cardResult/setVisible',
      setAddrListVisible: 'cardAddrList/setVisible',
      setExtentVisible: 'cardExtent/setVisible',
    }),
    handleCardHover(){
      console.log('handleCardHover')
      // 显示card-addr-list面板/隐藏result面板
      this.setVisible(false);
      this.setAddrListVisible(true);
    },
    showCardResult(){
      if(this.addrListVisible){  //card-addr-list面板显示情况下
        this.setVisible(true);
        this.setAddrListVisible(false);
      }
    },

  },
  mounted(){
    document
      .getElementById('page-content')
      .addEventListener('click', this.showCardResult);
  },
  beforeDestroy() {
    document
      .getElementById('page-content')
      .removeEventListener('click', this.showCardResult);
  },
}
</script>

<style lang="scss" module>
.cards-level0{
  background-color: $bg-color;
  margin-top: 5px;
  height: 40px;
  padding: 10px;
  &:hover{
    cursor: pointer;
  }
}
</style>
