<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ name:'Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ name:'eventManager' }">活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>{{newEvent?'创建新活动':'编辑活动'}}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="h1">
      {{newEvent?'创建新活动':'编辑活动'}}
    </div>
    <el-form ref="form" :model="eventInfo" label-width="90px" style="width: 60%;margin: 30px auto">
        <el-row>
          <el-col :span="12">
            <el-form-item label="活动名称">
              <el-input placeholder="在此输入活动名称" v-model="eventInfo.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属品类">
              <el-select  placeholder="请选择品类" style="width: 100%" v-model="category">
                <el-option v-for="item in categoryList" :label="item.name" :value="item.id" :key="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="活动描述">
          <el-input placeholder="在此输入活动描述" v-model="eventInfo.description"></el-input>
        </el-form-item>
        <el-form-item label="活动备注">
          <el-input type="textarea" :rows="5" resize="none" placeholder="在此输入活动备注"  v-model="eventInfo.eventnote"></el-input>
        </el-form-item>
        <el-form-item label="活动时间">
          <el-date-picker type="datetimerange" placeholder="选择时间范围" v-model="timeScope">
          </el-date-picker>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="发起者ID">
              <el-input placeholder="在此输入活动发起者ID" v-model="ownerId"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="目标数量">
              <el-input placeholder="在此输入目标数量" v-model="eventInfo.goal"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="商品预览图">
          <dropzone id="imageUploader1" class="myStyle" url="localhost" :thumbnailHeight="150" :thumbnailWidth="150" :useFontAwesome="false" :useCustomDropzoneOptions="true" :dropzoneOptions="dzOptions" @vdropzone-file-added="addFileList1" @vdropzone-removed-file="removeFileList1"></dropzone>
        </el-form-item>
      <el-form-item label="商品描述图">
        <dropzone id="imageUploader2" class="myStyle" url="localhost" :thumbnailHeight="150" :thumbnailWidth="150" :useFontAwesome="false" :useCustomDropzoneOptions="true" :dropzoneOptions="dzOptions" @vdropzone-file-added="addFileList2" @vdropzone-removed-file="removeFileList2"></dropzone>
      </el-form-item>
        <el-form-item>
          <el-button type="primary" >立即创建</el-button>
          <el-button @click="goBack()">取消</el-button>
        </el-form-item>
      </el-form>
  </div>
</template>
<script>
  import {mapMutations,mapActions} from 'vuex'
  import Dropzone from 'vue2-dropzone'
  import jQuery from 'jquery'
  export default{
    name:'eventEditor',
    data(){
        return{
          eventInfo:{
            name:'',
            description:'',
            eventnote:'',
            goal:'',
          },
          ownerId:'',
          category:'',
          timeScope:[],
          categoryList:[],
          fileList1:{},
          fileList2:{},
          newEvent:false,
          dzOptions:{
            autoProcessQueue: false,
            addRemoveLinks:true
          }
        }
    },
    methods:{
    	goBack(){
    		this.$router.replace({name:'eventManager'})
      },
    	addFileList1(file){
    		this.fileList1[file.name] = file;
      },
      removeFileList1(file){
        delete this.fileList1[file.name];
      },
      addFileList2(file){
        this.fileList2[file.name] = file;
      },
      removeFileList2(file){
        delete this.fileList2[file.name];
      },
      getCategoryList(){
          let _this = this;
          return new Promise((resolve,reject) => {
          	_this.omNetwork({
              tag:'getCategoryList',
              type:'get',
              url:process.env.API_SERVER + '/api/category',
              data:{}
            }).then((res) => {
                _this.categoryList = res.data.result;
                resolve(res);
              })
              .catch((err) => {
                _this.$notify({
                  title:'获取分类信息失败',
                  message:'请检查网络或确认是否拥有该权限',
                  type:'error'
                });
                reject(err);
              });
          });
      },
      getEventInfo(eventId){
          let _this = this;
          return new Promise((resolve,reject) => {
            _this.omNetwork({
              tag:'getEventInfo',
              type:'get',
              url:process.env.API_SERVER + '/api/event?eventKey=' + eventId,
              data:{}
            }).then((res) => {
                _this.eventInfo = res.data.result;
                resolve(res);
              })
              .catch((err) => {
                _this.$notify({
                  title:'获取活动信息失败',
                  message:'请检查网络或确认是否拥有该权限',
                  type:'error'
                });
                reject(err);
              });
          });
      },
      ...mapMutations(['setLoadingState']),
      ...mapActions(['omNetwork'])
    },
    mounted(){
      let _this = this;
      let eventId = _this.$route.params.id;
      if(eventId){
        _this.newEvent = false;
        Promise.all([_this.getCategoryList(),_this.getEventInfo(eventId)])
          .then((res) => {
            _this.setLoadingState(false)
          })
          .catch((res) => {
            _this.setLoadingState(false);
          });
      }else{
        _this.$nextTick(function () {
          _this.getCategoryList()
            .then((res) => {
              _this.newEvent = true;
              _this.setLoadingState(false);
            })
            .catch();
        });
      }
    },
    components:{
    	Dropzone
    }
  }
</script>
<style scoped>
  .form{
    width: 50%;
  }
</style>
