<template>
  <div :class="[$style.checkbox, {[$style.close]: !open}]">
    <div v-if="title" :class="$style.title" @click="toggle">{{title}}</div>
    <div v-for="item in data" :key="item.value" :class="$style.item">
      <label>
        {{item.label}}
        <input
          type="checkbox"
          :value="item.value"
          v-model="checkedValue"
          @change="handleChange"
        >
      </label>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      open: true,
      checkedValue: this.defaultValue || []
    };
  },
  props: {
    data: {
      type: Array,
      default() {
        return [];
      }
    },
    title: {
      type: String,
      required: true
    },
    defaultValue: {
      type: Array
    }
  },
  methods: {
    toggle() {
      this.open = !this.open;
    },
    handleChange(e) {
      if (e.target.checked) {
        this.checkedValue = [e.target.value];
      } else {
        this.checkedValue = [];
      }
      this.$emit('change', e, this.checkedValue);
    }
  }
};
</script>
<style lang="scss" module>
.checkbox {
  min-width: 200px;
  &.close {
    .title {
      background-image: url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlGIWqMCbWAEAOw==);
    }
    .item {
      height: 0;
      overflow: hidden;
      border: 0;
    }
  }
}
.title {
  padding-left: 16px;
  color: #eee;
  font-size: 14px;
  height: 35px;
  line-height: 35px;
  cursor: pointer;
  background: rgba(0, 0, 0, 0.6)
    url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlI+hKgFxoCgAOw==)
    8px 15px no-repeat;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.item {
  border-left: 3px solid #5bd5ee;
  font-size: 13px;
  height: 34px;
  line-height: 34px;
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.6);
  border-bottom: 1px solid #2c2c2c;
  color: #eee;
  &:hover {
    background: #111;
  }
  label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 12px;
    padding-right: 24px;
    cursor: pointer;
  }

  input[type='checkbox'] {
    position: relative;
    -webkit-appearance: none;
    vertical-align: middle;
    margin-top: 0;
    background: rgba(255, 255, 255, 0.2);
    border: rgba(153, 153, 153, 0.6) solid 1px;
    border-radius: 3px;
    min-height: 12px;
    min-width: 12px;
    width: 18px;
    height: 18px;
    margin: 0;

    &:checked {
      background: #005670;
      &:after {
        content: '';
        top: 2px;
        left: 2px;
        position: absolute;
        background: transparent;
        border: #fff solid 2px;
        border-top: none;
        border-right: none;
        height: 6px;
        width: 10px;
        transform: rotate(-45deg);
      }
    }
  }
}
</style>
