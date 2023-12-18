<template>
    <el-table :data="tableData.dataList" stripe align="center">
      <el-table-column v-for="(item, index) in tableData.dataHeader"
                       :key="index"
                       :label="item"
                       :prop="item"
                       :width="180"/>
    </el-table>

  <el-button class="3" :type='"primary"' @click="search">查询</el-button>
</template>
<script lang="ts" setup>
import { reactive } from 'vue'
import { AttributeAddableObject } from '@/scripts/AttributeAddableObject'
import { MysqlConnector } from '@/scripts/MysqlConnector'
const tableData: AttributeAddableObject = reactive({
  dataList: [],
  dataHeader: []
})
const mysqlConnector = new MysqlConnector({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '123456',
  database: 'snake_db'
})
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
