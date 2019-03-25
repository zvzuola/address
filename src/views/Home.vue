<template>
  <section>
    <div id="search_left_panel">
      <el-input
        clearable
        placeholder="请输入地址"
        v-model="input"
        @clear="handleInputClear"
        class="input-with-select"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="handleSearch"
        ></el-button>
      </el-input>
      <div :class="$style['cards-level0']" v-show="cardsVisible[0]"
      @mouseover="handleCardsLevel0Hover">
        共找到{{addressList.length}}个搜索结果
      </div>
      <div
        :class="$style['cards-level1']"
        v-show="cardsVisible[1]"
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
            <ul class="area-list">
              <li :class="[$style['area-item'],{[$style.active]: index === areaListActive}]" 
              v-for="(item,index) in cityFilterList" :key="index" 
              @mouseover="handleAreaItemHover(index)">
                <span class="town">{{item.label}}</span>
              </li>
            </ul>
            <ul class="area-sub-list">
              <li v-for="(item,index) in cityFilterList[areaListActive].items" :key="index">
                <a href="javascript:;">{{item}}</a>
              </li>
            </ul>
          </div>
          <div :class="$style['search-panel-building']">
            <ul>
              <li class="area-list" v-for="(item,index) in buildingFilterList" :key="index">
                {{item}}
              </li>
            </ul>
          </div>
          <div :class="$style['search-panel-match']">
            <ul>
              <li class="area-list" v-for="(item,index) in matchFilterList" :key="index">
                {{item}}
              </li>
            </ul>
          </div>
        </div>

        <div :class="$style['address-list']">
          <ul>
            <li
              v-for="(item,index) in addressList"
              :key="index"
              @click="handleAddressItemClick(item)"
            >
              <div>{{index+1}}</div>
              <div>地址：{{item.address}}</div>
              <div>辖区：{{item.county}}</div>
              <div>街道：{{item.street}}</div>
              <div>社区：{{item.community}}</div>
            </li>
          </ul>
        </div>
      </div>
      <div :class="$style['cards-level2']" v-show="cardsVisible[2]">
        <div id="returnfixed" @click="handleReturnClick"><i class="el-icon-arrow-left"></i>返回</div>
        <div>地址：{{addressItemData.address}}</div>
      </div>
    </div>
    <!-- 右侧工具条 -->
    <div
      id="search_righttop_panel"
      :class="$style['tool-box']"
    >
      <div
        v-for="(item,index) in toolBoxList"
        :key="index"
        :class="[$style['tool-button'],{[$style['tool-btn-active']]: index == toolBtnActive}]"
        @click="handleToolBtnClick(index)"
      >
        <svg-icon
          :icon="item.icon"
          :class="$style['tool-icon']"
        />
        <span>{{item.title}}</span>
      </div>
    </div>
    <div
      id="tool_panel_extent"
      v-show="toolPanelVisible[1]"
      :class="$style['tool-panel']"
    >空间查询</div>
  </section>
</template>

<script>
import Sidebar from '@/components/sidebar/Sidebar';
import { getAddressList } from '@/api/index';
import cityData from '@/../public/data/city.json'

export default {
  name: 'Home',
  components: {
    sidebar: Sidebar
  },
  data() {
    return {
      baseUrl: process.env.BASE_URL,
      cardsVisible: [0,0,0],
      input: '',
      addressList: [],
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
        '幢','分层','单元','分户'
      ],
      matchFilterList:[
        '模糊匹配',
        '精确匹配'
      ],

      areaListActive: 0,
      addressItemData: {
        address:'',
      },

      toolBtnActive: -1,
      toolPanelVisible: [0, 0, 0, 0],
      toolBoxList: [
        {
          title: '下城区',
          icon: 'building'
        },
        {
          title: '空间查询',
          icon: 'building'
        },
        {
          title: '匹配引擎',
          icon: 'building'
        },
        {
          title: '底图',
          icon: 'building'
        }
      ],
      active: -1
    };
  },
  mounted() {
    this.getAddress();
  },
  beforeDestroy() {},
  methods: {
    handleSearch() {
      if (!this.input) {
        return;
      }
      this.cardsVisible = [0,1,0];
    },
    handleInputClear() {
      this.cardsVisible = [0,0,0];
    },
    getAddress() {
      getAddressList().then(res => {
        if (res.success) {
          this.addressList = res.data;
        }
      });
    },
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

    handleToolBtnClick(index) {
      this.toolPanelVisible = [0, 0, 0, 0];
      this.toolPanelVisible[index] = 1;
      this.toolBtnActive = index;
      switch (index) {
        case 0:
          console.log('下城区');
          break;
        case 1:
          console.log('空间查询');
          break;
        case 2:
          console.log('匹配引擎');
          break;
        case 3:
          console.log('底图');
          break;
        default:
          break;
      }
    },

    handleAreaItemHover(index){
      this.areaListActive = index;
    },

    handleAddressItemClick(item){
      this.cardsVisible = [0,0,1];
      this.addressItemData = item;
    },
    handleReturnClick(){
      this.cardsVisible = [0,1,0];
    },
    showCardLevel0(){
      if(this.cardsVisible[1]){
        this.cardsVisible = [1,0,0];
      }
    },
    handleCardsLevel0Hover(){
      this.cardsVisible = [0,1,0];
    }
  }
};
</script>
<style lang="scss" module>
$bg-color: #fff;
$hover-color: #eee;

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
  width: 362px;
  height: 200px;
  background-color: $bg-color;
  position: absolute;
  margin: 0 auto;
  border: 1px solid #ccc;
  border-top: 0;
}

.city-panel .search-panel-city,
.building-panel .search-panel-building,
.match-panel .search-panel-match {
  display: block;
  width: 100%;
}

.cards-level0{
  background-color: $bg-color;
  margin-top: 5px;
  height: 40px;
  padding: 10px;
  &:hover{
    cursor: pointer;
  }
}

.cards-level1 {
  background-color: $bg-color;
  margin-top: 5px;
  overflow-y: auto;
  height: 350px;
  padding: 10px;
  &::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 6px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 1px;
  }
  &::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    // border-radius: 10px;
    // -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    background: #949494;
  }
  &::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    // -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    // border-radius: 10px;
    background: #ededed;
  }
  .search-filter-block {
    position: relative;
    .filter-toolbar {
      display: flex;
      padding-left: 0;
      margin: 0;
      border-top: 1px solid #ccc;
      border-left: 1px solid #ccc;;
      border-right: 1px solid #ccc;
      .sort-btn {
        flex: 1;
        position: relative;
        // width: 120px;
        background-color: #eee;
        text-align: center;
        padding: 3px 0px;
        font-size: 13px;
        border-bottom: 1px solid #ccc;
        &.active {
          border-bottom: 1px solid transparent;
          background-color: $bg-color !important;
        }
        + .sort-btn {
          border-left: 1px solid #ccc;
        }
        &:hover {
          cursor: pointer;
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

.cards-level2{
  background-color: $bg-color;
  margin-top: 5px;
  overflow-y: auto;
  height: 350px;
  padding: 10px;
  &::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 6px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 1px;
  }
  &::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    // border-radius: 10px;
    // -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    background: #949494;
  }
  &::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    // -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    // border-radius: 10px;
    background: #ededed;
  }
}

.tool-box {
  display: flex;
  position: absolute;
  right: 20px;
  top: 70px;
  background-color: $color1;
  padding: 8px 13px;
  .tool-button {
    font-size: 15px;
    justify-content: center;
    flex-direction: row;
    color: $color6;
    &:hover {
      color: $color4;
      cursor: pointer;
    }
    &:nth-child(n + 2)::before {
      content: '';
      border-left: 1px solid $color6;
      margin-right: 10px;
      margin-left: 10px;
    }
    .tool-icon {
      margin-right: 3px;
    }
  }
  .tool-btn-active {
    color: $color4;
  }
}

.tool-panel {
  background-color: $color1;
  width: 200px;
  height: 200px;
  position: absolute;
  right: 90px;
  top: 115px;
}
</style>

<style lang="scss">
#search_left_panel {
  position: absolute;
  width: 400px;
  left: 20px;
  .el-input__inner,
  .el-input-group__append {
    border-radius: 0px;
  }
}

#returnfixed{
  cursor: pointer;
}
</style>

