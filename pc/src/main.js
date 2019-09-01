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


new Vue({
  render: h => h(App),
  router,
}).$mount('#app')