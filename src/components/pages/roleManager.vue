<template>
  <div>
    roleManager
  </div>
</template>
<script>
  import {mapMutations} from 'vuex'
  export default{
      name:'roleManager',
      methods:mapMutations(['setLoadingState']),
      mounted(){
          var _this = this;
          setTimeout(function(){
            _this.setLoadingState(false)
          },2000);
      }
  }
</script>
