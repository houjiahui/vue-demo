/**
 * Created by liuzhichao on 2017/3/13.
 */
import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex);

var state = {
    loginUser:'',
    loading:false,
    nowPage:''
};
const mutations = {  //数据变化
  setLoginUser:(state,arg) => {
    state.loginUser = arg.username;
    localStorage.setItem('loginUser',arg.username);
  },
  setLoadingState:(state,arg) => {
    state.loading = arg
  },
  setPage:(state,arg) => {
    state.nowPage = arg;
  }
};

const actions = {  //逻辑（ajax，判断...）
  checkLogin:({commit,dispatch}) => {
    return new Promise((resolve,reject) => {
      axios.get(process.env.API_SERVER + '/api/graph/mask/0')
        .then(function(res){
          resolve()
        })
        .catch(function(err){
          reject()
        });
    });

  }
};

const getters = {
  loginUser:(state) => state.loginUser!=''?state.loginUser:localStorage.getItem('loginUser'),
  loading:(state) => state.loading,
  nowPage:(state) => state.nowPage
};


export default new Vuex.Store({
  actions,
  mutations,
  state,
  getters
});
