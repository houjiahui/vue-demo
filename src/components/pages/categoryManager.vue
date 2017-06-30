<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>品类管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="h1">品类列表</div>
    <el-popover ref="addCategory" placement="bottom-start" width="500" v-model="addCategoryPopover" @show="clearCategoryInfo" @hide="clearCategoryInfo">
      <div style="text-align: left; box-sizing: border-box;padding-right: 10px;">
        <el-form ref="addUserForm" :model="categoryInfo" label-width="80px">
          <el-form-item label="品类名称">
            <el-input v-model="categoryInfo.name"></el-input>
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="categoryInfo.description"></el-input>
          </el-form-item>
        </el-form>
        <div style="text-align: right; margin: 0">
          <el-button size="normal" type="text" @click="addCategoryPopover = false">取消</el-button>
          <el-button type="danger" size="normal" @click="submitCategoryData('add')">添加品类</el-button>
        </div>
      </div>
    </el-popover>
    <el-button type="primary" size="large" v-popover:addCategory>添加品类</el-button>
    <div class="table">
      <el-table :data="categoryList | sortBy('id')" border stripe style="width: 100%">
        <el-table-column prop="id" label="id" align="center" width="200"></el-table-column>
        <el-table-column prop="name" label="名称" align="center" width=""></el-table-column>
        <el-table-column prop="description" label="描述" align="center" width=""></el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template scope="scope">
            <el-popover ref="editCategory" placement="left-start" width="500" v-model="editPopover[scope.row.id]" @show="editCategory(scope.row)">
              <div style="text-align: left; box-sizing: border-box;padding-right: 10px;">
                <el-form ref="addUserForm" :model="categoryInfo" label-width="80px">
                  <el-form-item label="角色名称">
                    <el-input v-model="categoryInfo.name"></el-input>
                  </el-form-item>
                  <el-form-item label="描述">
                    <el-input v-model="categoryInfo.description"></el-input>
                  </el-form-item>
                </el-form>
                <div style="text-align: right; margin: 0">
                  <el-button size="normal" type="text" @click="hideEditPopover(scope.row.id)">取消</el-button>
                  <el-button type="danger" size="normal" @click="submitCategoryData('edit',scope.row.id)">确认修改</el-button>
                </div>
              </div>
            </el-popover>
            <el-button type="text" v-popover:editCategory>编辑</el-button>
            <el-popover ref="deleteCategory" placement="left" width="200" v-model="deletePopover[scope.row.id]">
              <p>确定要删除品类"{{scope.row.name}}"吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="hideDeletePopover(scope.row.id)">取消</el-button>
                <el-button type="danger" size="mini" @click="deleteCategory(scope.row.id)">删除</el-button>
              </div>
            </el-popover>
            <el-button type="text" v-popover:deleteCategory>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
  import {mapMutations,mapActions,mapGetters} from 'vuex'
  export default{
      name:'categoryManager',
      data(){
      	return {
      		categoryList:[],
          addCategoryPopover:false,
          categoryInfo:{
      			name:'',
            description:''
          },
          editPopover:[],
          deletePopover:[]
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
        clearCategoryInfo(){
        	this.categoryInfo = {
            name:'',
            description:''
          }
        },
      	refreshList(data){
          let _this = this;
          _this.categoryList = data;
          _this.deletePopover = [];
          _this.editPopover = [];
          for(let i = 0 ; i < _this.categoryList.length ; i++){
            this.$set(_this.deletePopover,_this.categoryList[i].id,false);
            this.$set(_this.editPopover,_this.categoryList[i].id,false);
          }
        },
        editCategory(category){
          let _this = this;
          _this.clearCategoryInfo();
          _this.categoryInfo.name = category.name;
          _this.categoryInfo.description = category.description;
        },
        submitCategoryData(type,cid){
      		let _this = this;
      		if(_this.categoryInfo.name.length == 0 || _this.categoryInfo.name == ''){
            _this.$notify({
              title:'错误',
              message:'请输入品类名',
              type:'error'
            });
            return false;
          }
          let submitData = {
      			name:_this.categoryInfo.name,
            description:_this.categoryInfo.description
          };
          if(type == 'add'){
            _this.omNetwork({
              tag:'addCategory',
              type:'post',
              url:_this.API_SERVER + '/api/category',
              data:submitData
            }).then((res) => {
            	  _this.getCategoryList(1)
                  .then((res) => {
                    _this.refreshList(res.data.result);
                    _this.addCategoryPopover = false;
                    _this.$notify({
                      title:'添加成功',
                      message:'品类"' + submitData.name + '"已成功添加。',
                      type:'success'
                    });
                  }).catch((err) => {
                    _this.addCategoryPopover = false;
                    _this.$notify({
                      title:'发生错误',
                      message:err,
                      type:'error'
                    });
                  });
              })
              .catch((err) => {
                _this.addCategoryPopover = false;
                _this.$notify({
                  title:'发生错误',
                  message:err,
                  type:'error'
                });
              });
          }else{
            _this.omNetwork({
              tag:'editCategory',
              type:'put',
              url:_this.API_SERVER + '/api/category/' + cid,
              data:submitData
            }).then((res) => {
                _this.getCategoryList(1)
                  .then((res) => {
                    _this.refreshList(res.data.result);
                    _this.addCategoryPopover = false;
                    _this.$notify({
                      title:'修改成功',
                      message:'品类"' + submitData.name + '"已成功修改。',
                      type:'success'
                    });
                  }).catch((err) => {
                  _this.addCategoryPopover = false;
                  _this.$notify({
                    title:'发生错误',
                    message:err,
                    type:'error'
                  });
                });
              })
              .catch((err) => {
                _this.addCategoryPopover = false;
                _this.$notify({
                  title:'发生错误',
                  message:err,
                  type:'error'
                });
              });
          }
        },
        deleteCategory(categoryId){
          let _this = this;
          _this.omNetwork({
            tag:'deleteCategory',
            type:'delete',
            url:_this.API_SERVER + '/api/category/' + categoryId,
            data:{}
          }).then((res) => {
              _this.getCategoryList()
                .then((res) => {
                  _this.refreshList(res.data.result);
                  _this.$notify({
                    title:'操作已完成',
                    message:'品类已被删除。',
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
      	getCategoryList(pageNo){
      		let _this = this;
      		return new Promise((resolve,reject) => {
            _this.omNetwork({
              tag:'getCategoryList',
              type:'get',
              url:_this.API_SERVER + '/api/category?pageSize=20&pageNo=' + pageNo,
              data:{}
            }).then((res) => {
            	  resolve(res);
              })
              .catch((err) => {
            	  reject({err:'获取品类列表失败'});
              });
          });
        },
      	...mapMutations(['setLoadingState']),
        ...mapActions(['omNetwork'])
      },
      computed:mapGetters(['API_SERVER']),
      mounted(){
          var _this = this;
          _this.getCategoryList(1)
            .then((res) => {
          	  _this.refreshList(res.data.result);
              _this.setLoadingState(false)
            })
            .catch((err) => {
              _this.setLoadingState(false);
              _this.$notify({
                title:'错误',
                message:err.err,
                type:'error'
              });
            });

      }
  }
</script>
