<template>
  <section :style="styles" :class="sidebarClass">
    <slot></slot>
  </section>
</template>
<script>
export default {
  props: {
    isOpen: {
      type: Boolean,
      default: true
    },
    styles: {
      type: String
    },
    className: {
      type: String,
      default: ''
    }
  },
  computed: {
    sidebarClass() {
      return [
        this.$style.sidebar,
        {
          [this.$style.close]: !this.currentIsOpen,
          [this.className]: !!this.className
        }
      ];
    }
  },
  data() {
    return { currentIsOpen: this.isOpen };
  },
  watch: {
    isOpen(val) {
      this.currentIsOpen = val;
    }
  }
};
</script>
<style lang="scss" module>
.sidebar {
  width: 400px;
  position: absolute;
  padding: 10px;
  left: 0;
  transition: all 0.3s ease;
  background: $color1;
  color: #fff;
  &.close {
    transform: translateX(-100%);
  }
}
</style>
