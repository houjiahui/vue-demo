<template>
  <div>
    maskManager
  </div>
</template>
<script>
  import {mapMutations} from 'vuex'
  export default{
      name:'maskManager',
      methods:mapMutations(['setLoadingState']),
      mounted(){
          var _this = this;
          setTimeout(function(){
            _this.setLoadingState(false)
          },2000);
      }
  }
</script>
