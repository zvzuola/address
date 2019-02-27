<template>
  <div id="app">
    <nav :class="$style['m-nav']">
      <h3 :class="$style['nav-title']">下城数字旅游专线</h3>
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
    <router-view/>
  </div>
</template>

<script>
export default {
  data() {
    return {
      navList: [
        {
          label: '下城漫游',
          icon: 'show'
        }
        // {
        //   label: '城市大脑下城1Call专班',
        //   icon: ''
        // },
        // {
        //   label: '网格管理',
        //   icon: 'grid'
        // },
        // {
        //   label: '楼宇展示',
        //   icon: 'building'
        // },
        // {
        //   label: '老年人专题',
        //   icon: 'people'
        // }
      ],
      active: 0
    };
  },
  methods: {
    handleActive(index) {
      this.active = index;
    }
  }
};
</script>


<style lang="scss" module>
$color1: #005670;
$color2: #ffaa60;
$color3: #fff1f1;
$color4: #5bd5ee;
$color-shadow: #000;

.m-nav {
  display: flex;
  position: absolute;
  width: 100%;
  height: 80px;
  background: linear-gradient($color1, transparent);
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
</style>
