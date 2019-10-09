import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/index'; //引入store
// import axios from 'axios';
import ajax from '@/components/api/ajax';
import api from '@/components/api/index';
import config from '@/assets/js/config';
import utils from '@/assets/js/utils';
import * as filters from '@/assets/js/filters';
import VueResource from 'vue-resource'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
// import '../static/css/theme-green/index.css';       // 浅绿色主题
import './assets/css/icon.css';
import '@/assets/scss/iconfont.scss';
import './components/common/directives';
import "babel-polyfill";

Vue.config.productionTip = false
Vue.use(ElementUI, {
    size: 'medium'
});
Vue.use(VueResource)
// Vue.prototype.$axios = axios;
Vue.prototype.$ajax = ajax;
Vue.prototype.$api = api;
Vue.prototype.$config = config;
Vue.prototype.$utils = utils;


// 全局注册过滤器
Object.keys(filters).forEach((key) => {
	// console.log(filters[key]);
	Vue.filter(key, filters[key]);
});


//使用钩子函数对路由进行权限跳转
// router.beforeEach((to, from, next) => {
//     const role = localStorage.getItem('ms_username');
//     if (!role && to.path !== '/login') {
//         next('/login');
//     } else if (to.meta.permission) {
//         // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
//         role === 'admin' ? next() : next('/403');
//     } else {
//         // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
//         if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
//             Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
//                 confirmButtonText: '确定'
//             });
//         } else {
//             next();
//         }
//     }
// })


new Vue({
    router,
	store,
    render: h => h(App)
}).$mount('#app')