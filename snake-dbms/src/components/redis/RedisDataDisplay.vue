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
          <el-input v-model="insertForm.key" />
        </el-form-item>
        <el-form-item label="类型" v-model="insertForm.type">
          <el-select>
            <el-option value="string">String</el-option>
            <el-option value="set">Set</el-option>
            <el-option value="hash">Hash</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="域" v-if="insertForm.type === 'hash'">
          <el-input v-model="insertForm.field" />
        </el-form-item>
        <el-form-item label="值">
          <el-input v-model="insertForm.value" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :onclick="handleInsert">插入</el-button>
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

const insertForm = ref({
  key: '',
  type: '',
  field: '',
  value: ''
})

const handleInsert = () => {
  console.log(insertForm.value)
}

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
