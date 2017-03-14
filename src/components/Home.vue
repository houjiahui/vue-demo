<template>
  <div class="index">
    <v-header></v-header>
  </div>
</template>

<script>
  import header from 'templates/header.vue'
  export default {
    name: 'index',
    data(){
        return{
            checked:true
        }
    },
    components:{
        'v-header':header
    }
  }
</script>
