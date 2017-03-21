<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{newEvent?'添加新活动':'编辑活动'}}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="h1">
      {{newEvent?'添加新活动':'编辑活动'}}
    </div>
  </div>
</template>
<script>
  import {mapMutations,mapActions} from 'vuex'
  export default{
    name:'eventEditor',
    data(){
        return{
          eventInfo:{
            current_count:'',
            description:'',
            disabled:false,
            endTime:'',
            eventnote:'',
            goal:'',
            id:'',
            name:'',
            product:{
              category:{
                id:''
              }
            },
            serverTime:'',
            status:'',
          },
          ownerId:'',
          categoryList:{},
          newEvent:false
        }
    },
    methods:{
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
    }
  }
</script>
