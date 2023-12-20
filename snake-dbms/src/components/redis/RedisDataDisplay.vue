<template>
  <el-table :data="allData" style="width: 700px" border max-height="500px">
    <el-table-column prop="key" label="Key" width="100px" fixed/>
    <el-table-column prop="type" label="Type" width="100px"/>
    <el-table-column prop="ttl" label="TTL" width="75px"/>
    <el-table-column prop="value" label="Value"/>
  </el-table>

  <el-button @click="refresh" align="left">刷新</el-button>

  <el-tabs type="border-card">
    <el-tab-pane label="插入">
      <el-form label-width="100px">
        <el-form-item label="键">
          <el-input />
        </el-form-item>
        <el-form-item label="类型">
          <el-select>
            <el-option>string</el-option>
            <el-option>hash</el-option>
            <el-option>set</el-option>
          </el-select>
        </el-form-item>
        <el-form-item>

        </el-form-item>
      </el-form>
    </el-tab-pane>
    <el-tab-pane label="删除">
      Set
    </el-tab-pane>
    <el-tab-pane label="Set">
      Set
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>
import { RedisConnector } from '@/scripts/RedisConnector'
import { ref } from 'vue'

const props = defineProps({
  Connector: {
    type: Object,
    required: true
  }
})
const redisConnector = props.Connector as RedisConnector
const allData = ref(await redisConnector.autoGetAll())

async function refresh () {
  allData.value = await redisConnector.autoGetAll()
}
</script>

<style lang="scss" scoped>

</style>
