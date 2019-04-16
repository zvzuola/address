<template>
  <section :class="$style['portrait-panel']">
    <div :class="$style['portrait-list']" id="portrait_list">
      <i class="el-icon-close" :class="$style['btn-close']" @click="handleCloseClick"></i>
      <div :class="$style['panel-title']">
        <svg-icon :class="$style['title-icon']" icon="layer"></svg-icon>
        空间主题
        <div :class="$style['btn-new']" @click="newTopic">
          <svg-icon icon="new"></svg-icon>
        </div>
      </div>
      
      <el-collapse accordion>
        <el-collapse-item v-for="(item,index) in dataSource" :key="index">
          <template slot="title">
            <div :class="$style['list-title']">
              <el-checkbox v-model="item.checked">{{item.title}}</el-checkbox>
              <svg-icon icon="people" :class="$style['icon']"></svg-icon>
            </div>
          </template>
          <div :class="$style['list-content']">
            <div>{{item.type}}</div>
            <div>{{item.describe}}</div>
            <div>
              <el-tag v-for="(tag,index) in item.tags" :key="index" size="mini">{{tag}}</el-tag>
            </div>
            
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
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
            size="mini"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          >
          </el-input>
          <el-button v-else class="button-new-tag" type="primary" size="mini" @click="showInput">+ 添加标签</el-button>
        </el-form-item>
        <el-form-item label="描述">
          <el-input type="textarea" :rows="4" resize="none" v-model="formData.desc" placeholder="描述" size="small"></el-input>
        </el-form-item>
        <el-form-item label="选择文件">
          <el-upload
            :class="$style['upload']"
            action="https://jsonplaceholder.typicode.com/posts/"
            :file-list="formData.fileList"
          >
            <el-button size="mini" type="primary">点击上传</el-button>
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
      <el-button size="mini" type="primary">预览</el-button>
      <el-button size="mini" type="primary">入库</el-button>
    </el-dialog>
  </section>
</template>
<script>
import List from '@/components/list/List';

export default {
  data() {
    let tmpData = [];
    for(let i=0; i<4; i++){
      tmpData.push({
          title: `地名地址主题${i+1}`,
          checked: false,
          type: `大类${i+1}`,
          tags:['tag1','tag2'],
          describe:`描述${i+1}XXXXXXXX`,
        })
    }
    return {
      dialogVisible: false,
      dataSource: tmpData,
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
$color-new: $color11;
.portrait-panel{
  background-color: $color1;
  .portrait-list{
    .btn-close{
      position: absolute;
      color: $color9;
      padding: 5px;
      right: 0;
      font-size: 16px;
      &:hover{
        cursor: pointer;
        color: $color4;
      }
    }
    .panel-title{
      color: $color11;
      font-size: 18px;
      font-weight: bold;
      letter-spacing: 2px;
      padding: 15px 15px 15px 20px;
      .title-icon{
        font-size: 21px;
      }
    }
    .btn-new{
      font-size: 14px;
      float: right;
      margin-right: 30px;
      background-color: rgba($color: $color-new, $alpha: 0.1);
      color: $color-new;
      border-radius: 5px;
      padding: 3px 8px;
      border: 1px solid rgba($color: $color-new, $alpha: 0.4);list-title
      &:hover{
        cursor: pointer;
        color: $color1;
        background-color:rgba($color: $color-new, $alpha: 1);
      }
    }
    .list-title{
      margin-left: 24px;
      font-size: 15px;
      width: 100%;
      label{
        color: $color15;
      }
      .icon{
        float: right;
        margin-right: 30px;
        margin-top: 11px;
        font-size: 16px;
        color: $color2;
      }
    }
    .list-content{
      color: $color15;
      margin-left: 48px;
      margin-top: 5px;
    }
  }
  
}

</style>

<style lang="scss">
#portrait_list{
  .el-collapse{
    border-top: 1px solid rgba($color: $color9, $alpha: 0.3);
    border-bottom: 1px solid rgba($color: $color9, $alpha: 0.3);
  }
  .el-collapse-item__header.is-active{
    border-bottom-color: transparent;
  }
  .el-collapse-item__header{
    height: 40px;
    line-height: 40px;
    // padding-right: 10px;
  }
  .el-collapse-item__header,
  .el-collapse-item__wrap{
    background-color: $color1;
    color: #fff;
    border-bottom: 1px solid rgba($color: $color9, $alpha: 0.3);
  }

  .el-collapse-item__content{
    color: #fff;
  }

  .el-checkbox{
    // float: right;
    // margin-right: 20px;
    .el-checkbox__inner{
      width: 16px;
      height: 16px;
      background-color: transparent;
      &::after{
        height: 11px;
        left: 5px;
        top: 0px;
        width: 4px;
      }
    }
    
  }
}

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

