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
    <el-dialog id="newthemedlg" title="新建主题" :visible.sync="dialogVisible" width="30%" center :modal="false">
      <el-form label-position="right" label-width="80px">
        <el-form-item label="主题名称">
          <el-input v-model="formData.name" placeholder="主题名称" size="small"></el-input>
        </el-form-item>
        <el-form-item label="大类">
          <el-select v-model="formData.type" size="small">
            <el-option label="大类1" value="type1"></el-option>
            <el-option label="大类2" value="type2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标签">
          <el-tag
            :key="tag"
            v-for="tag in dynamicTags"
            closable
            size="small"
            :disable-transitions="false"
            @close="handleClose(tag)">
            {{tag}}
          </el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputVisible"
            v-model="inputValue"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          >
          </el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 添加标签</el-button>
        </el-form-item>
        <el-form-item label="描述">
          <el-input type="textarea" :rows="4" v-model="formData.desc" placeholder="描述" size="small"></el-input>
        </el-form-item>
        <el-form-item label="选择文件">
          <el-upload
            :class="$style['upload']"
            action="https://jsonplaceholder.typicode.com/posts/"
            :file-list="formData.fileList"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip"></div>
          </el-upload>
        </el-form-item>
        <el-form-item label="主题列">
          <el-select v-model="formData.themeField" size="small">
            <el-option label="字段1" value="tf1"></el-option>
            <el-option label="字段2" value="tf2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="地址列">
          <el-select v-model="formData.addrField" size="small">
            <el-option label="字段1" value="af1"></el-option>
            <el-option label="字段2" value="af2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="匹配精度">
          <el-select v-model="formData.addrField" size="small">
            <el-option label="幢" value="mf1"></el-option>
            <el-option label="层" value="mf2"></el-option>
            <el-option label="户" value="mf2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-button>预览</el-button>
      <el-button>入库</el-button>
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
        name: '新建主题1',
        type: 'type1',
        tag: '',
        desc: '',
        fileList: [],
        themeField: 'tf1',
        addrField:'af1',
        match:'mf1'
      },
      dynamicTags: ['标签一', '标签二', '标签三'],
        inputVisible: false,
        inputValue: ''
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
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.dynamicTags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = '';
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

<style lang="scss">
#newthemedlg{
  .el-form-item{
    margin-bottom: 5px;
  }
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>

