<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <el-radio-group v-model="menu" size="medium" @change="changeMenu">
        <el-radio-button label="全部"></el-radio-button>
        <el-radio-button label="收藏"></el-radio-button>
      </el-radio-group>

      <el-upload
        class="upload-demo"
        style="float:right;"
        action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
        :headers="header"
        :on-success="doSuccess"
        :show-file-list="false"
        name="image"
      ></el-upload>
    </div>

    <el-row :gutter="20" v-loading="loading">
      <el-col :span="8" class="my-col" v-for="item in imgList">
        <el-card :body-style="{ padding: '0px' }">
          <div
            @click="choose(item)"
            :class="{ checked: item.id == currentId }"
            class="img-wrap"
            style="height:160px; display:flex; justify-content:center;align-items:center;"
          >
            <img style="max-width:100%;max-height:100%" :src="item.url" class="image" />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-pagination
      background
      layout="prev, pager, next"
      :page-size="12"
      @current-change="handleCurrentChange"
      :total="total"
    ></el-pagination>
  </el-card>
</template>

<script>
export default {
  name: "mp",
  data() {
    return {
      loading: false,
      menu: "全部",
      imgList: [],
      total: 0,
      header: {
        Authorization: `Bearer ${
          JSON.parse(window.sessionStorage.getItem("userInfo")).token
        }`
      },

      //保存当前被点击的图片
      currentId: ""
    };
  },

  methods: {
    choose(item) {
      // 点谁，把谁的图片保存起来
      this.currentId = item.id;
      // 点击时我还想把图片路径传给父组件
      this.$emit("checked", item.url);
    },
    // 上传成功的钩子
    uploadSuccess(response) {
      // console.log(response);
      this.getData();
    },
    // 页码改变事件
    handleCurrentChange(page) {
      this.getData(page);
    },

    // 菜单改变
    changeMenu() {
      this.getData();
    },
    getData(page = 1) {
      this.loading = true;
      //发请求
      this.$axios
        .get("/mp/v1_0/user/images", {
          params: {
            per_page: 12,
            page: page,
            // 是否只查出收藏，true代表只查出收藏的数据，false代表查出全部
            // 菜单等于收藏就要查收藏，也就是结果要传true
            // 菜单不等于收藏就要查全部，也就是结果要传false
            collect: this.menu == "收藏"
          }
        })
        .then(res => {
          // console.log(res);
          this.imgList = res.data.data.results;
          this.total = res.data.data.total_count;
          this.loading = false;
        });
    }
  },

  created() {
    this.getData();
  }
};
</script>

<style>
.my-col {
  margin-bottom: 15px;
}

.img-wrap {
  position: relative;
}

.img-wrap.checked::before {
  /* 伪元素必须加content属性 */
  content: "";
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  position: absolute;
  /* 如果要全部透明就用opacity，但是如果仅仅只是背景颜色透明，那么就给背景颜色加rgba颜色 */
  background-color: rgba(0, 0, 0, 0.3);
  /* 最好打引号 */
  background-image: url(data:image/png;base64,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);
  background-repeat: no-repeat;
  background-position: right top;
  background-size: 40px;
}
</style>