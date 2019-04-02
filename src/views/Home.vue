<template>
  <section>
    <div id="search_left_panel">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
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
        <i
          :class="$style['icon-arrow']"
          v-show="index===0"
        ></i>
      </div>
    </div>
    <!-- 城市切换 -->
    <city-change
      v-show="toolPanelVisible[0]"
      :class="$style['tool-panel-city']"
    ></city-change>

  </section>
</template>

<script>
// import Sidebar from '@/components/sidebar/Sidebar';
import { mapState } from 'vuex';
import CityChange from '@/views/Home/components/CityChange';

export default {
  name: 'Home',
  components: {
    // sidebar: Sidebar,
    'city-change': CityChange
  },
  data() {
    return {
      baseUrl: process.env.BASE_URL,
      // isVisible: false,
      // radio: '',
      toolBtnActive: -1,
      toolPanelVisible: [0],
      toolBoxList: [
        {
          title: '下城区',
          icon: 'building'
        },
        // {
        //   title: '底图',
        //   icon: 'building'
        // },
        {
          title: '匹配引擎',
          icon: 'building'
        },
        {
          title: '空间画像',
          icon: 'building'
        },
        {
          title: '信息展示',
          icon: 'building'
        }
      ]
    };
  },
  methods: {
    handleToolBtnClick(index) {
      if (index < this.toolPanelVisible.length) {
        this.toolPanelVisible[index] =
          this.toolPanelVisible[index] == 1 ? 0 : 1;
        this.toolBtnActive = this.toolBtnActive == index ? -1 : index;
      } else {
        this.toolBtnActive = -1;
        this.toolPanelVisible = [0];
        switch (index) {
          case 0:
            //选择行政区
            break;
          case 1:
            //匹配引擎
            this.$router.push('match');
            break;
          case 2:
            //空间画像
            this.$router.push('space-portrait');
            break;
          case 3:
            //信息展示
            this.$router.push('dashboard');
            break;
          default:
            break;
        }
      }
    }
  }
};
</script>
<style lang="scss" module>
.tool-box {
  display: flex;
  position: absolute;
  right: 20px;
  top: 30px;
  background-color: $color1;
  padding: 8px 13px;
  .tool-button {
    font-size: 15px;
    justify-content: center;
    flex-direction: row;
    color: $color6;
    .icon-arrow {
      position: relative;
      top: -2px;
      display: inline-block;
      height: 4px;
      width: 7px;
      margin-left: 5px;
      background: url('/img/arrow-select.png') no-repeat;
      background-position: -11px 0;
    }
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
    .icon-arrow {
      background-position: 0 0;
    }
  }
}
.tool-panel-city {
  overflow-y: auto;
  @include scrollbar();
  background-color: $color1;
  width: 400px;
  height: 200px;
  position: absolute;
  right: 20px;
  top: 80px;
}
</style>

<style lang="scss">
#search_left_panel {
  position: absolute;
  width: 400px;
  left: 20px;
  .el-input__inner {
    border-radius: 0px;
    border: 0;
  }
}

#returnfixed {
  cursor: pointer;
}
</style>

