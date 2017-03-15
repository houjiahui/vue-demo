import Vue from 'vue'
import Router from 'vue-router'
import Home from 'components/Home'
import Login from 'components/Login'
import eventManager from 'components/pages/eventManager'
import maskManager from 'components/pages/maskManager'
import galleryManager from 'components/pages/galleryManager'
import textureManager from 'components/pages/textureManager'
import categoryManager from 'components/pages/categoryManager'
import cfdOrderManager from 'components/pages/cfdOrderManager'
import userManager from 'components/pages/userManager'
import resourceManager from 'components/pages/resourceManager'
import roleManager from 'components/pages/roleManager'

import axios from 'axios'
import store from '../store'

Vue.use(Router);

function checkLogin(to,from,next){
  axios.get(process.env.API_SERVER + '/api/graph/mask/0')
    .then(function(res){
      next();
    })
    .catch(function(err){
      localStorage.setItem('isLogin',false);
      localStorage.removeItem('loginUser');
      next('/Login');
    });
}

var router = new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      beforeEnter:checkLogin,
      children:[
        {
          path:'/eventManager',
          name:'eventManager',
          component:eventManager,
          meta:{
            title:'众筹活动管理'
          }
        },
        {
          path:'/maskManager',
          name:'maskManager',
          component:maskManager,
          meta:{
            title:'遮罩图管理'
          }
        },
        {
          path:'/galleryManager',
          name:'galleryManager',
          component:galleryManager,
          meta:{
            title:'图库管理'
          }
        },
        {
          path:'/textureManager',
          name:'textureManager',
          component:textureManager,
          meta:{
            title:'底纹管理'
          }
        },
        {
          path:'/categoryManager',
          name:'categoryManager',
          component:categoryManager,
          meta:{
            title:'品类管理'
          }
        },
        {
          path:'/cfdOrderManager',
          name:'cfdOrderManager',
          component:cfdOrderManager,
          meta:{
            title:'众筹订单管理'
          }
        },
        {
          path:'/userManager',
          name:'userManager',
          component:userManager,
          meta:{
            title:'用户管理'
          }
        },
        {
          path:'/resourceManager',
          name:'resourceManager',
          component:resourceManager,
          meta:{
            title:'资源管理'
          }
        },
        {
          path:'/roleManager',
          name:'roleManager',
          component:roleManager,
          meta:{
            title:'角色管理'
          }
        }
      ],
      meta:{
        title:'首页',
        requestAuth:true
      }
    },
    {
      path: '/Login',
      name: 'Login',
      component: Login,
      meta:{
        title:'登录'
      }
    }
  ]
});

router.beforeEach((to,from,next) => {
  store.commit('setLoadingState',true);
  if(to.meta.requestAuth){
    if(localStorage.getItem('isLogin') && localStorage.getItem('isLogin') == 'true'){
      document.title = to.meta.title;
      store.commit('setPage',to.name);
      next();
    }else{
      next('/Login')
    }
  }else{
    document.title = to.meta.title;
    store.commit('setPage',to.name);
    next();
  }
});

export default router;
