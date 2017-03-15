<template>
  <div id="index">
    <v-header></v-header>
    <div class="main">
      <div class="sidebar">
        <sidebar></sidebar>
      </div>
      <div class="mainview">
        <router-view v-loading="loading" element-loading-text="拼命加载中" class="view"></router-view>
      </div>
    </div>
    <v-footer></v-footer>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import header from 'templates/header'
  import sidebar from 'templates/sidebar'
  import footer from 'templates/footer'
  export default {
    name: 'index',
    data(){
        return{

        }
    },
    components:{
        'v-header':header,
        'sidebar':sidebar,
        'v-footer':footer
    },
    computed:mapGetters(['loading'])
  }
</script>
<style scoped>
  #index{
    height: 100%;
  }
  .main{
    clear: both;
    position: relative;
    height: calc(100% - 80px);
  }
  .main > div{
    float: left;
    position: absolute;
  }
  .main .sidebar{
    width: 240px;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 2;
  }
  .main .mainview{
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 20px 20px 20px 260px;
    z-index: 1;
  }
  .main .view{
    height: 100%!important;
    overflow: auto;
  }
</style>
