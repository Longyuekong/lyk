import Vue from 'vue'
import App from './App.vue'
Vue.config.productionTip = false

//默认导入index.js
import router from './router'


//默认导入全局的基础样式 *CSS文件直接导入即可
import './assets/css/base.css'


//导入全局的饿了么ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI)
//因为访问的都是同一个服务器,所以我们可以设置基地址,简化代码


import axios from "axios";
axios.defaults.baseURL = `http://ttapi.research.itcast.cn`;
Vue.prototype.$axios = axios;
//axios赋给原型
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  const user = JSON.parse(window.sessionStorage.getItem('userInfo'))

  // 有值才添加token
  if (user)
    config.headers.Authorization = `Bearer ${user.token}`
  // 在发送请求之前做些什么
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});


// 添加响应拦截器
axios.interceptors.response.use(function (response) { //状态码为200-400之间
  // 对响应数据做点什么
  // 正常响应调用这里
  // window.console.log('正确响应')
  return response;

}, function (error) {

  // 提示请先登录
  Vue.prototype.$message.error('请先登录')

  // 打回登录页
  router.push('/login')

  // window.console.log('错误响应')
  // 对响应错误做点什么
  // 响应错误来到这里
  return Promise.reject(error);
});

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')