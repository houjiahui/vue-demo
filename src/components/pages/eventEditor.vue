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
              <el-select  placeholder="请选择品类" style="width: 100%" v-model="category" :disabled="!newEvent">
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
        <el-row>
          <el-col :span="12">
            <el-form-item label="活动类型">
              <el-select  placeholder="请选择活动类型" style="width: 100%" v-model="type" :disabled="!newEvent">
                <el-option v-for="item in EVENT_TYPE_MAP" :label="item.name" :value="item.id" :key="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发起者ID">
              <el-input placeholder="在此输入活动发起者ID" v-model="ownerId" :disabled="!newEvent"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-show="type == 1">
          <el-col :span="12">
            <el-form-item label="活动时间">
              <el-date-picker type="datetimerange" placeholder="选择时间范围" v-model="timeScope" style="width: 100%"></el-date-picker>
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
          <el-button type="primary" @click="submitEvent()">{{newEvent?'立即创建':'保存修改'}}</el-button>
          <el-button @click="goBack()">取消</el-button>
        </el-form-item>
      </el-form>
  </div>
</template>
<script>
  import {mapMutations,mapActions,mapGetters} from 'vuex'
  import Dropzone from 'vue2-dropzone'
  import jQuery from 'jquery'
  export default{
    name:'eventEditor',
    data(){
        return{
        	EVENT_TYPE_MAP:[
            {id:1,name:'众筹'},
            {id:2,name:'自营'}
          ],
          eventInfo:{
            name:'',
            description:'',
            eventnote:'',
            goal:'',
          },
          type:'',
          ownerId:'',
          category:'',
          timeScope:[],
          categoryList:[],
          fileList1:{},
          fileList2:{},
          newEvent:false,
          dzOptions:{
            autoProcessQueue: false,
            addRemoveLinks: true
          }
        }
    },
    methods:{
    	goBack(){
    		this.$router.replace({name:'eventManager'})
      },
    	addFileList1(file){
    		let _this = this;
    		_this.fileList1[file.name] = file;
    		//limit files number
        (function(){
        	let count = 0;
        	if(Object.keys(_this.fileList1).length > 4){
        		for(let key in _this.fileList1){
        			count ++;
        			if(count > 4){
        				jQuery(_this.fileList1[key].previewElement).remove();
        				_this.removeFileList1(_this.fileList1[key]);
              }
            }
          }
        })();
      },
      removeFileList1(file){
        delete this.fileList1[file.name];
      },
      addFileList2(file){
      	let _this = this;
        _this.fileList2[file.name] = file;
        //limit files number
        (function(){
          let count = 0;
          if(Object.keys(_this.fileList2).length > 1){
            for(let key in _this.fileList2){
              count ++;
              if(count > 1){
                jQuery(_this.fileList2[key].previewElement).remove();
                _this.removeFileList2(_this.fileList2[key]);
              }
            }
          }
        })();
      },
      removeFileList2(file){
        delete this.fileList2[file.name];
      },
      submitEvent(type){
      	let _this = this;
      	let params = {
      		data:{}
        };
      	if(_this.eventInfo.name == "" || _this.eventInfo.name.length == 0){
      		_this.$notify({
            title:'出现错误',
            message:'活动名称不能为空！',
            type:'error'
          });
      		return false;
        }
        if(_this.type == 1 && _this.timeScope.length == 0){
          _this.$notify({
            title:'出现错误',
            message:'请选择活动起止时间！',
            type:'error'
          });
          return false;
        }
        if(_this.category == ''){
          _this.$notify({
            title:'出现错误',
            message:'请选择商品所属品类！',
            type:'error'
          });
          return false;
        }
        (function(){
        	let count = 1;
        	for(var key in _this.fileList1){
        		params.data['file' + count] = _this.fileList1[key];
        		count ++;
          }
        })();

        for(let key in _this.fileList2){
          params.data['description'] = _this.fileList2[key];
        }
        params.data.name = _this.eventInfo.name;
        params.data.ownerid = _this.ownerId;
        params.data.categoryid = _this.category;
        params.data.type = _this.type;

        _this.omNetwork({
          tag:'postProduct',
          type:'postMultiPart',
          url:_this.API_SERVER + '/api/product/',
          data:params.data
        }).then((res) => {
          let startTime = _this.moment(_this.timeScope[0]).format('YYYY-MM-DD HH:mm:ss');
          let endTime = _this.moment(_this.timeScope[1]).format('YYYY-MM-DD HH:mm:ss');
          let productId = res.data.result.id;
          let data = {
            name:_this.eventInfo.name,
            description:_this.eventInfo.description
          };
          let url=_this.API_SERVER + '/api/event?productid=' + productId + '&eventnote=' + _this.eventInfo.eventnote + '&type=' + _this.type;
          if(_this.type == 1){
            url += '&startTime='+ startTime + '&endTime=' + endTime + '&status=&goal=' + _this.eventInfo.goal;
          }
          _this.omNetwork({
            tag:'postEvent',
            type:'postMultipart',
            url:url,
            data:data
          }).then((res) => {
            _this.$notify({
              title:_this.newEvent?'添加活动成功':'修改活动成功',
              message:'',
              type:'success'
            });
            _this.goBack();
          }).catch((err) => {
            _this.$notify({
              title:_this.newEvent?'添加活动失败':'修改活动失败',
              message:'',
              type:'error'
            });
          });
        }).catch((err) => {
          _this.$notify({
            title:_this.newEvent?'添加活动失败':'修改活动失败',
            message:err.msg,
            type:'error'
          });
        })
      },
      getCategoryList(){
          let _this = this;
          return new Promise((resolve,reject) => {
          	_this.omNetwork({
              tag:'getCategoryList',
              type:'get',
              url:_this.API_SERVER + '/api/category',
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
              url:_this.API_SERVER + '/api/event?eventKey=' + eventId,
              data:{}
            }).then((res) => {
                _this.eventInfo = res.data.result.list[0];
                if(!_this.newEvent){
                	_this.category = _this.eventInfo.product.category.id;
                	_this.type = _this.eventInfo.type;
                	if(_this.eventInfo.startTime && _this.eventInfo.endTime){
                		_this.timeScope = [new Date(_this.eventInfo.startTime),new Date(_this.eventInfo.endTime)];
                  }
                }
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
    computed:mapGetters(['API_SERVER']),
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
