<template>
  <suspense>
    <MainPage />
  </suspense>

</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import HelloWorld from '@/components/HelloWorld.vue'
import MainPage from '@/components/MainPage.vue'

@Options({
  components: {
    MainPage,
    HelloWorld
  }
})
export default class HomeView extends Vue {}
</script>
