import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
//导入组件
//组件是view里的两个页面.写index的原因是:它会默认寻找Index
import login from '../views/login'
import home from '../views/home'
//准备路由规则
const routes = [{
    path: '/login',
    component: login
}, {
    path: '/home',
    component: home
}]
//创建路由对象 
const router = new VueRouter({
    routes
})
export default router