<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="h1">角色列表</div>
    <el-popover ref="addUser" placement="bottom-start" width="500" v-model="addRolePopover">
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
    <el-button type="primary" size="large">添加角色</el-button>
    <div class="table">
      <el-table :data="roleList.list | sortBy('id')" border stripe style="width: 100%">
        <el-table-column prop="id" label="id" align="center" width="150"></el-table-column>
        <el-table-column prop="name" label="角色名称" align="center"></el-table-column>
        <el-table-column prop="description" label="描述" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="300">
          <template scope="scope">
            <el-button type="text">编辑</el-button>
            <el-popover ref="deleteRole" placement="left" width="200" v-model="deletePopover[scope.row.id]">
              <p>确定要删除角色"{{scope.row.description}}"吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="hideDeletePopover(scope.row.id)">取消</el-button>
                <el-button type="danger" size="mini" @click="deleteUser(scope.row.id)">删除</el-button>
              </div>
            </el-popover>
            <el-button type="text" v-popover:deleteRole>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
  import {mapMutations,mapActions} from 'vuex'
  export default{
      name:'roleManager',
      data(){
      	return{
      		roleList:[],
          resourceList:[],
          addRolePopover:false,
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
      		let _this = this;
      		return new Promise((resolve,reject) => {
      			_this.omNetwork({
              tag:'getRoleList',
              type:'get',
              url:process.env.API_SERVER + '/api/admin/role',
              data:{}
            }).then((res) => {
      				  resolve(res)
              })
              .catch((err) => {
      				  reject({err:'获取角色列表失败'})
              });
          });
        },
        getResourceList(){
      		let _this = this;
          return new Promise((resolve,reject) => {
            _this.omNetwork({
              tag:'getResourceList',
              type:'get',
              url:process.env.API_SERVER + '/api/admin/resource',
              data:{}
            }).then((res) => {
                resolve(res)
              })
              .catch((err) => {
                reject({err:'获取资源列表失败'})
              });
          });
        },
        ...mapMutations(['setLoadingState']),
        ...mapActions(['omNetwork'])
      },
      mounted(){
          let _this = this;
          Promise.all([_this.getRoleList(),_this.getResourceList()])
            .then((res) => {
              _this.setLoadingState(false);
              _this.roleList = res[0].data.result;
              _this.resourceList = res[1].data.result;
              for(let i = 0 ; i < _this.roleList.list.length ; i++){
                this.$set(_this.deletePopover,_this.roleList.list[i].id,false);
                this.$set(_this.editPopover,_this.roleList.list[i].id,false);
              }
            })
            .catch((err) => {
              _this.setLoadingState(false);
              _this.$notify({
                title:'发生错误',
                message:err.err,
                type:'error'
              });
            });
      }
  }
</script>
