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
router.beforeEach((to, from, next) => {
    // to and from are both route objects. must call `next`.
    //只要你去的不是登录页
    if(to.path!='/login'){
        let res = window.sessionStorage.getItem('userInfo')
        if (res) {
            //成功以后执行的回调函数
            next()
        }else{
            Vue.prototype.$message.error('登录失败,请重新登录');
            next('/login') //放行到login页面
            return;
        }
        }else{
            next()
        }
})
export default router