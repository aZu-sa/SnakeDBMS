<template>
  <el-table :data="allData" style="width: 600px" border max-height="450px">
    <el-table-column prop="key" label="Key" width="100px" fixed />
    <el-table-column prop="type" label="Type" width="100px" />
    <el-table-column prop="ttl" label="TTL" width="75px" />
    <el-table-column prop="value" label="Value"/>
  </el-table>

  <el-button @click="refresh">刷新</el-button>

  <el-tabs type="border-card">
    <el-tab-pane label="插入/修改">
      <el-form label-width="100px">
        <el-form-item label="键" required>
          <el-input v-model="insertForm.key" />
        </el-form-item>
        <el-form-item label="类型" required>
          <el-select v-model="insertForm.type">
            <el-option value="string">string</el-option>
            <el-option value="set">set</el-option>
            <el-option value="hash">hash</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="域" v-if="insertForm.type === 'hash'" required>
          <el-input v-model="insertForm.field" />
        </el-form-item>
        <el-form-item label="值" required>
          <el-input v-model="insertForm.value" />
        </el-form-item>
        <el-form-item label="过期时间(s)">
          <el-input v-model="insertForm.time" placeholder="可选，默认不过期" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :onclick="handleInsert">插入</el-button>
        </el-form-item>
      </el-form>
    </el-tab-pane>
    <el-tab-pane label="修改过期时间">
      <el-form  label-width="100px">
        <el-form-item label="键" required>
          <el-input v-model="changeTimeForm.key"/>
        </el-form-item>
        <el-form-item label="过期时间(s)">
          <el-input v-model="changeTimeForm.time" placeholder="若留空，则永不过期" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :onclick="handleExpire">修改</el-button>
        </el-form-item>
      </el-form>
    </el-tab-pane>
    <el-tab-pane label="删除">
      <el-form label-width="100px">
        <el-form-item label="删除类型" required>
          <el-radio-group v-model="deleteForm.type">
            <el-radio label="key">键</el-radio>
            <el-radio label="field">(Hash)域</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="键" required>
          <el-input v-model="deleteForm.key" />
        </el-form-item>
        <el-form-item label="域" v-if="deleteForm.type === 'field'" required>
          <el-input v-model="deleteForm.field" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :onclick="handleDelete">删除</el-button>
        </el-form-item>
      </el-form>
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>
import { RedisConnector } from '@/scripts/RedisConnector'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

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

async function refreshTimely () {
  await refresh()
  setTimeout(refreshTimely, 750)
}
refreshTimely()

function showMessage (msg: string, type: any) {
  ElMessage({
    message: msg,
    type: type
  })
}

const insertForm = ref({
  key: '',
  type: '',
  field: '',
  value: '',
  time: ''
})

const changeTimeForm = ref({
  key: '',
  time: ''
})

const deleteForm = ref({
  type: 'key',
  key: '',
  field: ''
})

async function handleInsert () {
  const form = insertForm.value
  let re
  try {
    if (form.type === 'string') {
      re = await redisConnector.set(form.key, form.value) as string
    } else if (form.type === 'set') {
      re = await redisConnector.sAdd(form.key, form.value)
    } else {
      re = await redisConnector.hSet(form.key, form.field, form.value)
    }
    if (form.time !== '') {
      await redisConnector.expire(form.key, Number(form.time))
    }
  } catch (_) {
    showMessage('插入失败!', 'error')
    return
  }
  if (typeof re === 'string' && re !== 'OK') {
    showMessage('插入失败!', 'warning')
  } else {
    showMessage('插入成功!', 'success')
  }
  await refresh()
}

async function handleExpire () {
  const form = changeTimeForm.value
  let re
  try {
    if (form.key !== '') {
      if (form.time === '') {
        re = await redisConnector.persist(form.key)
      } else {
        re = await redisConnector.expire(form.key, Number(form.time))
      }
    }
  } catch (_) {
    showMessage('修改过期时间失败!', 'error')
    return
  }
  if (re !== true) {
    showMessage('修改过期时间失败!', 'warning')
  } else {
    showMessage('修改过期时间成功!', 'success')
  }
  await refresh()
}

async function handleDelete () {
  const form = deleteForm.value
  let re
  try {
    if (form.type === 'field') {
      re = await redisConnector.hDel(form.key, form.field)
    } else {
      re = await redisConnector.del(form.key)
    }
  } catch (_) {
    showMessage('删除失败!', 'error')
    return
  }
  if (re !== 1) {
    showMessage('删除失败!', 'warning')
  } else {
    showMessage('删除成功!', 'success')
  }
  await refresh()
}
</script>

<style lang="scss" scoped>

</style>
