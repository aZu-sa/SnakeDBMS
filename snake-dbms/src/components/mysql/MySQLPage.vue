<template>
    <el-table :data="tableData.dataList" stripe align="center">
      <el-table-column v-for="(item, index) in tableData.dataHeader"
                       :key="index"
                       :label="item"
                       :prop="item"
                       :width="180"/>
    </el-table>

    <el-dialog v-model="selectDialog" title="查询" draggable :before-close="handleDialogExit" :show-close="false">
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
        <el-button type="primary" @click="() => {selectDialog = false; searchSubmit(); handleDialogExit()}">查询</el-button>
        <el-button @click="selectDialog = false; handleDialogExit()">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>

  <el-dialog v-model="deleteDialog" title="删除" draggable :before-close="handleDialogExit" :show-close="false">
    <el-form :model="form">
      <el-form-item label="数据表">
        <div class="filterBox filterBox-shadow">
          <el-radio-group class="checkboxGroup" tag="span" v-model="form.singleTable">
            <el-radio-button class="checkboxButton" v-for="key in tableData.tables" :key="key" :label="key" @change="onSingleTableChange">{{ key }}</el-radio-button>
          </el-radio-group>
        </div>
      </el-form-item>

      <el-form-item label="筛选条件">
        <el-input v-model="form.conditions" :placeholder="'如：id=1 AND ...'" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="() => {deleteDialog = false; deleteSubmit(); handleDialogExit()}">删除</el-button>
        <el-button @click="deleteDialog = false; handleDialogExit()">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>

  <el-dialog v-model="updateDialog" title="更新" draggable :before-close="handleDialogExit" :show-close="false">
    <el-form :model="form">
      <el-form-item label="数据表">
        <div class="filterBox filterBox-shadow">
          <el-radio-group class="checkboxGroup" tag="span" v-model="form.singleTable">
            <el-radio-button class="checkboxButton" v-for="key in tableData.tables" :key="key" :label="key" @change="onSingleTableChange">{{ key }}</el-radio-button>
          </el-radio-group>
        </div>
      </el-form-item>
      <el-form-item v-for = "key in tableData.attrs" :key="key" :label="key">
          <el-input v-model="insertUpdateData.datapair[key]" placeholder="若为字符串，请加入引号，如'snake'"/>
      </el-form-item>
      <el-form-item label="筛选条件">
        <el-input v-model="form.conditions" :placeholder="'如：id=1 AND ...'" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="() => {updateDialog = false; updateSubmit(); handleDialogExit()}">更新</el-button>
        <el-button @click="updateDialog = false; handleDialogExit()">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
  <el-dialog v-model="insertDialog" title="插入" draggable :before-close="handleDialogExit" :show-close="false">
    <el-form :model="form">
      <el-form-item label="数据表">
        <div class="filterBox filterBox-shadow">
          <el-radio-group class="checkboxGroup" tag="span" v-model="form.singleTable">
            <el-radio-button class="checkboxButton" v-for="key in tableData.tables" :key="key" :label="key" @change="onSingleTableChange">{{ key }}</el-radio-button>
          </el-radio-group>
        </div>
      </el-form-item>
      <el-form-item v-for = "key in tableData.attrs" :key="key" :label="key">
          <el-input v-model="insertUpdateData.datapair[key]" placeholder="若为字符串，请加入引号，如'snake'"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="() => {insertDialog = false; insertSubmit(); handleDialogExit()}">插入</el-button>
        <el-button @click="insertDialog = false; handleDialogExit()">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
  <el-button class="3" :type='"primary"' @click="selectClick">查询</el-button>
  <el-button class="3" :type='"primary"' @click="insertDialog = true">插入</el-button>
  <el-button class="3" :type='"primary"' @click="deleteClick">删除</el-button>
  <el-button class="3" :type='"primary"' @click="updateClick">更新</el-button>
  <el-switch
    v-model="transactionSwitch"
    class="ml-2"
    inline-prompt
    active-text="事务已开启"
    inactive-text="事务已关闭"
    @change="transactionChange"
  />
  <el-button class="3" :type='"primary"' @click="transactionCommit" v-if="transactionSwitch === true">事务提交</el-button>
  <el-button class="3" :type='"primary"' @click="transactionRollback" v-if="transactionSwitch === true">事务回滚</el-button>
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
const insertDialog = ref(false)
const transactionSwitch = ref()
const insertUpdateData = reactive({
  datapair: []
})

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
  selectDialog.value = true
}
async function deleteClick () {
  deleteDialog.value = true
}
async function updateClick () {
  updateDialog.value = true
}

const handleDialogExit = async () => {
  form.selectedTables = []
  form.selectedAttrs = []
  form.conditions = ''
  form.joinMode = ''
  form.singleTable = ''
  insertUpdateData.datapair = []
  tableData.attrs = []
}

const onSelectedTablesChange = async () => {
  form.selectedAttrs = []
  await getAllAttrs()
}

const onSingleTableChange = async () => {
  form.selectedAttrs = []
  await getSingleAttrs()
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

const getSingleAttrs = async () => {
  tableData.attrs = []
  const res = await mysqlConnector.getTableAttrs(form.singleTable)
  let arr = []
  arr = res.map((item) : string => {
    return form.singleTable + '.' + item.Field
  })
  for (const arrKey of arr) {
    tableData.attrs.push(arrKey)
  }
}

const mysqlConnector = new MysqlConnector({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '123456',
  database: 'snake_db',
  flags: 'INTERACTIVE'
})
function getDataHeader () {
  if (tableData.dataList.length === 0) return
  tableData.dataHeader = Object.keys(tableData.dataList[0])
}

const insertSubmit = async () => {
  var values:Array<Array<string>> = []
  values.push(Object.values(insertUpdateData.datapair))
  console.log(values)
  console.log(Object.keys(insertUpdateData.datapair))
  const result = await mysqlConnector.insert(
    form.singleTable,
    values, Object.keys(insertUpdateData.datapair)
  )
  if (result === 'error') {
    msgBox('插入失败（sql语法错误或网络未连接）!', 'error')
    tableData.dataList = []
    tableData.dataHeader = []
  } else {
    msgBox('插入成功', 'success')
  }
}

const searchSubmit = async () => {
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
};
(async () => {
  await getAllTables()
})()
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
  var sets:Array<string> = []
  for (const key in insertUpdateData.datapair) {
    sets.push(key + '=' + insertUpdateData.datapair[key])
  }
  const res = await mysqlConnector.update(form.singleTable, sets, form.conditions)
  if (res === 'error') {
    msgBox('更新失败（sql语法错误或网络未连接）!', 'error')
    tableData.dataList = []
    tableData.dataHeader = []
  } else {
    msgBox('更新成功', 'success')
  }
}
const transactionChange = async () => {
  let res: any
  if (transactionSwitch.value) {
    res = await mysqlConnector.startTransaction()
  } else {
    res = await mysqlConnector.rollback()
  }
  if (res === 'error') {
    msgBox('事务更改请求失败（sql语法错误或网络未连接）!', 'error')
    tableData.dataList = []
    tableData.dataHeader = []
  } else {
    msgBox('事务更改成功', 'success')
  }
}
const transactionCommit = async () => {
  const res = await mysqlConnector.commit()
  transactionSwitch.value = false
  if (res === 'error') {
    msgBox('事务更改请求失败（sql语法错误或网络未连接）!', 'error')
    tableData.dataList = []
    tableData.dataHeader = []
  } else {
    msgBox('事务更改成功', 'success')
  }
}
const transactionRollback = async () => {
  const res = await mysqlConnector.rollback()
  transactionSwitch.value = false
  if (res === 'error') {
    msgBox('事务更改请求失败（sql语法错误或网络未连接）!', 'error')
    tableData.dataList = []
    tableData.dataHeader = []
  } else {
    msgBox('事务更改成功', 'success')
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
