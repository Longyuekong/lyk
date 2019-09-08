<template>
  <div class="wrapper">
    <div class="box-wrapper">
      <div class="logo">
        <img src="./img/login_logo.png" alt />
      </div>
      <div class="form" v-loading="isLoading">
        <!-- 栅格布局,饿了么为24格 -->
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
          <el-form-item prop="phone">
            <el-input v-model="ruleForm.phone" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item prop="code">
            <el-row>
              <el-col :span="11">
                <el-input v-model="ruleForm.code" placeholder="请输入验证码"></el-input>
              </el-col>
              <el-col :span="6" :offset="5">
                <el-button class="send-btn"
                  type="primary"
                  @click="sendReq"
                  :disabled="sec!=60"
                >{{sec==60?'点击发送':'还有' + sec+ '秒'}}</el-button>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item prop="agree">
            <el-checkbox v-model="ruleForm.agree">
              <span>我已阅读并同意</span>
              <a href="javascript:void(0)">用户协议</a>
              <span>和</span>
              <a href="javascript:void(0)">隐私条框</a>
            </el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              class="form-btn"
              @click="loginBtn('ruleForm')"
            >登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { setInterval, clearInterval } from "timers";
import { log } from "util";

export default {
  data() {
    return {
      ruleForm: {
        phone: "13911111111",
        code: "",
        agree: false
      },
      rules: {
        phone: [
          { required: true, message: "手机号不能为空!", trigger: "blur" },
          { min: 11, max: 11, message: "手机号必须为11位数", trigger: "blur" }
        ],
        code: [
          { required: true, message: "验证码不能为空", trigger: "blur" },
          {
            pattern: /^\d+$/,
            min: 6,
            max: 6,
            message: "请输入6位数字",
            trigger: "blur"
          }
        ],
        agree: [
          // { required: true, message: '请同意条款', trigger: 'change' }
          { pattern: /true/, message: "请同意条款", trigger: "change" }
          //使用正则来判断是否为true
        ]
      },
      sec: 60,
      isLoading: false
    };
  },
  methods: {
    sendReq() {
      if (this.ruleForm.phone === "") {
        this.$message.error("请输入您的手机号!");
        return; //不执行下面的代码
      }
      this.sec--; //进来就自减一次,这样就显得比较流畅
      let timeID = setInterval(() => {
        this.sec--;
        //1.因为没有发送请求,所以我们延迟3秒出效果,模拟发送短信成功
        if (this.sec === 58) {
          this.ruleForm.code = "246810";
        }
        //2.判断按钮,如果已经到了0,重新归位
        if (this.sec === 0) {
          clearInterval(timeID);
          this.sec = 60;
        }
      }, 1000);
    },
    loginBtn(formName) {
      this.isLoading = true;
      this.$refs[formName].validate(valid => {
        if (valid) {
          //1.如果登录成功就发送请求,获取数据,并且跳转
          this.$axios
            .post(`/mp/v1_0/authorizations`, {
              mobile: this.ruleForm.phone,
              code: this.ruleForm.code
            })
            .then(res => {
              //成功的
              if (res.data.data) {
                let userStr = JSON.stringify(res.data.data);
                //先转成JSON格式,后续再转成字符串
                window.sessionStorage.setItem("userInfo", userStr);
                this.$message({
                  message: "登录成功",
                  type: "success"
                });
                this.$router.push("/home");
              } else {
                this.$message({
                  message: "登录失败,请重试",
                  type: "error"
                });
              }
            })
            .catch(err => {
              console.log(err);
              this.isLoading=false;
              this.$message({
                message: "登录失败,请重试",
                type: "error"
              });
            });
        } else {
          //2.登录失败
          this.$message.error("手机号或者验证码错误,请重新登录!");
          // this.isLoading = false;
          return false;
        }
      });
      
    }
  }
};
</script>

<style lang="less" scoped>
.wrapper {
  height: 100%;
  background: url("./img/login_bg.jpg") center no-repeat / cover;
  display: flex;
  align-items: center;
  justify-content: center;
  .box-wrapper {
    width: 300px;
    background-color: #fff;
    padding: 55px;
    color: rgb(51, 51, 51);
    .logo {
      text-align: center;
      margin-bottom: 30px;
      img {
        width: 150px;
      }
    }
    .send-btn{
      width: 101px;
    }
    .form-btn {
      width: 100%;
    }
  }
}
</style>