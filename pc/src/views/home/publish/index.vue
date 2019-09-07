<template>
  <el-form ref="form" :model="form" :rules="rules" label-width="60px">
    <!-- 标题 -->
    <el-form-item label="标题" prop="title">
      <el-input v-model="form.title" placeholder="请添加标题" size="large"></el-input>
    </el-form-item>
    <!-- 富文本编译器 -->
    <!-- el-form-item为一行 -->
    <el-form-item label="内容">
      <quillEditor v-model="form.content" :options="editorOption"></quillEditor>
    </el-form-item>
    <!-- 封面 -->
    <el-form-item label="封面:">
      <el-radio-group v-model="form.status">
        <el-radio label>单图</el-radio>
        <el-radio :label="0">三图</el-radio>
        <el-radio :label="1">无图</el-radio>
        <el-radio :label="2">自动</el-radio>
      </el-radio-group>
    </el-form-item>
    <!-- 频道 -->
    <el-form-item label="频道">
      <mychannel v-model="form.channel_id"></mychannel>
    </el-form-item>
    <!-- 发表文章按钮 -->
    <br />
    <el-form-item>
      <el-button plain>存为草稿</el-button>
      <el-button type="primary" plain @click="pubArticle('form')">发表文章</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
//因为富文本编译器只在这一个页面上使用,所以在这里导入模块
// require styles
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";
import mychannel from "../../../components/mychannel";
import { watch } from "fs";
export default {
  name: "publish",
  components: {
    quillEditor,
    mychannel
  },
  data() {
    return {
      form: {
        title: "",
        content: "",
        status: "",
        channel_id: "",
        isSend:false
      },
      newForm: {},
      // 用来接受传过来的数据
      rules: {
        name: [
          {
            required: true,
            message: "文章标题不能为空哦",
            trigger: "blur"
          },
          {
            min: 5,
            max: 30,
            message: "文章标题不能少于5个字哦",
            trigger: "blur"
          }
        ]
      },

      // 富文本配置
      editorOption: {
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"], // toggled buttons
            ["blockquote", "code-block"],
            [{ header: 1 }, { header: 2 }], // custom button values
            [{ list: "ordered" }, { list: "bullet" }],
            [{ script: "sub" }, { script: "super" }], // superscript/subscript
            [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
            [{ direction: "rtl" }], // text direction
            [{ color: [] }, { background: [] }], // dropdown with defaults from theme
            [{ align: [] }],
            ["image"],
            ["clean"] // remove formatting button
          ]
        }
      }
    };
  },
  methods: {
    pubArticle(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.$route.name === "publish-edit") {
            //做修改
            this.$axios
              .put(`/mp/v1_0/articles/${this.$route.params.id}`, {
                title: this.form.title,
                content: this.form.content,
                cover: {
                  type: 1,
                  images: [
                    "http://toutiao.meiduo.site/Fjl26KTE9-NFfkRzIZOner4yeqGl"
                  ]
                },
                channel_id: this.form.channel_id
              })
              .then(res => {
                if (res.data.message.toLowerCase() == "ok") {
                  this.$message.success("修改成功");
                  this.newForm = this.form;
                  this.$router.push("/article");
                }
              });
          } else {
            // 发请求去做新增
            this.$axios
              .post("/mp/v1_0/articles", {
                title: this.form.title,
                content: this.form.content,
                cover: {
                  type: 1,
                  images: [
                    "http://toutiao.meiduo.site/Fjl26KTE9-NFfkRzIZOner4yeqGl"
                  ]
                },
                channel_id: this.form.channel_id
              })
              .then(res => {
                if (res.data.message.toLowerCase() == "ok") {
                  this.$message.success("发布成功！");
                  this.newForm = this.form;
                  this.isSend=true;
                  this.$router.push("/article");
                  
                }
              });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    sendData() {
      //1.发送请求很频繁,所以封装
      this.$axios
        .get(`/mp/v1_0/articles/${this.$route.params.id}`)
        .then(res => {
          this.form = res.data.data;
          //对象的解构语法
          this.newForm = { ...this.form };
        });
    }
  },

  created() {
    //一进来就发送请求,如果是新增页就不需要发请求,因为不需要数据
    // 新增不需要发请求
    if (this.$route.name === "publish-edit") {
      this.sendData();
    } else {
      //新增就不需要加载中，直接就停掉
      console.log(11111);

    }
  },
  //to：到哪去
  //from：从哪来
  //next：放行，是否继续跳转，调用就代表继续跳转，不调用就代表不跳转
  beforeRouteLeave(to, from, next) {
    if (this.$route.name === "publish-edit") {
      if (
        this.form.title == this.newForm.title &&
        this.form.content == this.newForm.content
      ) {
        return next();
      }
    } else {
      // 新增判断是否为空
      if (this.form.title == "" && this.form.content ==''|| this.isSend) {
        this.isSend=false;
        //设置开关思想,当我们点击
        return next();
      }
    }

    //要问一下用户是否要离开
    this.$confirm("您当前页面有未保存的内容，是否继续离开？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        //点击确定了
        next();
      })
      .catch(() => {
        //点击取消了
      });
  },

  watch: {
    // 参数是变化后的值
    "$route.params.id"(value) {
      console.log('变化了：' + value)
      if (value) {
        //有值，代表这是修改，只是把id变了，根据新的id去发请求获取数据渲染界面
        this.sendData();
      } else {
        //如果value没值，代表是新增，新增就要把界面清空
        this.form.title = "";
        this.form.content = "";
      }
    }
  }
};
</script>

<style >
.ql-editor {
  height: 400px;
  background-color: #fff;
}
</style>