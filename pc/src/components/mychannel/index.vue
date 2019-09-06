<template>
  <el-select placeholder="请选择频道" v-model="channel_id">
    <el-option label="所有频道" value></el-option>
    <el-option v-for="item in channelList" :key='item.id' :label="item.name" :value="item.id"></el-option>
  </el-select>
</template>

<script>
export default {
  name: "mychannel",
  data() {
    return {
      channelList: [],
      channel_id: ""
    };
  },

  created() {
    //  请求所有的频道
    this.$axios.get("/mp/v1_0/channels").then(res => {
      console.log(res);
      this.channelList = res.data.data.channels;
    });
  }
};
</script>

<style>
</style>