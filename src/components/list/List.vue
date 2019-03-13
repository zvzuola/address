<template>
  <div :class="$style.list">
    <div :class="$style.listItem" v-for="(item, index) in dataSource" :key="index">
      <slot :item="item"/>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  props: {
    dataSource: {
      type: Array,
      default() {
        return [];
      }
    }
  }
};
</script>
<style lang="scss" module>
.list {
  padding: 20px;
  .listItem {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    & + .listItem {
      border-top: 1px solid #ddd;
    }
  }
}
</style>
