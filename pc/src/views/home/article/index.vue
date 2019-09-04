<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <el-form ref="form" :model="searchParams">
        <el-form-item label="状态">
          <el-radio-group v-model="searchParams.status">
            <el-radio :label="3">全部</el-radio>
            <el-radio :label="6">草稿</el-radio>
            <el-radio :label="7">待审核</el-radio>
            <el-radio :label="8">审核通过</el-radio>
            <el-radio :label="9">审核失败</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="频道">
          <el-select placeholder="请选择活动区域" v-model="searchParams.channel_id">
            <el-option label="所有频道" value></el-option>
            <el-option label="区域二" value="two"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="时间">
          <el-date-picker
            v-model="searchParams.date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
          <el-button type="primary" size="small">筛选</el-button>        
      </el-form>
    </div>

    <p>
      共找到
      <b>13</b>条符合条件的内容
    </p>

    <el-table v-loading="loading" :data="tableData" style="width: 100%">
      <el-table-column prop="cover.images[0]" label="封面" width="150">
        <template slot-scope="scope">
          <img width="50" :src="scope.row.cover.images[0]" alt />
        </template>
      </el-table-column>
      <el-table-column prop="title" label="标题" width="180"></el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.status | formatStatus }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="pubdate" label="发布时间" width="180"></el-table-column>

      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button type="primary" size="small">修改</el-button>
          <el-button type="danger" size="small">删除</el-button>
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
export default {
  name:'myariticle',
  data() {
    return {
      //是否显示加载动画，默认为false
      loading: false,
      total: 0,
      searchParams: {
        status: 3,
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

      this.$axios
        .get("/mp/v1_0/articles", {
          params: {
            page
          }
        })
        .then(res => {
          console.log(res);
          // 给表格数据源赋值
          this.tableData = res.data.data.results;
          // 赋值总条数
          this.total = res.data.data.total_count;

          // 数据回来了就不用转了
          this.loading = false;
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