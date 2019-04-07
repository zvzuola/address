<template>
  <section>
    <div
      :class="$style['cards-level1']"
      v-show="visible"
    >
      <div
        id="search_filter_block"
        :class="[$style['search-filter-block'],$style[searchSortVisiblePanel]]"
      >
        <ul :class="$style['filter-toolbar']">
          <li
            v-for="(item,index) in searchSortBtnList"
            :key="index"
            :class="[$style['sort-btn'],$style[item.class], {[$style.active]: index === active}]"
            @click="handleSearchSortBtnClick(index)"
          >
            <span>{{item.title}}</span>
            <i :class="[$style['icon-arrow'], $style['arrow-status']]"></i>
          </li>
        </ul>
        <div :class="$style['search-panel-city']">
          <ul :class="$style['area-list']">
            <li
              :class="[$style['area-item'],{[$style.active]: index === areaListActive}]"
              v-for="(item,index) in cityFilterList"
              :key="index"
              @mouseover="handleAreaItemHover(index)"
            >
              <span class="town">{{item.label}}</span>
            </li>
          </ul>
          <div :class="$style['area-sub-list']">
            <ul>
              <li
                v-for="(item,index) in cityFilterList[areaListActive].items"
                :key="index"
              >
                <a
                  href="javascript:;"
                  @click="handleCityFilterClick(item)"
                >{{item}}</a>
              </li>
            </ul>
          </div>
        </div>
        <div :class="$style['search-panel-building']">
          <ul>
            <li
              v-for="(item,index) in buildingFilterList"
              :key="index"
              @click="handleBuildingFilterClick(item)"
            >
              {{item}}
            </li>
          </ul>
        </div>
        <div :class="$style['search-panel-match']">
          <ul>
            <li
              v-for="(item,index) in matchFilterList"
              :key="index"
              @click="handleMatchFilterClick(item)"
            >
              {{item}}
            </li>
          </ul>
        </div>
      </div>

      <div :class="$style['address-list']">
        <ul>
          <li
            v-for="(item,index) in dataSource"
            :key="index"
            @click="handleAddressItemClick(item)"
          >
            <div>{{index+1}}</div>
            <div>{{item.name}}</div>
            <div>{{item.address}}</div>
            <div>类型：{{item.addtype}}</div>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script>
import {mapActions, mapState} from 'vuex';
import cityData from '@/../public/data/city.json'

export default {
  // props:{
  //   dataSource:{
  //     type: Array,
  //     default(){
  //       return [];
  //     }
  //   }
  // },
  watch:{
    addrListvisible(val){
      this.visible = val;
    },
    addrListData:{
      deep: true,
      handler: function(val){
        this.dataSource = val;
      }
    }
  },
  computed:{
    ...mapState({
      addrListvisible: state=>state.cardAddrList.visible,
      addrDetailsVisible: state=>state.cardAddrDetails.visible,
      addrListData: state=>state.cardAddrList.data,
    })
  },
  data(){
    return{
      dataSource: {},
      visible: false,
      active: -1,
      areaListActive: 0,
      searchSortBtnList: [
        {
          title: '上城区',
          class: 'city-btn'
        },
        {
          title: '全部尺度',
          class: 'building-btn'
        },
        {
          title: '模糊匹配',
          class: 'match-btn'
        }
      ],
      searchSortVisiblePanel: '',
      cityFilterList: cityData.data,
      buildingFilterList: [
        '全部尺度','幢','分层','单元','分户'
      ],
      matchFilterList:[
        '模糊匹配',
        '精确匹配'
      ],
    }
  },
  methods:{
    ...mapActions({
      setVisible: 'cardAddrList/setVisible',
      setAddrDetailsVisible: 'cardAddrDetails/setVisible',
      setAddrDetailsData: 'cardAddrDetails/setData',
      setAddrListData: 'cardAddrList/setData',
    }),
    handleSearchSortBtnClick(index) {
      let searchSortPanelList = ['city-panel', 'building-panel', 'match-panel'];
      if (this.searchSortVisiblePanel === searchSortPanelList[index]) {
        this.searchSortVisiblePanel = '';
        this.active = -1;
      } else {
        this.searchSortVisiblePanel = searchSortPanelList[index];
        this.active = index;
      }
    },
    handleAreaItemHover(index){
      this.areaListActive = index;
    },
    handleAddressItemClick(item){
      this.setVisible(false);
      this.setAddrDetailsData(item);
      this.setAddrDetailsVisible(true);
    },

    handleCityFilterClick(item){
      //行政区过滤
      this.searchSortBtnList[0].title = item;
      this.handleSearchSortBtnClick(0);
    },
    handleBuildingFilterClick(item){
      //尺度过滤
      this.searchSortBtnList[1].title = item;
      this.handleSearchSortBtnClick(1);
    },
    handleMatchFilterClick(item){
      //模糊精确匹配
      this.searchSortBtnList[2].title = item;
      this.handleSearchSortBtnClick(2);
    },
  },

}
</script>

<style lang="scss" module>

.icon-arrow {
  display: inline-block;
  position: absolute;
  top: 10px;
  right: 8px;
  height: 4px;
  width: 7px;
  background: url('/img/arrow-select.png') no-repeat;
}

.arrow-status {
  background-position: -11px 0;
}

.city-panel .city-btn .arrow-status,
.building-panel .building-btn .arrow-status,
.match-panel .match-btn .arrow-status {
  background-position: 0 0 !important;
}

// .city-panel .city-btn,
// .building-panel .building-btn,
// .match-panel .match-btn {
//   background-color: $bg-color !important;
// }

.search-panel-city,
.search-panel-building,
.search-panel-match {
  display: none;
  background-color: $bg-color;
  margin: 0 auto;
  border: 1px solid $border-color;
  border-top: 0;
}

.city-panel .search-panel-city,
.building-panel .search-panel-building,
.match-panel .search-panel-match {
  display: flex;
  position: absolute;
  width: 100%;
}



.cards-level1 {
  background-color: $bg-color;
  margin-top: 5px;
  overflow-y: auto;
  height: 350px;
  padding: 10px;
  @include scrollbar();
  .search-filter-block {
    position: relative;
    .filter-toolbar {
      display: flex;
      padding-left: 0;
      margin: 0;
      border-top: 1px solid $border-color;
      border-left: 1px solid $border-color;;
      border-right: 1px solid $border-color;
      .sort-btn {
        // display: inline-block;
        flex: 1;
        position: relative;
        // width: 124px;
        background-color: $color7;
        text-align: center;
        padding: 3px 0px;
        font-size: 13px;
        border-bottom: 1px solid $border-color;
        &.active {
          border-bottom: 1px solid transparent;
          background-color: $bg-color !important;
        }
        + .sort-btn {
          &::before{
            content: " ";
            position: absolute;
            width: 1px;
            height: 100%;
            top:0;
            left: 0;
            background: $border-color;
          }
        }
        &:hover {
          cursor: pointer;
        }
      }
    }
    .search-panel-city{
      background-color: $color7;
      .area-list{
        flex:1;
        border-right: 1px solid $border-color;
        background-color: $bg-color;
        margin: 0;
        height: 100%;
        padding-left: 0;
        &:hover{
          cursor: pointer;
        }
        .active{
          background-color: $color7;
          border-top: 1px solid $border-color;
          & + li{
            border-top: 1px solid $border-color;
          }
          & > span{
            border-right: 1px solid $color7;
            right: -1px;
            position: relative;
            padding-left: 0px;
          }
        }
        & > li{
          text-align: center;
          border-top: 1px solid transparent;
          &:hover{
            cursor: pointer;
          }
          & > span{
            padding: 4px 0;
            display: block;
            padding-left: 1px;
          }
        }
      }
      .area-sub-list{
        flex:2;
        ul{
          margin: 0;
          padding: 5px;
          li{
            display: inline-block;
            margin: 0 5px;
            a{
              text-decoration: none;
              color: $color5;
              &:hover{
                color: $color4;
              }
            }
          }
        }
      }
    }
    .search-panel-building,
    .search-panel-match{
      text-align: center;
      ul{
        width: 100%;
        padding-left:0;
        margin: 0;
        li{
          padding: 2px 0;
          &:hover{
            background-color: $color7;
            cursor: pointer;
          }
        }
      }
    }
  }
  .address-list {
    ul {
      // padding-left: 10px;
      li {
        margin-bottom: 5px;
        &:hover {
          background-color: $hover-color;
          cursor: pointer;
        }
      }
    }
  }
}

</style>


