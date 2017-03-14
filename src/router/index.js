import Vue from 'vue'
import Router from 'vue-router'
import Home from 'components/Home'
import Login from 'components/Login'

import axios from 'axios'

Vue.use(Router);

function checkLogin(to,from,next){
  axios.get(process.env.API_SERVER + '/api/graph/mask/0')
    .then(function(res){
      next();
    })
    .catch(function(err){
      localStorage.setItem('isLogin',false);
      next('/Login');
    });
}

let router = new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      beforeEnter:checkLogin,
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
    },
  ]
});

router.beforeEach((to,from,next) => {
  if(to.meta.requestAuth){
    if(localStorage.getItem('isLogin') && localStorage.getItem('isLogin') == 'true'){
      document.title = to.meta.title;
      next();
    }else{
      next('/Login')
    }
  }else{
    document.title = to.meta.title;
    next();
  }
});

export default router;
