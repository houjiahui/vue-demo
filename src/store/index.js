/**
 * Created by liuzhichao on 2017/3/13.
 */
import Vue from 'vue'
import Vuex from 'vuex'
import Router from '../router'
import axios from 'axios'
axios.defaults.withCredentials = true;

Vue.use(Vuex);

const state = {
  CODE_REQUEST_UNAUTHORIZED:403,
  
  API_SERVER:'http://120.26.51.19:8110',
  API_PATH:'/orimuse-admin',
  
  CACHE_API_APP:'https://api.orimuse.com',
  CACHE_PATH_APP:'/api/cache/event',
  
  CACHE_API_WEB:'http://www.orimuse.com',
  CACHE_PATH_WEB:'/api/cache',
  
  WEBSITE_DOMAIN:'http://www.orimuse.com',
  
  loginUser:'',
  loading:false,
  nowPage:'',
  requestList:{},
  requestCache:{}
};
const mutations = {  //数据变化
  setLoginUser:(state,payload) => {
    state.loginUser = payload.username;
    localStorage.setItem('loginUser',payload.username);
  },
  setLoadingState:(state,payload) => {
    state.loading = payload
  },
  setPage:(state,payload) => {
    state.nowPage = payload;
  },
  setRequestLock:(state,payload) => {
    state.requestList[payload] = true;
  },
  setRequestUnlock:(state,payload) => {
    delete state.requestList[payload];
  },
  setRequestCache:(state,payload) => {
    state.requestCache = {};
    state.requestCache.tag = payload.tag;
    state.requestCache.type = payload.type;
    state.requestCache.url = payload.url;
    state.requestCache.data = payload.data;
  }
};

const actions = {  //逻辑（ajax，判断...）
  omNetwork:({commit,dispatch},payload) => {
    let tag = payload.tag;
    let url = payload.url;
    let type = payload.type;
    let data = payload.data;
    return new Promise((resolve,reject) => {
      Promise.all([dispatch('checkRequestLock',tag),dispatch('sendRequest',{url:url,type:type,data:data})])
        .then((res) => {
          console.log(Router.currentRoute);
          commit('setRequestUnlock',tag);
          resolve(res[1]);
        })
        .catch((err) => {
          commit('setRequestUnlock',tag);
          if(err.msg){
            reject(err);
          }else{
            if(err.response.status === state.CODE_REQUEST_UNAUTHORIZED){
              commit('setRequestCache',{tag:tag,type:type,url:url,data:data});
              Router.replace({name:'Login'});
            }
            reject(err.response);
          }
        });
    });
  },
  checkRequestLock:({commit,dispatch},payload) => {
    return new Promise((resolve,reject) => {
      if(!state.requestList[payload]){
        commit('setRequestLock',payload);
        resolve();
      }else{
        reject({msg:'不能重复请求'});
      }
    });
  },
  sendRequest:({commit,dispatch},payload) => {
    payload.type = payload.type.toLowerCase();
    switch (payload.type){
      case 'get':
      case 'put':
      case 'patch':
      case 'delete':
      case 'post':
        return new Promise((resolve,reject) => {
          axios({
            method:payload.type,
            url:payload.url,
            data:payload.data
          }).then((res) => {
            resolve(res);
          }).catch((err) => {
            reject(err);
          });
        });
        break;
      case 'postmultipart':
        let formData = new FormData();
        for(let key in payload.data){
          formData.append(key,payload.data[key])
        }
        return new Promise((resolve,reject) => {
          axios({
            method:'post',
            url:payload.url,
            data:formData,
            headers: {'content-type': 'multipart/form-data'}
          }).then((res) => {
            resolve(res);
          }).catch((err) => {
            reject(err)
          });
        });
        break;
    }
  }
};

const getters = {
  API_SERVER:(state) => state.API_SERVER + state.API_PATH,
  CACHE_API_APP:(state) => state.CACHE_API_APP + state.CACHE_PATH_APP,
  CACHE_API_WEB:(state) => state.CACHE_API_WEB + state.CACHE_PATH_WEB,
  WEBSITE_DOMAIN:(state) => state.WEBSITE_DOMAIN,
  loginUser:(state) => state.loginUser!=''?state.loginUser:localStorage.getItem('loginUser'),
  loading:(state) => state.loading,
  nowPage:(state) => state.nowPage,
  requestCache:(state) => state.requestCache
};


export default new Vuex.Store({
  actions,
  mutations,
  state,
  getters
});
