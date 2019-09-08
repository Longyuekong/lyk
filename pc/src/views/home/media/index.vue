<template>
  <el-card class="box-card" v-loading="isLoading">
    <div slot="header" class="clearfix">
      <el-radio-group v-model="menu" size="medium" @change="changeStatus">
        <el-radio-button label="全部"></el-radio-button>
        <el-radio-button label="收藏"></el-radio-button>
      </el-radio-group>
      <el-upload
        class="upload-demo"
        style="float:right"
        action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
        multiple
        name="image"
        :show-file-list="false"
        :headers="header"
      >
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
    </div>
    <el-row :gutter="20">
      <el-col :span="4" v-for="item in imgList" style="margin-bottom:15px">
        <el-card :body-style="{ padding: '0px' }">
          <div style="height:160px;display:flex;align-item:center;justify-content:center">
            <img :src="item.url" class="image" style="max-height:100%;max-height:100%" />
          </div>
          <div>
            <div class="bottom clearfix" style="display:flex;background-color:#F2F6FC; ">
              <el-tooltip
                :content="item.is_collected ?'取消收藏':'收藏'"
                placement="top"
                style="flex:1;font-size:15px"
              >
                <el-button
                  type="text"
                  @click="changeCollect(item)"
                  :class="item.is_collected ? 'el-icon-star-on':'el-icon-star-off'"
                ></el-button>
              </el-tooltip>
              <el-tooltip content="删除" placement="top" style="flex:1 ;font-size:15px">
                <el-button type="text" class="el-icon-delete" @click="delData(item)"></el-button>
              </el-tooltip>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 分页 -->
    <el-pagination
      background
      :on-success="uploadSuccess"
      @current-change="handleCurrentChange"
      :page-size="12"
      layout=" prev, pager, next"
      :total="total"
    ></el-pagination>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      menu: "全部",
      imgList: [],
      total: 0,
      isLoading: false,
      header: {
        Authorization: `Bearer ${
          JSON.parse(window.sessionStorage.getItem("userInfo")).token
        }`
      }
    };
  },
  methods: {
    uploadSuccess(response) {
      alert("11221");
      this.getData();
    },
    //page=1为默认第一页发送
    getData(page = 1) {
      this.isLoading = true;
      this.$axios
        .get(`/mp/v1_0/user/images`, {
          params: {
            page: page,
            per_page: 12,
            collect: this.menu === "收藏"
            //为收藏的时候就是true,确认收藏
          }
        })
        .then(res => {
          // console.log(res);
          this.isLoading = false;
          this.imgList = res.data.data.results;
          this.total = res.data.data.total_count;
        });
    },
    // 改变状态
    changeStatus() {
      this.getData();
    },
    //页码改变事件
    handleCurrentChange(page) {
      //传入当前页,并且发送请求
      this.getData(page);
    },
    //给收藏点击item是整个对象,然后将里面的iscollected取反
    changeCollect(item) {
      //1.先取反,如果是收藏就取消收藏
      item.is_collected = !item.is_collected;
      //2.然后发送请求
      this.$axios
        .put(`/mp/v1_0/user/images/${item.id}`, {
          collect: item.is_collected
        })
        .then(res => {})
        .catch(err => {
          item.is_collected = !item.is_collected;
          alert("失败了");
        });
    },
    //给删除注册点击事件
    delData(item) {
      this.$confirm("您确认要删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios.delete(`/mp/v1_0/user/images/${item.id}`).then(res => {
            this.getData();
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  },
  created() {
    this.getData();
  }
};
</script>

<style>
</style>