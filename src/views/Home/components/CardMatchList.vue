<template>
  <section>
    <div :class="$style['card-matchlist']" v-show="matchListvisible">
      匹配引擎结果
    </div>
  </section>
</template>

<script>
import {mapActions, mapState} from 'vuex';

export default {
    computed:{
    ...mapState({
      matchListvisible: state=>state.cardMatchList.visible,
    })
  },
  methods:{
    ...mapActions({
      setMatchListVisible: 'cardMatchList/setVisible',
      // setAddrDetailsVisible: 'cardAddrDetails/setVisible',
      // setAddrDetailsData: 'cardAddrDetails/setData',
    }),
    doMatchSearch(input){
      //匹配查询
      if(!input){
        this.$message('请输入查询信息！');
        return;
      }

      this.setMatchListVisible(true);

    }
  },
  
}
</script>

<style lang="scss" module>
.card-matchlist{
  background-color: $color1;
  margin-top: 5px;
  overflow-y: auto;
  height: 350px;
  padding: 10px;
  @include scrollbar();
}
</style>