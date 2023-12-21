<template>
  <el-form label-width="100px" @change="display">
    <el-form-item label="Type:">
      <el-radio-group v-model="ConnectionForm.type">
        <el-radio-button label="mysql"/>
        <el-radio-button label="redis"/>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="Name:">
      <el-input v-model="ConnectionForm.name" :placeholder="defaultNameDisplay()"/>
    </el-form-item>
    <el-form-item label="Host:">
      <el-input v-model="ConnectionForm.host" placeholder="localhost"/>
    </el-form-item>
    <el-form-item label="Port:">
      <el-input v-model="ConnectionForm.port" :placeholder="defaultPortDisplay()"/>
    </el-form-item>
    <el-form-item label="User:">
      <el-input v-model="ConnectionForm.user" :placeholder="defaultUserDisplay()"/>
    </el-form-item>
    <el-form-item label="Password:">
      <el-input v-model="ConnectionForm.password"/>
    </el-form-item>
    <el-form-item label="Database:" required>
      <el-input v-model="ConnectionForm.database" :placeholder="defaultDatabaseDisplay()"/>
    </el-form-item>
  </el-form>
  <el-button @click="connect()">连接</el-button>
  <el-button @click="() => { emits('closeConnectionDialog') }">关闭</el-button>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { RedisConnectionConfig, RedisConnector } from '@/scripts/RedisConnector'
import { MysqlConnectionConfig, MysqlConnector } from '@/scripts/MysqlConnector'
import { useStore } from 'vuex'

const emits = defineEmits(['closeConnectionDialog'])

const store = useStore()

function showMessage (msg: string, type: any) {
  ElMessage({
    message: msg,
    type: type
  })
}

const defaultMysqlConnectionConfig: MysqlConnectionConfig = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: '',
  flags: 'INTERACTIVE'
}

const defaultRedisConnectionConfig: RedisConnectionConfig = {
  host: 'localhost',
  port: 6379,
  user: '',
  password: '',
  database: 0
}

const ConnectionForm = reactive({
  name: undefined,
  type: undefined,
  host: undefined,
  port: undefined,
  user: undefined,
  password: undefined,
  database: undefined
})

function clearConnectionForm () {
  ConnectionForm.name = undefined
  ConnectionForm.type = undefined
  ConnectionForm.host = undefined
  ConnectionForm.port = undefined
  ConnectionForm.user = undefined
  ConnectionForm.password = undefined
  ConnectionForm.database = undefined
}

function defaultNameDisplay () {
  if (ConnectionForm.type === undefined) {
    return ''
  } else if (ConnectionForm.type === 'mysql') {
    return 'mysql'
  } else {
    return 'redis'
  }
}

function defaultPortDisplay () {
  if (ConnectionForm.type === undefined) {
    return ''
  } else if (ConnectionForm.type === 'mysql') {
    return '3306'
  } else {
    return '6379'
  }
}

function defaultUserDisplay () {
  if (ConnectionForm.type === undefined) {
    return ''
  } else if (ConnectionForm.type === 'mysql') {
    return 'root'
  } else {
    return ''
  }
}

function defaultDatabaseDisplay () {
  if (ConnectionForm.type === undefined) {
    return ''
  } else if (ConnectionForm.type === 'mysql') {
    return ''
  } else {
    return '0'
  }
}

function formConfig (): MysqlConnectionConfig | RedisConnectionConfig | undefined {
  const type = ConnectionForm.type as string | undefined
  if (type === 'mysql') {
    return {
      host: ConnectionForm.host === undefined ? defaultMysqlConnectionConfig.host : ConnectionForm.host,
      port: ConnectionForm.port === undefined ? defaultMysqlConnectionConfig.port : ConnectionForm.port,
      user: ConnectionForm.user === undefined ? defaultMysqlConnectionConfig.user : ConnectionForm.user,
      password: ConnectionForm.password === undefined ? defaultMysqlConnectionConfig.password : ConnectionForm.password,
      database: ConnectionForm.database === undefined ? defaultMysqlConnectionConfig.database : ConnectionForm.database,
      flags: defaultMysqlConnectionConfig.flags
    }
  } else if (type === 'redis') {
    return {
      host: ConnectionForm.host === undefined ? defaultRedisConnectionConfig.host : ConnectionForm.host,
      port: ConnectionForm.port === undefined ? defaultRedisConnectionConfig.port : ConnectionForm.port,
      user: ConnectionForm.user === undefined ? defaultRedisConnectionConfig.user : ConnectionForm.user,
      password: ConnectionForm.password === undefined ? defaultRedisConnectionConfig.password : ConnectionForm.password,
      database: ConnectionForm.database === undefined ? defaultRedisConnectionConfig.database : ConnectionForm.database
    }
  } else {
    showMessage('数据库类型未选择或有误!', 'error')
    return undefined
  }
}

async function connect () {
  const connectionConfig = formConfig()
  if (connectionConfig === undefined) {
    return
  }
  let connector
  try {
    if (ConnectionForm.type === 'mysql' as unknown as undefined) {
      connector = new MysqlConnector(connectionConfig as MysqlConnectionConfig, ConnectionForm.name)
    } else {
      connector = await RedisConnector.getInstance(connectionConfig as RedisConnectionConfig, ConnectionForm.name)
    }
  } catch (_) {
    showMessage('数据库连接失败! 请检查连接参数或网络连接!', 'error')
    return
  }
  if (connector instanceof MysqlConnector || connector instanceof RedisConnector) {
    store.commit('addDatabase', connector)
    showMessage('数据库连接成功!', 'success')
    emits('closeConnectionDialog')
    clearConnectionForm()
  } else {
    showMessage('数据库连接失败! 请检查连接参数或网络连接!', 'error')
  }
}

function display () {
  console.log(ConnectionForm)
}
</script>
