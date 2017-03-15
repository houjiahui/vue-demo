<template>
  <div id="sidebar">
    <el-menu class="sidebar" theme="dark" :router="router" :default-active="nowPage">
      <el-submenu v-for="(menuItem,outerIndex) in menu" :key="outerIndex" :index="String(outerIndex)">
        <template slot="title">{{menuItem.text}}</template>
        <el-menu-item v-for="(subMenuItem,innerIndex) in menuItem.submenu" :key="innerIndex" :index="subMenuItem.name" :route="{name:subMenuItem.path}">
          {{subMenuItem.text}}
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>
<script>
  import {mapGetters,mapMutations} from 'vuex'
  import menu from './menu'
  export default{
      name:'sidebar',
      data(){
          return {
            menu,
            router:true
          }
      },
      methods:{

      },
      computed:mapGetters(['nowPage'])
  }
</script>
<style scoped>
  #sidebar{
    height: 100%;
  }
  #sidebar .sidebar{
    height: 100%;
    border-radius: 0!important;
  }
</style>
