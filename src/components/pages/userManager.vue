<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="h1">用户列表</div>
    <el-popover ref="addUser" placement="bottom-start" width="500" v-model="addUserPopover" @show="clearUserInfo" @hide="clearUserInfo">
      <div style="text-align: left; box-sizing: border-box;padding-right: 10px;">
        <el-form ref="addUserForm" :model="userInfo" label-width="80px">
          <el-form-item label="登录账户">
            <el-input v-model="userInfo.name"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="userInfo.password" type="password"></el-input>
          </el-form-item>
          <el-form-item label="别名">
            <el-input v-model="userInfo.description"></el-input>
          </el-form-item>
          <el-form-item label="电话">
            <el-input v-model="userInfo.mobile"></el-input>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="userInfo.email"></el-input>
          </el-form-item>
          <el-form-item label="角色">
            <el-select v-model="selectedRole" multiple placeholder="请选择所属角色" style="width: 100%">
              <el-option v-for="(role,index) in roleList.list" :label="role.description" :value="role.id" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div style="text-align: right; margin: 0">
          <el-button size="normal" type="text" @click="addUserPopover = false">取消</el-button>
          <el-button type="danger" size="normal" @click="submitUserData('add')">添加用户</el-button>
        </div>
      </div>
    </el-popover>
    <el-button type="primary" size="large" v-popover:addUser>添加用户</el-button>
    <div class="table">
      <el-table :data="userList.list | sortBy('id')" border stripe style="width: 100%">
        <el-table-column prop="id" label="id" align="center" width="100"></el-table-column>
        <el-table-column prop="name" label="登录账户" align="center" width="300"></el-table-column>
        <el-table-column prop="description" label="用户别名" align="center" width="250"></el-table-column>
        <el-table-column prop="mobile" label="电话" align="center" width="200"></el-table-column>
        <el-table-column prop="email" label="邮箱" align="center" width="300"></el-table-column>
        <el-table-column label="所属角色" align="left" header-align="center" min-width="280">
          <template scope="scope">
            <el-button type="primary" v-for="(role,index) in scope.row.role" :key="index" size="small">
              {{role.description}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template scope="scope">
            <el-popover ref="editUser" placement="left-start" width="500" v-model="editPopover[scope.row.id]" @show="editUser(scope.row)">
              <div style="text-align: left; box-sizing: border-box;padding-right: 10px;">
                <el-form ref="addUserForm" :model="userInfo" label-width="80px">
                  <el-form-item label="登录账户">
                    <el-input v-model="userInfo.name"></el-input>
                  </el-form-item>
                  <el-form-item label="密码">
                    <el-input v-model="userInfo.password" type="password"></el-input>
                  </el-form-item>
                  <el-form-item label="别名">
                    <el-input v-model="userInfo.description"></el-input>
                  </el-form-item>
                  <el-form-item label="电话">
                    <el-input v-model="userInfo.mobile"></el-input>
                  </el-form-item>
                  <el-form-item label="邮箱">
                    <el-input v-model="userInfo.email"></el-input>
                  </el-form-item>
                  <el-form-item label="角色">
                    <el-select v-model="selectedRole" multiple placeholder="请选择所属角色" style="width: 100%">
                      <el-option v-for="(role,index) in roleList.list" :label="role.description" :value="role.id" :key="index"></el-option>
                    </el-select>
                  </el-form-item>
                </el-form>
                <div style="text-align: right; margin: 0">
                  <el-button size="normal" type="text" @click="hideEditPopover(scope.row.id)">取消</el-button>
                  <el-button type="danger" size="normal" @click="submitUserData('edit',scope.row.id)">保存修改</el-button>
                </div>
              </div>
            </el-popover>
            <el-button type="text" v-popover:editUser>编辑</el-button>

            <el-popover ref="deleteUser" placement="left" width="200" v-model="deletePopover[scope.row.id]">
              <p>确定要删除用户"{{scope.row.description}}"吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="hideDeletePopover(scope.row.id)">取消</el-button>
                <el-button type="danger" size="mini" @click="deleteUser(scope.row.id)">删除</el-button>
              </div>
            </el-popover>
            <el-button type="text" v-popover:deleteUser >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
  import {mapMutations,mapActions} from 'vuex'
  export default{
      name:'userManager',
      data(){
      	return{
      		userList:[],
          userInfo:{
      			name:'',
            description:'',
            password:'',
            avatar:'',
            mobile:'',
            email:'',
            role:[]
          },
          roleList:{},
          selectedRole:[],
          addUserPopover:false,
          editPopover:{},
          deletePopover:{}
        }
      },
      methods:{
      	showDeletePopover(id){
          this.$set(this.deletePopover,id,true);
        },
        hideDeletePopover(id){
          this.$set(this.deletePopover,id,false);
        },
        showEditPopover(id){
          this.$set(this.editPopover,id,true);
        },
        hideEditPopover(id){
          this.$set(this.editPopover,id,false);
        },
        getRoleList(){
        	var _this = this;
        	return new Promise((resolve, reject) => {
        		_this.omNetwork({
              tag:'getRoleList',
              type:'get',
              url:process.env.API_SERVER + '/api/admin/role',
            })
              .then((res) => {
        			  resolve(res);
              })
              .catch((err) => {
        			  reject({err:'获取角色列表失败'})
              });
          });
        },
        getUserList(){
        	var _this = this;
        	return new Promise((resolve,reject) => {
            _this.omNetwork({
              tag:'getUserList',
              type:'get',
              url:process.env.API_SERVER + '/api/admin/user'
            })
              .then((res) => {
            	  resolve(res);
              })
              .catch((err) => {
            	  reject({err:'获取用户列表失败'})
              })
          });
        },
        refreshList(){
        	let _this = this;
          _this.deletePopover = [];
          _this.editPopover = [];
          for(let i = 0 ; i < _this.userList.list.length ; i++){
            this.$set(_this.deletePopover,_this.userList.list[i].id,false);
            this.$set(_this.editPopover,_this.userList.list[i].id,false);
          }
        },
        clearUserInfo(){
          this.userInfo = {
            name:'',
            description:'',
            password:'',
            avatar:'',
            mobile:'',
            email:'',
            role:[]
          };
          this.selectedRole = [];
        },
        editUser(user){
        	var _this = this;
          _this.userInfo = user;
          _this.userInfo.password = '';
          _this.selectedRole.splice(0);
          for(let i = 0 ; i < user.role.length ; i++){
            _this.selectedRole.push(user.role[i].id);
          }
        },
        submitUserData(type,uid){
        	let _this = this;
          if(_this.userInfo.name == '' || _this.userInfo.name.length == 0){
            _this.$notify({
              title:'错误',
              message:'请输入用户名',
              type:'error'
            });
            return false;
          }
          if(_this.userInfo.password == '' || _this.userInfo.password.length == 0){
            _this.$notify({
              title:'错误',
              message:'请输入密码',
              type:'error'
            });
            return false;
          }
          if(_this.selectedRole.length == 0){
            _this.$notify({
              title:'错误',
              message:'请为用户选择角色',
              type:'error'
            });
            return false;
          }
        	let submitData = {};
        	submitData.name = _this.userInfo.name;
        	submitData.description = _this.userInfo.description;
        	submitData.password = _this.userInfo.password;
        	submitData.mobile = _this.userInfo.mobile;
        	submitData.email = _this.userInfo.email;
        	submitData.roles = _this.selectedRole;
        	submitData.avatar = '';
        	if(type == 'add'){
            _this.omNetwork({
                tag:'submitUserData',
                type:'post',
                url:process.env.API_SERVER + '/api/admin/user/?userJSON=' + JSON.stringify(submitData),
                data:{}
              })
              .then((res) => {
                _this.getUserList()
                  .then((res) => {
                    _this.userList = res.data.result;
                    _this.refreshList();
                    _this.addUserPopover = false;
                    _this.$notify({
                      title:'操作已完成',
                      message:'用户' + submitData.name + '已经添加。',
                      type:'success'
                    });
                  })
                  .catch((err) => {
                    _this.addUserPopover = false;
                    _this.$notify({
                      title:'发生错误',
                      message:err.err,
                      type:'error'
                    });
                  })
              })
              .catch((err) => {
                _this.addUserPopover = false;
                _this.$notify({
                  title:'发生错误',
                  message:err,
                  type:'error'
                });
              });
          }else{
        		submitData.method='update';
            _this.omNetwork({
                tag:'submitUserData',
                type:'patch',
                url:process.env.API_SERVER + '/api/admin/user/'+ uid +'?userJSON=' + JSON.stringify(submitData),
                data:{}
              })
              .then((res) => {
                _this.getUserList()
                  .then((res) => {
                    _this.userList = res.data.result;
                    _this.refreshList();
                    _this.hideEditPopover(uid);
                    _this.$notify({
                      title:'操作已完成',
                      message:'用户被修改。',
                      type:'success'
                    });
                  })
                  .catch((err) => {
                    _this.hideEditPopover(uid);
                    _this.$notify({
                      title:'发生错误',
                      message:err.err,
                      type:'error'
                    });
                  })
              })
              .catch((err) => {
                _this.hideEditPopover(uid);
                _this.$notify({
                  title:'发生错误',
                  message:err,
                  type:'error'
                });
              });
          }

        },
        deleteUser(userId){
        	let _this = this;
        	_this.omNetwork({
            tag:'deleteUser',
            type:'delete',
            url:process.env.API_SERVER + '/api/admin/user/' + userId,
            data:{}
          }).then((res) => {
              _this.getUserList()
                .then((res) => {
                  _this.userList = res.data.result;
                  _this.refreshList();
                  _this.$notify({
                    title:'操作已完成',
                    message:'用户已被删除。',
                    type:'success'
                  });
                })
                .catch((err) => {
                  _this.$notify({
                    title:'发生错误',
                    message:err.err,
                    type:'error'
                  });
                })
            })
            .catch((err) => {
              _this.$notify({
                title:'发生错误',
                message:err,
                type:'error'
              });
            });
        },
        ...mapMutations(['setLoadingState']),
        ...mapActions(['omNetwork'])
      },
      mounted(){
          var _this = this;
          Promise.all([_this.getRoleList(),_this.getUserList()])
            .then((res) => {
          	  _this.roleList = res[0].data.result;
          	  _this.userList = res[1].data.result;
              _this.setLoadingState(false);
              _this.refreshList();
            })
            .catch((err) => {
              _this.$notify({
                title:'发生错误',
                message:err.err,
                type:'error'
              });
            });
      }
  }
</script>
