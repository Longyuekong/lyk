<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <el-radio-group v-model="menu" size="medium">
        <el-radio-button label="全部"></el-radio-button>
        <el-radio-button label="收藏"></el-radio-button>
      </el-radio-group>
      <el-upload
        class="upload-demo"
        style="float:right"
        action="https://jsonplaceholder.typicode.com/posts/"
        multiple
      >
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
    </div>
    <el-row :gutter="20">
      <el-col :span="4">
        <el-card :body-style="{ padding: '0px' }">
          <div style="height:160px;display:flex;align-item:center;justify-content:center">
            <img
              src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
              class="image"
              style="max-height:100%;max-height:100%"
            />
          </div>
          <div>
            <div class="bottom clearfix" style="display:flex;background-color:#F2F6FC ">
              <el-tooltip content="Top center" placement="top" style="flex:1">
                <el-button type="text" class="el-icon-star-off"></el-button>
              </el-tooltip>
              <el-tooltip content="Top center" placement="top" style="flex:1">
                <el-button type="text" class="el-icon-delete"></el-button>
              </el-tooltip>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 分页 -->
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="1"
      :page-size="100"
      layout="total, prev, pager, next"
      :total="1000"
    ></el-pagination>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      menu: "全部"
    };
  },
};
</script>

<style>
</style>