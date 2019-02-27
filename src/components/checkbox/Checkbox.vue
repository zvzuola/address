<template>
  <div style="position:fixed; top: 100px">
    <div v-for="item in data" :key="item.value">
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
      checkedValue: []
    };
  },
  props: {
    data: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  methods: {
    handleChange(e) {
      if (e.target.checked) {
        this.checkedValue = [e.target.value];
      } else {
        this.checkedValue = [];
      }
      console.log(e.target.value, this.checkedValue);
      this.$emit('change', e, this.checkedValue);
    }
  }
};
</script>
