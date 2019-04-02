<template>
  <section :class="$style['portrait-panel']">
    <i class="el-icon-close" :class="$style['close-btn']" @click="handleCloseClick"></i>
    <el-button @click="newTopic">新建主题</el-button>
    <list :data-source="dataSource">
      <template v-slot="scope">
        {{scope.item}}
        <el-button size="mini">展示</el-button>
      </template>
    </list>
    <el-dialog title="新建主题" :visible.sync="dialogVisible" width="30%" center>
      <el-steps :active="activeStep" finish-status="success">
        <el-step title="步骤 1"></el-step>
        <el-step title="步骤 2"></el-step>
      </el-steps>
      <!-- 第一步 -->
      <el-form v-show="activeStep === 0" label-position="right">
        <el-form-item label="主题名称">
          <el-input v-model="formData.name" placeholder="主题名称" size="small"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input type="textarea" :rows="4" v-model="formData.desc" placeholder="描述" size="small"></el-input>
        </el-form-item>
        <el-form-item label="上传文件">
          <el-upload
            :class="$style['upload']"
            action="https://jsonplaceholder.typicode.com/posts/"
            :file-list="formData.fileList"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip"></div>
          </el-upload>
        </el-form-item>
        <el-button @click="gotoStep(1)">下一步</el-button>
      </el-form>
      <!-- 第二步 -->
      <div v-show="activeStep === 1">
        <list :data-source="dataSource">
          <template v-slot="scope">{{scope.item}}</template>
        </list>
        <el-button @click="gotoStep(0)">上一步</el-button>
        <el-button>入库</el-button>
      </div>
    </el-dialog>
  </section>
</template>
<script>
import List from '@/components/list/List';

export default {
  data() {
    return {
      dialogVisible: false,
      dataSource: ['地名地址主题1', '地名地址主题2', '地名地址主题3'],
      activeStep: 0,
      formData: {
        name: '',
        desc: '',
        fileList: []
      }
    };
  },
  components: {
    list: List,
  },
  methods: {
    handleCloseClick(){
      this.$router.push('search');
    },
    newTopic() {
      this.dialogVisible = true;
    },
    gotoStep(step) {
      this.activeStep = step;
    }
  }
};
</script>
<style lang="scss" module>
.portrait-panel{
  background-color: $color1;
  .close-btn{
    position: absolute;
    right: 0;
    &:hover::before{
      cursor: pointer;
      color: $color4;
    }
  }
  .sidebar {
    background: #fff;
  }
  .upload {
  }
}

</style>
