<template>
  <section>
    <div :class="[$style['city-list-panel']]">
      <div v-for="(town,index) in dataSource" :key="index" :class="[$style['city-list']]">
        <span @click="handleCityClick(town.label)">{{town.label}}</span>
        <ul :class="[$style['city-sub-list']]">
          <li v-for="(item,index) in town.items" :key="index" @click="handleCityClick(item)">
            {{item}}
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script>

export default {
  name: 'citychange',
  props:{
    dataSource:{
      type: Array,
      default() {
        return [];
      }
    }
  },
  data(){
    return{
    }
  },
  methods:{
    handleCityClick(item){
      this.$parent.toolBoxList[0].title = item;
      console.log(item)
    }
  },
}
</script>

<style lang="scss" module>
.city-list-panel{
  color: #eee;
  .city-list{
    display: flex;
    align-items: center;
    margin: 0 8px;
    padding: 8px 0;
    + .city-list{
      border-top: 1px solid $color6;
    }
    > span{
      display: block;
      padding: 0 13px;
      &:hover{
        cursor: pointer;
        color: $color4;
      }
    }
    .city-sub-list{
      display: flex;
      flex:1;
      flex-wrap: wrap;
      margin: 0;
      padding-left: 0;
      > li{
        padding: 0 5px;
        &:hover{
          cursor: pointer;
          color: $color4;
        }
      }
    }
  }
  
}

</style>


