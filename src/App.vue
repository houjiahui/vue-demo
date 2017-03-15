<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  export default {
    name: 'app',
    computed:mapState(['loading'])
  }
</script>
<style scoped>
  #app{
    width: 100%;
    height: 100%;
  }
</style>
