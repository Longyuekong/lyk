<template>
  <div>
    <div class="wrap" @click="dialogVisible = true">
      <p v-if="!isShow">点击上传图片</p>
      <i v-if="!isShow" class="iconfont icon-image_upload"></i>
      <img v-if="!isShow" :src="imageUrl" alt />
    </div>
    <!-- 中间内容 -->
    <el-dialog :visible.sync="dialogVisible" width="50%" style="background-color:#fff">
      <el-tabs v-model="activeName">
        <el-tab-pane label="素材库" name="first">
          <imgmedia @checked="imageUrl = $event"></imgmedia>
        </el-tab-pane>
        <el-tab-pane label="上传图片" name="second">
          <el-upload
            class="avatar-uploader"
            action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
            :show-file-list="false"
            :on-success="doSuccess"
            :headers="header"
            name="image"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-tab-pane>
      </el-tabs>

      <!-- 按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doOK">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { log } from "util";
import imgmedia from "./imgMedia.vue";
export default {
  name: "imgfile",
  components: {
    imgmedia
  },
  data() {
    return {
      isShow: false,
      //   控制对话框显示隐藏的属性
      dialogVisible: false,
      activeName: "first",
      header: {
        Authorization: `Bearer ${
          JSON.parse(window.sessionStorage.getItem("user_info")).token
        }`
      },
      imageUrl: ""
    };
  },
  methods: {
    doOk() {
      // 显示出图片
      this.isShow = true;
      // 隐藏对话框
      this.dialogVisible = false;
      // 传递当前的图片路径给父组件
      this.$emit("change", this.imageUrl);
    },

    doSuccess(response) {
      this.imageUrl = response.data.url;
    }
  }
};
</script>

<style lang='less' scoped>
.wrap {
  border: 1px solid #ccc;
  width: 220px;
  height: 220px;
  border-radius: 4px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5px;
  cursor: pointer;
  margin: -15px 0px 20px 55px;
  p {
    font-size: 20px;
    margin: 20px auto 30px;
  }
  .iconfont {
    font-size: 100px;
    width: 113px;
    height: 150px;
  }
  img {
    width: 100%;
    height: 100%;
  }
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>