<template>
  <el-container>
    <el-aside width="20%">
      <el-scrollbar>
        <el-menu v-if="menuRefresh">
          <el-menu-item @click="() => { DatabaseConnectDialogVisible = true }">
            Connect
          </el-menu-item>
          <el-menu-item v-for="(item, index) in databasePool" :key="item" @click="changeDatabaseView(index as number)">
            <el-text>{{ item.label }}</el-text>
          </el-menu-item>
        </el-menu>
      </el-scrollbar>
    </el-aside>

    <el-main v-if="mainRefresh">
      <template v-for="(item, index) in databasePool" :key="item">
        <component v-if="InfoVisible[index].value" :is="item.type === 'redis' ? RedisDataDisplay : MySQLPage" :Connector="toRaw(item.connection)"/>
      </template>
    </el-main>
  </el-container>
  <el-dialog v-model="DatabaseConnectDialogVisible">

    <RedisConnectionForm />
    <el-button @click="async () => { DatabaseConnectDialogVisible = false }">Close</el-button>
  </el-dialog>
</template>

<script lang="ts" setup>
import { Ref, ref, toRaw } from 'vue'
import RedisDataDisplay from '@/components/redis/RedisDataDisplay.vue'
import MySQLPage from '@/components/mysql/MySQLPage.vue'
import { useStore } from 'vuex'
import { RedisConnector } from '@/scripts/RedisConnector'
import { DatabaseConnection } from '@/store'
import RedisConnectionForm from '@/components/forms/ConnectionForm.vue'
import { MysqlConnector } from '@/scripts/MysqlConnector'

const store = useStore()

const databasePool = store.getters.getDatabase
const InfoVisible: Array<Ref<boolean>> = store.getters.getVisible
const DatabaseConnectDialogVisible = ref(false)
const menuRefresh = ref(true)
const mainRefresh = ref(true)

const mysqlConnector = new MysqlConnector({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'snakedbms',
  database: 'university',
  flags: 'INTERACTIVE'
})
const redisConnector = await RedisConnector.getInstance({ host: 'localhost', port: 6379, database: 0 })

store.commit('addDatabase', mysqlConnector)
store.commit('addDatabase', redisConnector)

async function connectDatabase () {
  const redisConnector = await RedisConnector.getInstance({ host: 'localhost', port: 6379, database: 0 })
  if (redisConnector instanceof RedisConnector) {
    store.commit('addDatabase', redisConnector)
    menuRefresh.value = false
  }
  menuRefresh.value = true
}

function changeDatabaseView (index: number) {
  mainRefresh.value = false
  console.log(`change to db.${index}`)
  store.commit('clearFlag')
  store.commit('setFlag', index)
  console.log(InfoVisible)
  mainRefresh.value = true
}

</script>

<style scoped lang="scss">

</style>
