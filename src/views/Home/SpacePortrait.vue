<template>
  <section :class="$style['portrait-panel']">
    <i class="el-icon-close" :class="$style['close-btn']" @click="handleCloseClick"></i>
    <el-button @click="newTopic">新建主题</el-button>
    <el-collapse accordion>
  <el-collapse-item>
    <template slot="title">
      一致性 Consistency<i class="header-icon el-icon-info"></i>
    </template>
    <div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
    <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>
  </el-collapse-item>
    <el-collapse-item title="反馈 Feedback">
      <div>控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>
      <div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div>
    </el-collapse-item>
    <el-collapse-item title="效率 Efficiency">
      <div>简化流程：设计简洁直观的操作流程；</div>
      <div>清晰明确：语言表达清晰且表意明确，让用户快速理解进而作出决策；</div>
      <div>帮助用户识别：界面简单直白，让用户快速识别而非回忆，减少用户记忆负担。</div>
    </el-collapse-item>
    <el-collapse-item title="可控 Controllability">
      <div>用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；</div>
      <div>结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。</div>
    </el-collapse-item>
  </el-collapse>
    <el-dialog id="newthemedlg" title="新建主题" :visible.sync="dialogVisible" width="50%" center :modal="false">
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

