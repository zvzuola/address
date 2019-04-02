<template>
  <section>
    <el-row>
      <el-col :span="24">
        <i class="el-icon-close" :class="$style['close-btn']" @click="handleCloseClick"></i>
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

    <div :class="$style['match-list']" v-show="listVisible">
      <ul>
        <li
          v-for="(item,index) in tableData"
          :key="index"
        >
          <div>{{index+1}}</div>
          <div>地名：{{item.searchname}}</div>
          <div>匹配结果{{item.name}}</div>
          <div>坐标：{{item.pos}}</div>
          <div>匹配度：{{item.percent}}</div>
          <div>类型: {{item.type}}</div>
        </li>
      </ul>
    </div>
    <!-- <el-table :data="tableData" v-loading="loading" border fit style="width: 100%" height="400">
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
    </el-table> -->
  </section>
</template>

<script>
import {getAddressMatchList} from '@/api/index'

export default {
  name: 'AddressMatch',
  data(){
    return{
      textarea: '',
      loading: false,
      tableData: [],
      listVisible: false
    }
  },
  methods:{
    handleCloseClick(){
      this.$router.push('search');
    },
    handleSearch() {
      getAddressMatchList().then(res=>{
        if(res.success){
          this.tableData = res.data;
          this.listVisible = true;
        }
      })
    }
  }
}
</script>

<style lang="scss" module>
.close-btn{
  position: absolute;
  right: 0;
  &:hover::before{
    cursor: pointer;
    color: $color4;
  }
}

.switch-btn {
  position: absolute;
  bottom: 20px;
  right: 20px;
}

.match-list{
  background-color: $color1;
  height: 400px;
  overflow-y: auto;
  @include scrollbar();
}
</style>

