import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
//导入组件
//组件是view里的两个页面.写index的原因是:它会默认寻找Index
import login from '../views/login'
import home from '../views/home'
import article from '../views/home/article'
//因为beforeEach也是在router当中
//
import NProgress from 'nprogress'
import "nprogress/nprogress.css"
//准备路由规则
const routes = [{
    path: '/login',
    component: login
}, {
    path: '/home',
    component: home,
    //嵌套路由,只需要在对应的路径下面添加组件即可
    //这个地方是数组
    children: [{
        path: '/article',
        component: article
    }]
}]
//创建路由对象 
const router = new VueRouter({
    routes
})
router.beforeEach((to, from, next) => {
    // to and from are both route objects. must call `next`.
    //只要你去的不是登录页
    NProgress.start();
    if (to.path != '/login') {
        let res = window.sessionStorage.getItem('userInfo')
        if (res) {
            //成功以后执行的回调函数
            next()
        } else {
            Vue.prototype.$message.error('登录失败,请重新登录');
            next('/login') //放行到login页面
            return;
        }
    } else {
        next()
    }
})
router.afterEach((to, from) => {
    // to and from are both route objects.
    setTimeout(() => {
        NProgress.done()
    }, 1000);
    window.console.log('进来了')

})
export default router