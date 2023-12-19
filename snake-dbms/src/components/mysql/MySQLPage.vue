<template>
    <el-table :data="tableData.dataList" stripe align="center">
      <el-table-column v-for="(item, index) in tableData.dataHeader"
                       :key="index"
                       :label="item"
                       :prop="item"
                       :width="180"/>
    </el-table>

    <el-dialog v-model="dialogFormVisible" title="查询" draggable>
    <el-form :model="form">
      <el-form-item label="数据表">
        <div class="filterBox filterBox-shadow">
          <el-checkbox-group class="checkboxGroup" tag="span" v-model="form.selectedTables">
            <el-checkbox-button class="checkboxButton" v-for="key in tableData.tables" :key="key" :label="key" @change="getAllAttrs">{{ key }}</el-checkbox-button>
          </el-checkbox-group>
        </div>
      </el-form-item>
      <el-form-item label="联表方式" v-if="form.selectedTables.length > 1">
        <el-input v-model="form.joinMode" :placeholder="'如：table_A a LEFT JOIN table_B b on a.id=b.id'" />
      </el-form-item>
      <el-form-item label="属性列" v-if="form.selectedTables.length > 0">
        <div class="filterBox filterBox-shadow">
          <el-checkbox-group class="checkboxGroup" tag="span" v-model="form.selectedAttrs">
            <el-checkbox-button class="checkboxButton" v-for="key in tableData.attrs" :key="key" :label="key" @change="console.log(form.selectedAttrs)">{{ key }}</el-checkbox-button>
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
  <el-button class="3" :type='"primary"' @click="selectClick">查询</el-button>
</template>
<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { AttributeAddableObject } from '@/scripts/AttributeAddableObject'
import { MysqlConnector } from '@/scripts/MysqlConnector'
const tableData: AttributeAddableObject = reactive({
  dataList: [],
  dataHeader: [],
  tables: [],
  attrs: []
})
const curDatabase: AttributeAddableObject = ref('')
const dialogFormVisible = ref(false)
const form = reactive({
  selectedTables: [],
  selectedAttrs: [],
  conditions: [],
  joinMode: ''
})
async function selectClick () {
  await getAllTables()
  dialogFormVisible.value = true
}
const getCurDatabase = async () => {
  const current = await mysqlConnector.currentDatabase()
  curDatabase.value = current[0]['DATABASE()']
}
const getAllTables = async () => {
  await getCurDatabase()
  const tbs = await mysqlConnector.showTables()
  tableData.tables = tbs.map((table: any) => {
    return table[`Tables_in_${curDatabase.value}`]
  })
  await getAllAttrs()
}
const getAllAttrs = async () => {
  tableData.attrs = []
  for (const key in form.selectedTables) {
    const table = form.selectedTables[key] as string
    const res = await mysqlConnector.getTableAttrs(table)
    let arr = []
    arr = res.map((item) : string => {
      return table + '.' + item.Field
    })
    for (const arrKey of arr) {
      tableData.attrs.push(arrKey)
    }
  }
}

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
  if (form.selectedTables.length > 1) {
    tableData.dataList = await mysqlConnector.select(form.selectedAttrs, form.joinMode, form.conditions)
  } else {
    tableData.dataList = await mysqlConnector.select(form.selectedAttrs, form.selectedTables[0], form.conditions)
  }
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
