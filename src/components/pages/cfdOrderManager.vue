<template>
  <div>
    cfdOrderManager
  </div>
</template>
<script>
  import {mapMutations} from 'vuex'
  export default{
      name:'cfdOrderManager',
      methods:mapMutations(['setLoadingState']),
      mounted(){
          var _this = this;
          setTimeout(function(){
            _this.setLoadingState(false)
          },2000);
      }
  }
</script>
