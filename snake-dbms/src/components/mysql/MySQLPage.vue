<template>
    <el-table :data="tableData.dataList" stripe align="center">
      <el-table-column v-for="(item, index) in tableData.dataHeader"
                       :key="index"
                       :label="item"
                       :prop="item"
                       :width="180"/>
    </el-table>

    <el-dialog v-model="selectDialog" title="查询" draggable>
    <el-form :model="form">
      <el-form-item label="数据表">
        <div class="filterBox filterBox-shadow">
          <el-checkbox-group class="checkboxGroup" tag="span" v-model="form.selectedTables">
            <el-checkbox-button class="checkboxButton" v-for="key in tableData.tables" :key="key" :label="key" @change="onSelectedTablesChange">{{ key }}</el-checkbox-button>
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
        <el-button type="primary" @click="() => {selectDialog = false; search()}">查询</el-button>
        <el-button @click="selectDialog = false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>

  <el-dialog v-model="deleteDialog" title="删除" draggable>
    <el-form :model="form">
      <el-form-item label="数据表">
        <div class="filterBox filterBox-shadow">
          <el-radio-group class="checkboxGroup" tag="span" v-model="form.singleTable">
            <el-radio-button class="checkboxButton" v-for="key in tableData.tables" :key="key" :label="key" @change="onSelectedTablesChange">{{ key }}</el-radio-button>
          </el-radio-group>
        </div>
      </el-form-item>

      <el-form-item label="筛选条件">
        <el-input v-model="form.conditions" :placeholder="'如：id=1 AND ...'" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="() => {deleteDialog = false; deleteSubmit()}">删除</el-button>
        <el-button @click="deleteDialog = false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>

  <el-dialog v-model="updateDialog" title="更新" draggable>
    <el-form :model="form">
      <el-form-item label="数据表">
        <div class="filterBox filterBox-shadow">
          <el-checkbox-group class="checkboxGroup" tag="span" v-model="form.singleTable">
            <el-checkbox-button class="checkboxButton" v-for="key in tableData.tables" :key="key" :label="key" @change="onSelectedTablesChange">{{ key }}</el-checkbox-button>
          </el-checkbox-group>
        </div>
      </el-form-item>
      <el-form-item label="联表方式" v-if="form.selectedTables.length > 1">
        <el-input v-model="form.joinMode" :placeholder="'如：table_A a LEFT JOIN table_B b on a.id=b.id'" />
      </el-form-item>
      <el-form-item label="属性列" v-if="form.selectedTables.length > 0">
        <div class="filterBox filterBox-shadow">
          <el-checkbox-group class="checkboxGroup" tag="span" v-model="form.selectedAttrs">
            <el-row v-for="key in tableData.attrs" :key="key">
              <el-col>
              <el-checkbox-button class="checkboxButton" :label="key" @change="console.log(form.selectedAttrs)">{{ key }}</el-checkbox-button>
              </el-col>
              <el-col>
                <el-input v-model="form.conditions" :placeholder="'如：id=1 AND ...'" />
              </el-col>
            </el-row>
          </el-checkbox-group>
        </div>
      </el-form-item>
      <el-form-item label="筛选条件">
        <el-input v-model="form.conditions" :placeholder="'如：id=1 AND ...'" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="() => {updateDialog = false; search()}">更新</el-button>
        <el-button @click="updateDialog = false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
  <el-button class="3" :type='"primary"' @click="selectClick">查询</el-button>
  <el-button class="3" :type='"primary"' @click="deleteClick">删除</el-button>
  <el-button class="3" :type='"primary"' @click="updateClick">更新</el-button>
</template>
<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { AttributeAddableObject } from '@/scripts/AttributeAddableObject'
import { MysqlConnector } from '@/scripts/MysqlConnector'
import { ElMessage } from 'element-plus'
import { EpPropMergeType } from 'element-plus/es/utils'
const tableData: AttributeAddableObject = reactive({
  dataList: [],
  dataHeader: [],
  tables: [],
  attrs: []
})
const curDatabase: AttributeAddableObject = ref('')
const selectDialog = ref(false)
const deleteDialog = ref(false)
const updateDialog = ref(false)
const form = reactive({
  selectedTables: [],
  selectedAttrs: [],
  conditions: '',
  joinMode: '',
  singleTable: ''
})
function msgBox (msg: string, type: EpPropMergeType<StringConstructor, 'success' | 'warning' | 'error' | 'info', unknown>) {
  ElMessage({
    showClose: true,
    message: msg,
    type: type
  })
}
async function selectClick () {
  await getAllTables()
  selectDialog.value = true
}
async function deleteClick () {
  deleteDialog.value = true
}
async function updateClick () {
  updateDialog.value = true
}
const onSelectedTablesChange = async () => {
  form.selectedAttrs = []
  await getAllAttrs()
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
});
(async () => {
  await getAllTables()
})()
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
  if (tableData.dataList[0] === 'error') {
    msgBox('查询失败（sql语法错误或网络未连接）!', 'error')
    tableData.dataList = []
    tableData.dataHeader = []
  } else {
    msgBox('查询成功', 'success')
  }
}
const deleteSubmit = async () => {
  const res = await mysqlConnector.delete(form.singleTable, form.conditions)
  if (res === 'error') {
    msgBox('删除失败（sql语法错误或网络未连接）!', 'error')
    tableData.dataList = []
    tableData.dataHeader = []
  } else {
    msgBox('删除成功', 'success')
  }
}
const updateSubmit = async () => {
  const res = await mysqlConnector.update(form.singleTable, [''], form.conditions)
  if (res === 'error') {
    msgBox('删除失败（sql语法错误或网络未连接）!', 'error')
    tableData.dataList = []
    tableData.dataHeader = []
  } else {
    msgBox('删除成功', 'success')
  }
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
