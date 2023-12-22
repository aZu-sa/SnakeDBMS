<template>
<!--  <snake-echarts :options="options"></snake-echarts>-->
  <v-chart :option="options"></v-chart>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
// import SnakeEcharts from './SnakeEcharts/snakeEcharts.vue'
// import {
//   GridComponentOption,
//   LineSeriesOption,
//   BarSeriesOption
// } from 'echarts'
// import echarts from 'echarts'
//
// type EChartsOption = echarts.ComposeOption<
//   GridComponentOption | LineSeriesOption | BarSeriesOption
// >
const options = ref({
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [150, 230, 224, 218, 135, 147, 260],
      type: 'line'
    }
  ]
})
//
// const handleChange = () => {
//   var data: Array<number> = []
//   for (let i = 0; i < 7; i++) {
//     data.push(Math.ceil(Math.random() * 100))
//   }
//   options.value.series = [
//     {
//       data: data,
//       type: 'bar'
//     }
//   ]
// }
</script>

<style scoped lang="scss">

</style>
