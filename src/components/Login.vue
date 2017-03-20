<template>
  <div id="Login">
    <div class="loginWarp">
        <div class="logo">
          <img src="http://static.orimuse.com/assets/images/header/logo.png" height="75">
        </div>
        <div class="loginForm">
          <div class="text">登录</div>
          <input type="text" placeholder="Username" v-model="username">
          <input type="password" placeholder="Password" v-model="password">
          <el-row :gutter="20">
            <el-col :span="6" :offset="1">
              <el-checkbox v-model="checked">记住用户名</el-checkbox>
            </el-col>
            <el-col :span="6" :offset="11">
              <el-button type="primary" size="large" @click="doLogin">登录</el-button>
            </el-col>
          </el-row>
        </div>
        <div class="copyright">
          2017 &copy; orimuse.
        </div>
    </div>
  </div>
</template>

<script>
  import {mapMutations} from 'vuex'
  export default{
    name:'Login',
    data(){
        return {
            username:'',
            password:'',
            checked:false
        }
    },
    methods:{
        doLogin(){
          let _this = this;
          if (_this.username == '' || _this.username.length == 0){
              _this.$notify({
                  title:'错误',
                  message:'请输入用户名。',
                  type:'error'
              });
              return;
          }
          if (_this.password == '' || _this.password.length == 0){
              _this.$notify({
                title:'错误',
                message:'请输入密码。',
                type:'error'
              });
              return;
          }
          if(_this.checked){
              localStorage.setItem('username',_this.username);
          }

          _this.$http.post(process.env.API_SERVER + '/api/login?username='+_this.username+'&password='+_this.password)
            .then(function(res){
                if(res.data.status == 200){
                  _this.$notify({
                    title:'登录成功',
                    message:res.data.result,
                    type:'success'
                  });
                  _this.setLoginUser({username:_this.username});
                  _this.$router.push('/')
                }else{
                  _this.$notify({
                    title:'登录失败',
                    message:res.data.result,
                    type:'error'
                  });
                }
            }).catch(function(err){
                console.log('err:',err);
            });
        },
        ...mapMutations(['setLoginUser'])
    },
    mounted(){
        if(localStorage.getItem('username')){
            this.username = localStorage.getItem('username');
            this.checked = true;
        }
    }
  }
</script>
<style scoped>
  #Login{
    position: absolute;
    width: 100%;
    height: 100%;
    background: #324057;
  }
  #Login .loginWarp{
    position: absolute;
    width: 450px;
    height: 600px;
    text-align: center;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
  }
  #Login .loginForm{
    width: 450px;
    height: 330px;
    background: #E5E9F2;
    border-radius: 10px;
    margin:30px 0;
    box-sizing: border-box;
    padding: 20px;
  }
  #Login .copyright{
    color: #8492A6;
  }
  #Login .text{
    font-size: 24px;
    color: #1D8CE0;
    margin: 10px 0 34px 0;
  }
  #Login input{
    display: block;
    -webkit-appearance: none;
    -moz-appearance: none;
    border:none;
    width: 100%;
    height: 45px;
    line-height: 45px;
    border-radius: 5px;
    margin-bottom: 24px;
    outline: none;
    font-size: 16px;
    box-sizing: border-box;
    padding: 0 20px;
    background: #D3DCE6;
    color: #475669;
  }
  #Login input::-webkit-input-placeholder{
    color: #8492A6;
  }
  #Login input:-moz-placeholder{
    color: #8492A6;
  }
  #Login input:last-of-type{
    margin-bottom: 40px;
  }
  #Login .el-row{
    line-height: 40px!important;
    vertical-align: middle!important;
  }
  #Login .el-checkbox{
    vertical-align: middle!important;
  }
  #Login .el-checkbox .el-checkbox__label{
    color: #475669!important;
  }
</style>
