<template>
    <el-table :data="tableData.dataList" stripe align="center">
      <el-table-column v-for="(item, index) in tableData.dataHeader"
                       :key="index"
                       :label="item"
                       :prop="item"
                       :width="180"/>
    </el-table>

    <el-dialog v-model="dialogFormVisible" title="查询">
    <el-form :model="form">
      <el-form-item label="数据表">
        <div class="filterBox filterBox-shadow">
          <el-checkbox-group class="checkboxGroup" tag="span" v-model="selectTables">
            <el-checkbox-button class="checkboxButton" v-for="key in tables" :key="key" :label="key">{{ key }}</el-checkbox-button>
          </el-checkbox-group>
        </div>
      </el-form-item>
      <el-form-item label="筛选条件">
        <el-input v-model="form.conditions" :placeholder="'如：id=1 AND ...'" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="() => {dialogFormVisible = false; search()}">查询</el-button>
        <el-button @click="dialogFormVisible = false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
  <el-button class="3" :type='"primary"' @click="() => {dialogFormVisible = true; getAllTables()}">查询</el-button>
</template>
<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { AttributeAddableObject } from '@/scripts/AttributeAddableObject'
import { MysqlConnector } from '@/scripts/MysqlConnector'
const tableData: AttributeAddableObject = reactive({
  dataList: [],
  dataHeader: []
})
const curDatabase: AttributeAddableObject = ref('')
let tables: AttributeAddableObject = ref([])
const selectTables: AttributeAddableObject = ref([])
const dialogFormVisible = ref(false)
const form = reactive({
  name: '',
  region: '',
  date1: '',
  date2: '',
  delivery: false,
  type: [],
  resource: '',
  desc: '',
  conditions: []
})
const getCurDatabase = async () => {
  const current = await mysqlConnector.currentDatabase()
  curDatabase.value = current[0]['DATABASE()']
}
const getAllTables = async () => {
  await getCurDatabase()
  const tbs = await mysqlConnector.showTables()
  tables = tbs.map((table: any) => {
    return table[`Tables_in_${curDatabase.value}`]
  })
}
const mysqlConnector = new MysqlConnector({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '123456',
  database: 'snake_db'
})
getAllTables()
function getDataHeader () {
  if (tableData.dataList.length === 0) return
  tableData.dataHeader = Object.keys(tableData.dataList[0])
}
const search = async () => {
  const res = await mysqlConnector.select('*', 'user')
  tableData.dataList = res
  getDataHeader()
}
</script>
<style scoped>
.resultTableColumn {
  text-align: center !important;
}

.result-table :deep(el-table__header) {
  text-align: center !important;
  align-items: center !important;
}

</style>
