<template>
  <div id="dashboard">
    欢迎回来，{{loginUser}}
  </div>
</template>
<script>
  import {mapGetters,mapMutations} from 'vuex'
  export default{
      name:'dashboard',
      methods:mapMutations(['setLoadingState']),
      computed:mapGetters(['loginUser','requestCache']),
      mounted(){
          var _this = this;
          _this.$nextTick(function(){
            setTimeout(function(){
              _this.setLoadingState(false);
            },300);
          });
      }
  }
</script>
