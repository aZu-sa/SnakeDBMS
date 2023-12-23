<template>
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
        <el-button type="primary" @click="() => {deleteDialog = false; deleteSubmit(); handleDialogExit(); clearDataTable();}">删除</el-button>
        <el-button @click="() => {deleteDialog = false; handleDialogExit();}">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>

  <el-dialog v-model="updateDialog" title="更新" draggable :before-close="handleDialogExit" :show-close="false">
    <el-text>不需要更新的属性可以为空</el-text>
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
        <el-button type="primary" @click="() => {updateDialog = false; updateSubmit(); handleDialogExit(); clearDataTable();}">更新</el-button>
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
        <el-button type="primary" @click="() => {insertDialog = false; insertSubmit(); handleDialogExit(); clearDataTable();}">插入</el-button>
        <el-button @click="insertDialog = false; handleDialogExit()">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
  <el-dialog v-model="addIndexDialog" title="添加索引" draggable :before-close="handleDialogExit" :show-close="false">
    <el-form :model="form">
      <el-form-item label="数据表">
        <div class="filterBox filterBox-shadow">
          <el-radio-group class="checkboxGroup" tag="span" v-model="form.singleTable">
            <el-radio-button class="checkboxButton" v-for="key in tableData.tables" :key="key" :label="key" @change="onSingleTableChange">{{ key }}</el-radio-button>
          </el-radio-group>
        </div>
      </el-form-item>
      <el-form-item label="属性列" v-if="form.singleTable.length > 0">
        <div class="filterBox filterBox-shadow">
          <el-checkbox-group class="checkboxGroup" tag="span" v-model="form.selectedAttrs">
            <el-checkbox-button class="checkboxButton" v-for="key in tableData.attrs" :key="key" :label="key" @change="console.log(form.selectedAttrs)">{{ key }}</el-checkbox-button>
          </el-checkbox-group>
        </div>
      </el-form-item>
      <el-form-item label="索引类型">
      <el-select v-model="indexData.indexType" class="m-2" placeholder="Select">
        <el-option
          v-for="item in indexTypeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      </el-form-item>
      <el-form-item label="索引名称">
        <el-input v-model="indexData.indexName"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="() => {addIndexDialog = false; addIndexSubmit(); handleDialogExit()}">添加</el-button>
        <el-button @click="addIndexDialog = false; handleDialogExit()">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
  <el-dialog v-model="dropIndexDialog" title="删除索引" draggable :before-close="handleDialogExit" :show-close="false">
    <el-form :model="form">
      <el-form-item label="数据表">
        <div class="filterBox filterBox-shadow">
          <el-radio-group class="checkboxGroup" tag="span" v-model="form.singleTable">
            <el-radio-button class="checkboxButton" v-for="key in tableData.tables" :key="key" :label="key" @change="onSingleTableChange">{{ key }}</el-radio-button>
          </el-radio-group>
        </div>
      </el-form-item>

      <el-form-item label="索引名">
        <el-input v-model="indexData.indexName"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="() => {dropIndexDialog = false; dropIndexSubmit(); handleDialogExit()}">删除</el-button>
        <el-button @click="dropIndexDialog = false; handleDialogExit()">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
  <el-dialog v-model="showIndexDialog" title="显示索引信息" draggable :before-close="handleDialogExit" :show-close="false">
    <el-form :model="form">
      <el-form-item label="数据表">
        <div class="filterBox filterBox-shadow">
          <el-radio-group class="checkboxGroup" tag="span" v-model="form.singleTable">
            <el-radio-button class="checkboxButton" v-for="key in tableData.tables" :key="key" :label="key" @change="onSingleTableChange">{{ key }}</el-radio-button>
          </el-radio-group>
        </div>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="() => {showIndexDialog = false; showIndexSubmit(); handleDialogExit()}">显示</el-button>
        <el-button @click="showIndexDialog = false; handleDialogExit()">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
  <el-dialog v-model="dropTableDialog" title="删除数据表" draggable :before-close="handleDialogExit" :show-close="false">
    <el-form :model="form">
      <el-form-item label="数据表">
        <div class="filterBox filterBox-shadow">
          <el-radio-group class="checkboxGroup" tag="span" v-model="form.singleTable">
            <el-radio-button class="checkboxButton" v-for="key in tableData.tables" :key="key" :label="key" @change="onSingleTableChange">{{ key }}</el-radio-button>
          </el-radio-group>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="() => {dropTableDialog = false; dropTableSubmit(); handleDialogExit()}">删除</el-button>
        <el-button @click="dropTableDialog = false; handleDialogExit()">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
  <el-dialog v-model="createTableDialog" title="创建数据表" draggable :before-close="handleDialogExit" :show-close="false">
    <el-form :model="form">
      <el-form
        ref="formRef"
        :model="dynamicValidateForm"
        label-width="120px"
        class="demo-dynamic"
      >
      </el-form>
      <el-form-item
        prop="newTableName"
        label="表名"
      >
        <el-input v-model="dynamicValidateForm.newTableName" />
      </el-form-item>
      <el-form-item
        v-for="(domain, index) in dynamicValidateForm.domains"
        :key="domain.key"
        :label="'属性' + index"
        :prop="'domains.' + index + '.attrName'"
      >
        <el-row>
          <el-col :span='7'>
            <el-text>属性名</el-text>
          </el-col>
          <el-col :span='17'>
          <el-input v-model="domain.attrName" />
          </el-col>
        </el-row>
        <el-row>
          <el-col :span='7'>
            <el-text>属性类型</el-text>
          </el-col>
          <el-col :span='17'>
            <el-input v-model="domain.attrType" />
          </el-col>
        </el-row>
        <el-button class="mt-2" @click.prevent="removeDomain(domain)">Delete</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="addDomain">新增属性</el-button>
        <el-button @click="resetForm(formRef)">清空属性</el-button>
        <el-button type="primary" @click="() => {createTableDialog = false; createTableSubmit(); handleDialogExit()}">创建</el-button>
        <el-button @click="createTableDialog = false; handleDialogExit()">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>

  <el-button class="3" :type='"primary"' @click="selectClick">查询</el-button>
  <el-button class="3" :type='"primary"' @click="insertDialog = true">插入</el-button>
  <el-button class="3" :type='"primary"' @click="deleteClick">删除</el-button>
  <el-button class="3" :type='"primary"' @click="updateClick">更新</el-button>
  <el-button class="3" :type='"primary"' @click="addIndexClick">添加索引</el-button>
  <el-button class="3" :type='"primary"' @click="dropIndexClick">删除索引</el-button>
  <el-button class="3" :type='"primary"' @click="showIndexClick">显示索引信息</el-button>
  <el-button class="3" :type='"primary"' @click="createTableClick">创建表</el-button>
  <el-button class="3" :type='"primary"' @click="dropTableClick">删除表</el-button>
  <el-button class="3" :type='"primary"' @click="showProfilesClick">查看性能</el-button>
  <div class="transaction-box">
    <el-switch
      v-model="transactionSwitch"
      size="large"
      class="transaction-switch"
      inline-prompt
      active-text="事务已开启"
      inactive-text="事务已关闭"
      @change="transactionChange"
    />
    <el-button class="3" :type='"success"' @click="transactionCommit" v-if="transactionSwitch">事务提交</el-button>
    <el-button class="3" :type='"primary"' @click="transactionRollback" v-if="transactionSwitch">事务回滚</el-button>
  </div>
  <div class="table-box">
  <el-table :data="tableData.dataList" stripe align="center" max-height="400"><el-table-column v-for="(item, index) in tableData.dataHeader"
                                                                                               :key="index"
                                                                                               :label="item"
                                                                                               :prop="item"
                                                                                               :width="180"/>
  </el-table>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { AttributeAddableObject } from '@/scripts/AttributeAddableObject'
import { MysqlConnector } from '@/scripts/MysqlConnector'
import { ElMessage, FormInstance } from 'element-plus'
import { EpPropMergeType } from 'element-plus/es/utils'

const props = defineProps({
  Connector: {
    type: Object
  }
})
const mysqlConnector = props.Connector as MysqlConnector
const indexTypeOptions = [
  { value: 'INDEX', label: '普通索引' },
  { value: 'UNIQUE INDEX', label: '唯一索引' },
  { value: 'FULLTEXT INDEX', label: '全文索引' },
  { value: 'SPATIAL INDEX', label: '空间索引' }
]
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
const addIndexDialog = ref(false)
const dropIndexDialog = ref(false)
const showIndexDialog = ref(false)
const transactionSwitch = ref(false)
const createTableDialog = ref(false)
const dropTableDialog = ref(false)
const insertUpdateData = reactive({
  datapair: []
})
const indexData = reactive({
  indexType: '',
  indexName: ''
})
const formRef = ref<FormInstance>()
interface DomainItem {
  key: number
  attrName: string
  attrType: string
}
const dynamicValidateForm = reactive<{
  domains: DomainItem[]
  newTableName: string
}>({
  domains: [
    {
      key: 1,
      attrName: '',
      attrType: ''
    }
  ],
  newTableName: ''
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
async function addIndexClick () {
  addIndexDialog.value = true
}
async function dropIndexClick () {
  dropIndexDialog.value = true
}
async function showIndexClick () {
  showIndexDialog.value = true
}
async function createTableClick () {
  createTableDialog.value = true
}
async function dropTableClick () {
  dropTableDialog.value = true
}
async function showProfilesClick () {
  await showProfiles()
  await handleDialogExit()
}
const handleDialogExit = async () => {
  form.selectedTables = []
  form.selectedAttrs = []
  form.conditions = ''
  form.joinMode = ''
  form.singleTable = ''
  insertUpdateData.datapair = []
  tableData.attrs = []
  indexData.indexType = ''
  indexData.indexName = ''
  createTableFormInit()
}
function createTableFormInit () {
  dynamicValidateForm.domains = [
    {
      key: 1,
      attrName: '',
      attrType: ''
    }
  ]
  dynamicValidateForm.newTableName = ''
}
const clearDataTable = async () => {
  tableData.dataList = []
}

const onSelectedTablesChange = async () => {
  form.selectedAttrs = []
  await getAllAttrs()
}

const onSingleTableChange = async () => {
  form.selectedAttrs = []
  await getSingleAttrs()
}

const removeDomain = (item: DomainItem) => {
  const index = dynamicValidateForm.domains.indexOf(item)
  if (index !== -1) {
    dynamicValidateForm.domains.splice(index, 1)
  }
}

const addDomain = () => {
  dynamicValidateForm.domains.push({
    key: Date.now(),
    attrName: '',
    attrType: ''
  })
}
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  createTableFormInit()
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
  await mysqlConnector.setProfilesOn()
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
function removePrefix (attr: Array<string>) {
  return attr.map((item) => {
    return item.split('.')[1]
  })
}
const addIndexSubmit = async () => {
  const res = await mysqlConnector.createIndex(indexData.indexType, indexData.indexName, form.singleTable, removePrefix(form.selectedAttrs))
  if (res === 'error') {
    msgBox('添加索引失败（sql语法错误或网络未连接）!', 'error')
    tableData.dataList = []
    tableData.dataHeader = []
  } else {
    msgBox('添加索引成功', 'success')
  }
}
const dropIndexSubmit = async () => {
  const res = await mysqlConnector.dropIndex(indexData.indexName, form.singleTable)
  if (res === 'error') {
    msgBox('删除索引失败（sql语法错误或网络未连接）!', 'error')
    tableData.dataList = []
    tableData.dataHeader = []
  } else {
    msgBox('删除索引成功', 'success')
  }
}
const showIndexSubmit = async () => {
  tableData.dataList = await mysqlConnector.showIndex(form.singleTable)
  getDataHeader()
  if (tableData.dataList[0] === 'error') {
    msgBox('显示索引失败（sql语法错误或网络未连接）!', 'error')
    tableData.dataList = []
    tableData.dataHeader = []
  } else {
    msgBox('显示索引成功', 'success')
  }
}
const dropTableSubmit = async () => {
  const res = await mysqlConnector.drop(form.singleTable)
  await getAllTables()
  if (res === 'error') {
    msgBox('表删除失败（sql语法错误或网络未连接）!', 'error')
    tableData.dataList = []
    tableData.dataHeader = []
  } else {
    msgBox('表删除成功', 'success')
  }
}
const createTableSubmit = async () => {
  console.log(dynamicValidateForm)
  const newAttrs = dynamicValidateForm.domains.map((item) => {
    return `${item.attrName} ${item.attrType}`
  })
  var attrs = []
  for (var attr of newAttrs) {
    if (attr === ' ') {
      continue
    }
    attrs.push(attr)
  }
  const res = await mysqlConnector.create(dynamicValidateForm.newTableName, attrs)
  await getAllTables()
  if (res === 'error') {
    msgBox('表创建失败（sql语法错误或网络未连接）!', 'error')
    tableData.dataList = []
    tableData.dataHeader = []
  } else {
    msgBox('表创建成功', 'success')
  }
}
const showProfiles = async () => {
  tableData.dataList = await mysqlConnector.showProfiles()
  getDataHeader()
  if (tableData.dataList[0] === 'error') {
    msgBox('性能查询失败（sql语法错误或网络未连接）!', 'error')
    tableData.dataList = []
    tableData.dataHeader = []
  } else {
    msgBox('性能查询成功', 'success')
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

.transaction-box {
  margin: 10px 0;
}

.transaction-switch {
  margin-right: 5px;
}

.table-box {
  text-align: center;
}
</style>
