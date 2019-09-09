<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <h1>账户信息</h1>
    </div>
    <el-row :gutter="20">
      <el-col :span="14">
        <el-form ref="form" :model="myForm" label-width="100px">
          <el-form-item label="媒体名称">
            <el-input v-model="myForm.name"></el-input>
          </el-form-item>
          <el-form-item label="媒体简介">
            <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="myForm.intro"></el-input>
          </el-form-item>
          <el-form-item label="头条号id">
            <el-input v-model="myForm.id" disabled></el-input>
          </el-form-item>
          <el-form-item label="绑定手机号">
            <el-input v-model="myForm.mobile" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="myForm.email"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="doSave">保存</el-button>
            <el-button>取消</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="10">
        <p>更改头像</p>
        <el-upload
          class="avatar-uploader"
          action
          :http-request="newWebsite"
          :show-file-list="false"
        >
          <img v-if="$store.state.userMsg.photo" :src="$store.state.userMsg.photo" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon" style="line-height:178px"></i>
        </el-upload>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
export default {
  name: "account",
  data() {
    return {
      myForm: {
        name: "",
        intro: "",
        mobile: "",
        email: "",
        id: "",
        photo: ""
      },
      headers: {
        Authorization: `Bearer ${
          JSON.parse(window.sessionStorage.getItem("userInfo")).token
        }`
      }
    };
  },
  methods: {
    getData() {
      this.$axios.patch(`/mp/v1_0/user/profile`, this.myForm).then(res => {
        // console.log(res);
        if (res.data.message.toLowerCase() === "ok") {
          this.$message.success("更新完成!");
          // 修改后的数据要给vuex更新
          this.$store.commit("getMsg", this.myForm);
        }
      });
    },
    doSave() {
      this.getData();
    },
    newWebsite(data) {
      // console.log(data.file);
      let fd = new FormData();
      fd.append("photo", data.file);
      // 参数1：参数名
      // 参数2：真正要上传的值
      this.$axios.patch(`/mp/v1_0/user/photo`, fd).then(res => {
        // console.log(res);
        //上传成功就把这张图片赋给仓库和头像
        this.myForm.photo = res.data.data.photo;
        this.$store.commit("getMsg", this.myForm);
        this.$message.success('图片上传成功')
      });
    }
  },
  created() {
    this.$axios.get(`/mp/v1_0/user/profile`).then(res => {
      // console.log(res);
      // console.log("我是created,我被执行了");
      this.myForm = res.data.data;
      this.$store.commit("getMsg", this.myForm);
    });
  }
};
</script>

<style>
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
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>