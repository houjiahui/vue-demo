<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="h1">角色列表</div>
    <el-popover ref="addRole" placement="bottom-start" width="500" v-model="addRolePopover" @show="clearRoleInfo" @hide="clearRoleInfo">
      <div style="text-align: left; box-sizing: border-box;padding-right: 10px;">
        <el-form ref="addUserForm" :model="roleInfo" label-width="80px">
          <el-form-item label="角色名称">
            <el-input v-model="roleInfo.name"></el-input>
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="roleInfo.description"></el-input>
          </el-form-item>
          <el-form-item label="可读资源">
            <el-select v-model="readableResource" multiple placeholder="请添加该角色可读的资源" style="width: 100%">
              <el-option v-for="(role,index) in resourceList.list" :label="role.description" :value="role.id" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="可写资源">
            <el-select v-model="writeableResource" multiple placeholder="请添加该角色可写的资源" style="width: 100%">
              <el-option v-for="(role,index) in resourceList.list" :label="role.description" :value="role.id" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div style="text-align: right; margin: 0">
          <el-button size="normal" type="text" @click="addRolePopover = false">取消</el-button>
          <el-button type="danger" size="normal" @click="submitRoleData('add')">添加角色</el-button>
        </div>
      </div>
    </el-popover>
    <el-button type="primary" size="large" v-popover:addRole>添加角色</el-button>
    <div class="table">
      <el-table :data="roleList.list | sortBy('id')" border stripe style="width: 100%">
        <el-table-column prop="id" label="id" align="center" width="150"></el-table-column>
        <el-table-column prop="name" label="角色名称" align="center"></el-table-column>
        <el-table-column prop="description" label="描述" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="300">
          <template scope="scope">
            <el-popover ref="editRole" placement="left-start" width="500" v-model="editPopover[scope.row.id]" @show="editRole(scope.row)">
              <div style="text-align: left; box-sizing: border-box;padding-right: 10px;">
                <el-form ref="addUserForm" :model="roleInfo" label-width="80px">
                  <el-form-item label="角色名称">
                    <el-input v-model="roleInfo.name"></el-input>
                  </el-form-item>
                  <el-form-item label="描述">
                    <el-input v-model="roleInfo.description"></el-input>
                  </el-form-item>
                  <el-form-item label="可读资源">
                    <el-select v-model="readableResource" multiple placeholder="请添加该角色可读的资源" style="width: 100%">
                      <el-option v-for="(role,index) in resourceList.list" :label="role.description" :value="role.id" :key="index"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="可写资源">
                    <el-select v-model="writeableResource" multiple placeholder="请添加该角色可写的资源" style="width: 100%">
                      <el-option v-for="(role,index) in resourceList.list" :label="role.description" :value="role.id" :key="index"></el-option>
                    </el-select>
                  </el-form-item>
                </el-form>
                <div style="text-align: right; margin: 0">
                  <el-button size="normal" type="text" @click="hideEditPopover(scope.row.id)">取消</el-button>
                  <el-button type="danger" size="normal" @click="submitRoleData('edit',scope.row.id)">添加角色</el-button>
                </div>
              </div>
            </el-popover>
            <el-button type="text" v-popover:editRole>编辑</el-button>
            <el-popover ref="deleteRole" placement="left" width="200" v-model="deletePopover[scope.row.id]">
              <p>确定要删除角色"{{scope.row.description}}"吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="hideDeletePopover(scope.row.id)">取消</el-button>
                <el-button type="danger" size="mini" @click="deleteRole(scope.row.id)">删除</el-button>
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
  import {mapMutations,mapActions,mapGetters} from 'vuex'
  export default{
      name:'roleManager',
      data(){
      	return{
      		roleList:[],
          resourceList:[],
          addRolePopover:false,
          editPopover:[],
          deletePopover:[],
          roleInfo:{
      			name:'',
            description:'',
          },
          readableResource:[],
          writeableResource:[]
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
      	clearRoleInfo(){
          this.roleInfo = {
            name:'',
            description:'',
          };
          this.readableResource = [];
          this.writeableResource = [];
        },
        editRole(role){
      		let _this = this;
          _this.clearRoleInfo();
      		_this.roleInfo.name = role.name;
      		_this.roleInfo.description = role.description;
      		role.adminAuthorities.forEach((v) => {
      			if(v.read){
      				_this.readableResource.push(v.resource.id);
            }
            if(v.write){
      				_this.writeableResource.push(v.resource.id);
            }
          })
        },
      	submitRoleData(type,rid){
        	let _this = this;
          if(_this.roleInfo.name.length == 0 || _this.roleInfo.name == ''){
            _this.$notify({
              title:'错误',
              message:'请输入角色名',
              type:'error'
            });
            return false;
          }
          let authorities = {};
          let submitData = {
          	role:_this.roleInfo.name,
            description:_this.roleInfo.description,
            authority:[]
          };
          this.readableResource.forEach((v) => {
          	authorities[v] = {
          		id:v,
          		read:1,
              write:0
            }
          });
          this.writeableResource.forEach((v) => {
            if(authorities[v]){
            	authorities[v].write=1
            }else{
            	authorities[v] = {
            		id:v,
            		read:0,
                write:1
              }
            }
          });
          for(let k in authorities){
          	submitData.authority.push(authorities[k])
          }
          if(type=='add'){
            _this.omNetwork({
                tag:'addRole',
                type:'post',
                url:_this.API_SERVER + '/api/admin/role/',
                data:submitData
              })
              .then((res) => {
                _this.getRoleList()
                  .then((res) => {
                    _this.roleList = res.data.result;
                    _this.addRolePopover = false;
                    _this.refreshList();
                    _this.$notify({
                      title:'操作已完成',
                      message:'角色' + submitData.role + '已经添加。',
                      type:'success'
                    });
                  })
                  .catch((err) => {
                    _this.addRolePopover = false;
                    _this.$notify({
                      title:'发生错误',
                      message:err,
                      type:'error'
                    });
                  })
              })
              .catch((err) => {
                _this.addRolePopover = false;
                _this.$notify({
                  title:'发生错误',
                  message:err,
                  type:'error'
                });
              })
          }else{
            _this.omNetwork({
                tag:'editRole',
                type:'patch',
                url:_this.API_SERVER + '/api/admin/role/' + rid,
                data:submitData
              })
              .then((res) => {
                _this.getRoleList()
                  .then((res) => {
                    _this.roleList = res.data.result;
                    _this.refreshList();
                    _this.hideEditPopover(rid);
                    _this.$notify({
                      title:'操作已完成',
                      message:'角色' + submitData.role + '已被修改。',
                      type:'success'
                    });
                  })
                  .catch((err) => {
                    _this.addRolePopover = false;
                    _this.$notify({
                      title:'发生错误',
                      message:err,
                      type:'error'
                    });
                  })
              })
              .catch((err) => {
                _this.addRolePopover = false;
                _this.$notify({
                  title:'发生错误',
                  message:err,
                  type:'error'
                });
              })
          }
        },
      	getRoleList(){
      		let _this = this;
      		return new Promise((resolve,reject) => {
      			_this.omNetwork({
              tag:'getRoleList',
              type:'get',
              url:_this.API_SERVER + '/api/admin/role',
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
              url:_this.API_SERVER + '/api/admin/resource',
              data:{}
            }).then((res) => {
                resolve(res)
              })
              .catch((err) => {
                reject({err:'获取资源列表失败'})
              });
          });
        },
        refreshList(){
        	let _this = this;
          _this.deletePopover = [];
          _this.editPopover = [];
          for(let i = 0 ; i < _this.roleList.list.length ; i++){
            this.$set(_this.deletePopover,_this.roleList.list[i].id,false);
            this.$set(_this.editPopover,_this.roleList.list[i].id,false);
          }
        },
        deleteRole(roleId){
          let _this = this;
          _this.omNetwork({
            tag:'deleteRole',
            type:'delete',
            url:_this.API_SERVER + '/api/admin/role/' + roleId,
            data:{}
          }).then((res) => {
              _this.getRoleList()
                .then((res) => {
                  _this.roleList = res.data.result;
                  _this.refreshList();
                  _this.$notify({
                    title:'操作已完成',
                    message:'角色已被删除。',
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
      computed:mapGetters(['API_SERVER']),
      mounted(){
          let _this = this;
          Promise.all([_this.getRoleList(),_this.getResourceList()])
            .then((res) => {
              _this.setLoadingState(false);
              _this.roleList = res[0].data.result;
              _this.resourceList = res[1].data.result;
              _this.refreshList();
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
