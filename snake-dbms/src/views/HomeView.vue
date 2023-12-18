<template>
  <div class="home">
<!--    <img alt="Vue logo" src="../assets/logo.png">-->
<!--    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>-->
    <MySQLPage></MySQLPage>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import HelloWorld from '@/components/HelloWorld.vue'
import MySQLPage from '@/components/mysql/MySQLPage.vue' // @ is an alias to /src

@Options({
  components: {
    MySQLPage
  }
})
export default class HomeView extends Vue {}
</script>
