import Vue from 'vue'
import Router from 'vue-router'
import Home from 'components/Home'
import Login from 'components/Login'
import dashboard from 'components/pages/dashboard'
import eventManager from 'components/pages/eventManager'
import maskManager from 'components/pages/maskManager'
import galleryManager from 'components/pages/galleryManager'
import textureManager from 'components/pages/textureManager'
import categoryManager from 'components/pages/categoryManager'
import cfdOrderManager from 'components/pages/cfdOrderManager'
import userManager from 'components/pages/userManager'
import resourceManager from 'components/pages/resourceManager'
import roleManager from 'components/pages/roleManager'

import store from '../store'

Vue.use(Router);

var router = new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      redirect:'/dashboard',
      children:[
        {
          path:'/dashboard',
          name:'dashboard',
          component:dashboard,
          meta:{
            title:'首页',
            requireAuth:true
          }
        },
        {
          path:'/eventManager',
          name:'eventManager',
          component:eventManager,
          meta:{
            title:'众筹活动管理',
            requireAuth:true
          }
        },
        {
          path:'/maskManager',
          name:'maskManager',
          component:maskManager,
          meta:{
            title:'遮罩图管理',
            requireAuth:true
          }
        },
        {
          path:'/galleryManager',
          name:'galleryManager',
          component:galleryManager,
          meta:{
            title:'图库管理',
            requireAuth:true
          }
        },
        {
          path:'/textureManager',
          name:'textureManager',
          component:textureManager,
          meta:{
            title:'底纹管理',
            requireAuth:true
          }
        },
        {
          path:'/categoryManager',
          name:'categoryManager',
          component:categoryManager,
          meta:{
            title:'品类管理',
            requireAuth:true
          }
        },
        {
          path:'/cfdOrderManager',
          name:'cfdOrderManager',
          component:cfdOrderManager,
          meta:{
            title:'众筹订单管理',
            requireAuth:true
          }
        },
        {
          path:'/userManager',
          name:'userManager',
          component:userManager,
          meta:{
            title:'用户管理',
            requireAuth:true
          }
        },
        {
          path:'/resourceManager',
          name:'resourceManager',
          component:resourceManager,
          meta:{
            title:'资源管理',
            requireAuth:true
          }
        },
        {
          path:'/roleManager',
          name:'roleManager',
          component:roleManager,
          meta:{
            title:'角色管理',
            requireAuth:true
          }
        }
      ],
      meta:{
        title:'首页',
        requireAuth:true
      }
    },
    {
      path: '/Login',
      name: 'Login',
      component: Login,
      meta:{
        title:'登录',
        requireAuth:false
      }
    }
  ]
});

router.beforeEach((to,from,next) => {
  store.commit('setLoadingState',true);
  if(to.meta.requireAuth){
    store.dispatch('checkLogin').then(function(){
      document.title = to.meta.title;
      store.commit('setPage',to.name);
      next()
    }).catch(function(){
      next('/Login')
    });
  }else{
    document.title = to.meta.title;
    store.commit('setPage',to.name);
    next();
  }
});

export default router;
