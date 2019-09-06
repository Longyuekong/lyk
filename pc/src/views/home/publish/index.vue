<template>
  <el-form  ref="form" :model="form" :rules="rules" label-width="60px">
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
        channel_id: ""
      },
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
                  this.$router.push("/article");
                }
              });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  },
  created() {
    //一进来就发送请求,如果是新增页就不需要发请求,因为不需要数据
    if (this.$router.name === "publish.edit") {
      this.$axios
        .get(`/mp/v1_0/articles/${this.$route.params.id}`)
        .then(res => {
          // console.log(res);
          // this.form = res.data.data;
          this.form = res.data.data;
        });
    }else{

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