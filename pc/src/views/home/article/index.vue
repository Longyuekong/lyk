<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <el-form ref="form" :model="searchParams">
        <el-form-item label="状态">
          <el-radio-group v-model="searchParams.status">
            <el-radio label>全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 频道 -->
        <el-form-item label="频道">
          <mychannel></mychannel>
        </el-form-item>

        <el-form-item label="时间">
          <el-date-picker
            v-model="searchParams.date"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-button type="primary" size="small" @click="filterBtn">筛选</el-button>
      </el-form>
    </div>

    <p>
      共找到
      <b>{{total}}</b>条符合条件的内容
    </p>

    <el-table v-loading="loading" :data="tableData" style="width: 100%">
      <!-- 封面 -->
      <el-table-column prop="cover.images[0]" label="封面" width="150">
        <template slot-scope="scope">
          <img width="50" :src="scope.row.cover.images[0]" alt />
        </template>
      </el-table-column>
      <!-- 标题 -->
      <el-table-column prop="title" label="标题" width="180"></el-table-column>
      <!-- 状态 -->
      <el-table-column prop="status" label="状态" width="100">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.status | formatStatus }}</el-tag>
        </template>
      </el-table-column>
      <!-- 时间 -->
      <el-table-column prop="pubdate" label="发布时间" width="180"></el-table-column>
      <!-- 按钮 -->
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button type="primary" size="small">修改</el-button>
          <el-button type="danger" size="small" @click="delData(scope.row)">删除</el-button>
          <!-- scope.row是每一行的总数据,所以点击可以全删 -->
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      :disabled="loading"
      @current-change="handleCurrentChange"
      :current-page="1"
      :page-size="10"
      layout="total, prev, pager, next"
      :total="total"
    ></el-pagination>
  </el-card>
</template>

<script>
import mychannel from "../../../components/mychannel/index";
export default {
  name: "myariticle",
  components: {
    mychannel
  },
  data() {
    return {
      //是否显示加载动画，默认为false
      loading: false,
      total: 0,
      searchParams: {
        status: "",
        channel_id: "",
        date: ""
      },
      //如果不是空数组,进来页面是没有Image这个属性的,所以会报错Image  undefined
      tableData: []
    };
  },

  methods: {
    // 封装的获取表格数据的方法
    loadTableData(page) {
      // 发请求之前让转圈圈
      this.loading = true;
      //若this.searchparams.status没有传值则默认为undefined,不传这个参数,有的话就传
      const status =
        this.searchParams.status === "" ? undefined : this.searchParams.status;
      const channel_id =
        this.searchParams.channel_id === ""
          ? undefined
          : this.searchParams.channel_id;
      this.$axios
        .get("/mp/v1_0/articles", {
          params: {
            status,
            channel_id,
            page: page,
            begin_pubdate: this.searchParams.date[0],
            end_pubdate: this.searchParams.date[1]
          }
        })
        .then(res => {
          // console.log(res);
          // 给表格数据源赋值
          this.tableData = res.data.data.results;
          // 赋值总条数
          this.total = res.data.data.total_count;

          // 数据回来了就不用转了
          this.loading = false;
        });
    },
    filterBtn() {
      this.loadTableData(1);
      //点击筛选
    },
    delData(row) {
      // 只要经过JSON-bigint转换后的id
      // 直接toString,就能到它真实的完整的id
      console.log(row.id);
      console.log(row.id.toString());
      this.$confirm("您确认删除吗", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      })
        // 如果确认删除就传入该文章的id
        .then(() => {
          this.$axios.delete(`/mp/v1_0/articles/${row.id}`).then(res => {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.loadTableData(1);
          });
        })
        .catch(() => {
          console.log(row.id);
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    handleCurrentChange(page) {
      this.loadTableData(page);
    }
  },

  created() {
    this.loadTableData(1);
  },

  filters: {
    formatStatus(val) {
      switch (val) {
        case 0:
          return "草稿";
        case 1:
          return "待审核";
        case 2:
          return "审核通过";
        case 3:
          return "审核失败";
        case 4:
          return "已删除";
      }
    }
  }
};
</script>

<style>
</style>