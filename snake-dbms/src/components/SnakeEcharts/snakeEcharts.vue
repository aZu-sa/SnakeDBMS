<template>
  <div ref="echartDivRef" class="echart"></div>
</template>

<script lang="ts" setup>
import { onMounted, ref, Ref, watch } from 'vue'
import * as echarts from 'echarts'
import {
  ECharts,
  GridComponentOption,
  LineSeriesOption,
  BarSeriesOption
} from 'echarts'

// 这个地方这样写是为了防止ts监测到类型不匹配的问题
type EChartsOption = echarts.ComposeOption<
  GridComponentOption | LineSeriesOption | BarSeriesOption
>;

const echartDivRef = ref<HTMLDivElement>()
let myChart: ECharts

const props = withDefaults(
  defineProps<{
    options: EChartsOption;
  }>(),
  {
    options: () => ({})
  }
)

const initChart = () => {
  if (myChart !== undefined) {
    myChart.dispose()
  }
  myChart = echarts.init(echartDivRef.value as HTMLDivElement)
  myChart.setOption(props.options)
}

const updateSize = () => {
  myChart.resize()
}

watch(
  () => props.options,
  () => {
    initChart()
  },
  {
    deep: true
  }
)

onMounted(() => {
  initChart()
  window.addEventListener('resize', () => {
    myChart.resize()
  })
})

defineExpose({
  updateSize
})
</script>

<style lang="css" scoped>
.echart {
  width: 100%;
  height: 100%;
}
</style>
