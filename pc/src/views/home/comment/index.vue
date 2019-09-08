<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="title" label="标题" ></el-table-column>
    <el-table-column prop="comment_status" label="评论状态">
        <template slot-scope="scope" scope>

        </template>
    </el-table-column>
    <el-table-column prop="total_comment_count" label="总评论数"></el-table-column>
    <el-table-column prop="fans_comment_count" label="粉丝评论"></el-table-column>
    <el-table-column label="允许评论"></el-table-column>
    <el-table-column  label="操作"></el-table-column>
  </el-table>
</template>

<script>
export default {
    name:'comment',
  data() {
    return {
      tableData: {
        title: "",
        comment_status: "",
        total_comment_count: "",
        fans_comment_count: ""
      }
    };
  },
  created() {
    //一进来就发送请求获取数据
    this.$axios
      .get("/mp/v1_0/articles", {
        params: {
          page: this.page,
          per_page: this.pageSize,
          response_type: "comment"
        }
      })
      .then(res => {
        console.log(res);
        this.tableData = res.data.data.results;
        this.total = res.data.data.total_count;

        // 请求回来后false
        this.isLoading = false;
      });
  }
};
</script>

<style>
</style>