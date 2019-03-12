<template>
  <sidebar>
    <el-row>
      <el-col :span="24">
        <el-input type="textarea" :rows="8" placeholder="请输入地名地址" v-model="textarea" resize="none"></el-input>
        <el-button
          :class="$style['switch-btn']"
          size="medium"
          type="primary"
          icon="el-icon-refresh"
          @click="handleSearch"
        >转换</el-button>
      </el-col>
    </el-row>

    <div style="margin-top:20px"></div>
    <el-table :data="tableData" v-loading="loading" border fit style="width: 100%" height="400">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="searchname" label="地名" width="180"></el-table-column>
      <el-table-column prop="name" label="匹配结果" width="180"></el-table-column>
      <el-table-column prop="pos" label="坐标" width="180">
        <template slot-scope="scope">
          <el-tag size="medium" type="info">
            <i class="el-icon-location"></i>
            {{ scope.row.pos }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="percent" label="匹配度">
        <template slot-scope="scope">
          <el-progress
            :text-inside="true"
            :stroke-width="18"
            :percentage="scope.row.percent"
            :status="getStatus(scope.row.percent)"
          ></el-progress>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="类型">
        <template slot-scope="scope">
          <el-tag size="medium">{{ scope.row.type }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            v-show="scope.row.percent"
            @click="handleDetail(scope.$index, scope.row)"
          >查看结果</el-button>
        </template>
      </el-table-column>
    </el-table>
  </sidebar>
</template>
<script>
import Sidebar from '@/components/sidebar/Sidebar';

export default {
  components: {
    sidebar: Sidebar
  },
  data() {
    return {
      textarea: '',
      loading: false,
      tableData: []
    };
  },
  methods: {
    handleSearch() {}
  }
};
</script>
<style lang="scss" module>
.switch-btn {
  position: absolute;
  bottom: 20px;
  right: 20px;
}
</style>
