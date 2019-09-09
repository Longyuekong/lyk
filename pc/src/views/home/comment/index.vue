<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="title" label="标题"></el-table-column>
    <el-table-column prop="comment_status" label="评论状态">
      <template slot-scope="scope">
        <el-tag
          :type="scope.row.comment_status?'success':'danger'"
          effect="dark"
        >{{ scope.row.comment_status ? "允许" : "禁止" }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="total_comment_count" label="总评论数"></el-table-column>
    <el-table-column prop="fans_comment_count" label="粉丝评论"></el-table-column>
    <el-table-column label="允许评论">
      <template slot-scope="scope">
        <el-switch
          v-model="scope.row.comment_status"
          active-color="#13ce66"
          inactive-color="#ff4949"
        ></el-switch>
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button type="primary" size="mini" @click="doDel(scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: "comment",
  data() {
    return {
      tableData: {
        id: "",
        title: "",
        comment_status: "",
        total_comment_count: "",
        fans_comment_count: ""
      }
    };
  },
  methods: {
    getData() {
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
    },
    doDel(row) {
      this.$confirm("您确认删除这条评论吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios.delete(`/mp/v1_0/comments/${row}`).then(res => {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.getData();
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