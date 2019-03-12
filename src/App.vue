<template>
  <div id="app">
    <nav :class="$style['m-nav']">
      <h3 :class="$style['nav-title']"></h3>
      <ul>
        <li
          v-for="(item,index) in navList"
          :key="index"
          :class="{[$style['active']]: index == active}"
          @click="handleActive(index)"
        >
          <svg-icon :icon="item.icon" :class="$style['nav-icon']"></svg-icon>
          <span>{{item.label}}</span>
        </li>
      </ul>
    </nav>
    <div id="page-content" :class="$style['container-map']"/>
    <div :class="$style['m-container']">
      <router-view/>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import websense from '@/utils/webscene';

export default {
  data() {
    const navList = [
      {
        label: '地址查询',
        icon: 'show',
        link: '/'
      },
      {
        label: '空间查询',
        icon: 'form',
        link: '/spatial-search'
      },
      {
        label: '匹配引擎',
        icon: 'grid',
        link: '/address-match'
      },
      {
        label: '信息展示',
        icon: 'building',
        link: '/dashboard'
      },
      {
        label: '空间画像',
        icon: 'people',
        link: '/'
      }
    ];
    return {
      navList,
      active: navList.findIndex(
        v => v.link === window.location.pathname
      )
    };
  },
  mounted() {
    websense().then(({ sandbox, gs }) => {
      this.updateSandbox(sandbox);
      this.updateGs(gs);
    });
  },
  methods: {
    handleActive(index) {
      this.active = index;
      this.$router.push(this.navList[index].link);
    },
    ...mapActions(['updateSandbox', 'updateGs'])
  }
};
</script>


<style lang="scss" module>
.m-nav {
  display: flex;
  position: absolute;
  width: 100%;
  height: 80px;
  // background: linear-gradient($color1, transparent);
  background: $color1;
  color: white;
  padding-left: 20px;
  z-index: 999;
  .nav-title {
    margin: 0;
    font-size: 28px;
    line-height: 80px;
    color: rgba(255, 241, 241, 0.8);
  }
  .nav-icon {
    width: 30px;
    height: 30px;
    margin-bottom: 10px;
  }
  ul {
    display: flex;
    margin: 0px;
    padding-left: 300px;
    li {
      color: rgba(255, 255, 255, 0.8);
      list-style: none;
      padding-left: 15px;
      padding-right: 15px;
      position: relative;
      text-align: center;
      font-size: 13px;
      width: 110px;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      border-bottom: 4px solid transparent;
      cursor: pointer;
      &:hover {
        background-color: rgba($color: #000, $alpha: 0.35);
        border-bottom: 4px solid $color2;
        box-shadow: 0px 0px 5px 2px rgba($color: $color-shadow, $alpha: 0.1)
          inset;
      }
      &.active {
        background-color: rgba($color: #000, $alpha: 0.35);
        border-bottom: 4px solid $color4;
        box-shadow: 0px 0px 5px 2px rgba($color: $color-shadow, $alpha: 0.1)
          inset;
      }
    }
  }
}
.container-map {
  height: 100vh;
  width: 100vw;
  position: absolute;
  top: 0;
  right: 0;
}
.m-container {
  position: relative;
  // height: 100vh;
  // width: 100vw;
  padding-top: 100px;
}
</style>
