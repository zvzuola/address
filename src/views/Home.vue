<template>
  <sidebar>
    <el-form :inline="true" :model="formInline">
      <el-form-item label="地址">
        <el-input v-model="formInline.address" placeholder="地址" size="small"></el-input>
      </el-form-item>
      <el-form-item label="地址类型">
        <el-select
          v-model="formInline.addtype"
          clearable
          placeholder="地址类型"
          size="small"
          @clear="handleClear"
        >
          <el-option
            v-for="(item,index) in addTypeDd"
            :label="item.value"
            :value="item.code"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="辖区">
        <el-input v-model="formInline.county" placeholder="辖区" size="small"></el-input>
      </el-form-item>
      <el-form-item label="街道">
        <el-input v-model="formInline.street" placeholder="街道" size="small"></el-input>
      </el-form-item>
      <el-form-item label="社区">
        <el-input v-model="formInline.communit" placeholder="社区" size="small"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch" size="small">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="tableData" v-loading="loading" border fit style="width: 100%" height="450">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="name" label="地址" width="180"></el-table-column>
      <el-table-column prop="county" label="辖区"></el-table-column>
      <el-table-column prop="street" label="街道"></el-table-column>
      <el-table-column prop="communit" label="社区"></el-table-column>
      <el-table-column prop="addtype" label="类型">
        <template slot-scope="scope">{{getAddTypeByCode(scope.row.addtype)}}</template>
      </el-table-column>
    </el-table>

    <div style="margin-top:10px"></div>
    <el-pagination
      v-if="pagination.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagination.currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pagination.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pagination.total"
    ></el-pagination>
  </sidebar>
</template>

<script>
import Sidebar from '@/components/sidebar/Sidebar';

export default {
  name: 'Home',
  components: {
    sidebar: Sidebar
  },
  data() {
    return {
      loading: false,
      dialogTableVisible: false,
      tableData: [],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      addressDetail: {
        name: null,
        type: null,
        company: null
      },
      formInline: {
        name: null,
        address: null,
        county: null,
        street: null,
        communit: null,
        addtype: null
      },
      addTypeDd: [],
      areaUseTypeDd: [],
      buildingTypeDd: []
    };
  },
  mounted() {},
  beforeDestroy() {},
  methods: {
    handleSearch() {
      this.pagination.currentPage = 1;
      this.getAddressListData(this.formInline);
    },
    getAddressListData(obj) {
      const param = {
        address: JSON.stringify(obj),
        pageSize: this.pagination.pageSize,
        currentpage: this.pagination.currentPage
      };
      console.log(param);
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.getAddressListData(this.formInline);
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.getAddressListData(this.formInline);
    },
    getAddTypeByCode(code) {
      const obj = this.addTypeDd.find(p => p.code === code);
      if (obj) {
        return obj.value;
      }
      return '';
    },
    handleClear() {
      this.formInline.addtype = null;
    }
  }
};
</script>
<style lang="scss" module>
.home {
  height: 100vh;
  width: 100vw;
}
</style>
