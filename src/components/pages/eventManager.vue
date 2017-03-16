<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="h1">活动列表</div>
    <el-button type="primary" size="large">发起活动</el-button>
    <div class="table">
      <el-table :data="tableData.list" border stripe style="width: 100%">
        <el-table-column type="selection" width="50" align="center"></el-table-column>
        <el-table-column prop="name" label="活动名称(编号)" align="center" width="350">
          <template scope="scope">
            <span>{{scope.row.name}}({{scope.row.id}})</span>
          </template>
        </el-table-column>
        <el-table-column prop="eventnote" label="活动备注" align="center" >
          <template scope="scope">
            <span v-html="scope.row.eventnote?scope.row.eventnote:'无'"></span>
          </template>
        </el-table-column>
        <el-table-column prop="startTime" label="开始时间" align="center">
          <template scope="scope">
            <span>{{scope.row.startTime | date('%Y-%m-%d %T')}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="endTime" label="结束时间" align="center">
          <template scope="scope">
            <span>{{scope.row.endTime | date('%Y-%m-%d %T')}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center" :formatter="formatEventState"></el-table-column>
        <el-table-column prop="address" label="目标/达成　(%)" align="center">
          <template scope="scope">
            <span>{{scope.row.goal}} / {{scope.row.current_count}}　({{Math.round((scope.row.current_count / scope.row.goal * 100 ))}}%)</span>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="" ></el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        @current-change="changePageNo"
        :current-page="tableData.pageNo"
        :page-size="tableData.pageSize"
        layout="total, prev, pager, next"
        :total="tableData.total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import {mapMutations,mapGetters} from 'vuex'
  export default{
      name:'eventManager',
      methods:{
        formatEventState(row){
            let state = {
              '-9' : '全部',
              '0' : '准备',
              '10' : '正在进行',
              '20' : '已结束',
              '30' : '失败',
              '40' : '完成'
            };
            return state[row.status];
        },
        updateStatus(data){
            let _this = this;
            return new Promise((resolve,reject) => {
              _this.$http.patch(process.env.API_SERVER + '/api/event',data)
                .then((res) => {
                  resolve(res);
                })
                .catch((err) => {
                  reject(err)
                });
            });
        },
        getEvent(eventKey,status,startTime,endTime,pageNo){
            let _this = this;
            return new Promise((resolve,reject) => {
              _this.$http.get(process.env.API_SERVER + '/api/event?eventKey='+eventKey+'&status='+status+'&startTime='+startTime+'&endTime='+endTime+'&pageSize=20&pageNo='+pageNo)
                .then((res) => {
                  resolve(res)
                })
                .catch((err) => {
                  reject(err)
                });
            });
        },
        changePageNo(currentPage){
            let _this = this;
            _this.$router.push({name:'eventManager',query:{pageNo:currentPage}});
        },
        setTableData(data){
            this.tableData = data;
            this.setLoadingState(false);
        },
        ...mapMutations(['setLoadingState']),
      },
      mounted(){
          let _this = this;
          let nowPage = _this.$route.query.pageNo?_this.$route.query.pageNo:1;
          Promise.all([_this.updateStatus({}),_this.getEvent('',-9,'','',nowPage)])
            .then((res) => {
              _this.setTableData(res[1].data.result);
            })
            .catch((err) => {
              _this.setLoadingState(false);
              _this.$notify({
                title:'出现错误',
                message:err,
                type:'error'
              })
            })
      },
      data() {
        return {
          tableData:{}
        }
      },
      computed:mapGetters(['nowPage']),
      watch:{
          $route(to,from){
            let _this = this;
            if(to.name == _this.nowPage){
              _this.getEvent('','-9','','',to.query.pageNo)
                .then((res) => {
                  _this.setTableData(res.data.result);
                })
                .catch(() => {

                });
            }
          }
      }
  }
</script>
