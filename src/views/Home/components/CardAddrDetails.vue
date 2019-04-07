<template>
  <section>
    <div
      :class="$style['cards-level2']"
      v-show="visible"
    >
      <div
        id="returnfixed"
        @click="handleReturnClick"
      ><i class="el-icon-arrow-left"></i>返回</div>
      <div>地址：{{data.address}}</div>
    </div>
  </section>
</template>

<script>
import {mapActions, mapState} from 'vuex';
import {SEARCH_STATUS} from '@/const'

export default {
  data(){
    return{
      visible: false,
      data: {},
    }
  },
  watch:{
    addrDetailsVisible(val){
      this.visible = val;
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
  },

}
</script>

<style lang="scss" module>
.cards-level2{
  background-color: $bg-color;
  margin-top: 5px;
  overflow-y: auto;
  height: 350px;
  padding: 10px;
  @include scrollbar;
}
</style>

<style lang="scss">
#returnfixed{
  cursor: pointer;
}

</style>