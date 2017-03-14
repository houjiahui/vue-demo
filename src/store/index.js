/**
 * Created by liuzhichao on 2017/3/13.
 */
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

var state = {
    loginUser:''
};
const mutations = {  //数据变化
  setLoginUser:(state,arg) => {state.loginUser = arg.username},
};

const actions = {  //逻辑（ajax，判断...）

};

const getters = {
  loginUser:(state) => state.loginUser
};


export default new Vuex.Store({
  actions,
  mutations,
  state,
  getters
});
