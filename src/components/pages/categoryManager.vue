<template>
  <div>
    categoryManager
  </div>
</template>
<script>
  import {mapMutations} from 'vuex'
  export default{
      name:'categoryManager',
      methods:mapMutations(['setLoadingState']),
      mounted(){
          var _this = this;
          setTimeout(function(){
            _this.setLoadingState(false)
          },2000);
      }
  }
</script>
