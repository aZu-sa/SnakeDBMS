<template>
  <el-container>
    <el-aside width="20%">
      <el-scrollbar>
        <el-menu>
          <el-menu-item index="connect" @click="() => { console.log('show'); DatabaseConnectDialogVisible = true }">
            Connect
          </el-menu-item>
          <el-menu-item :index="index" v-for="(item, index) in databasePool" :key="item" @click="changeDatabaseView(index as number)">
            <el-text>{{ item.label }}</el-text>
          </el-menu-item>
        </el-menu>
      </el-scrollbar>
    </el-aside>

    <el-main>
      <template v-for="(item, index) in databasePool" :key="item">
        <component v-if="InfoVisible[index].value" :is="item.type === 'redis' ? RedisDataDisplay : MySQLPage" :Connector="toRaw(item.connection)"/>
      </template>
    </el-main>
  </el-container>
  <el-dialog v-model="DatabaseConnectDialogVisible">
    <RedisConnectionForm v-on:closeConnectionDialog="closeConnectionDialog"/>
  </el-dialog>
</template>

<script lang="ts" setup>
import { Ref, ref, toRaw } from 'vue'
import RedisDataDisplay from '@/components/redis/RedisDataDisplay.vue'
import MySQLPage from '@/components/mysql/MySQLPage.vue'
import { useStore } from 'vuex'
import RedisConnectionForm from '@/components/forms/ConnectionForm.vue'

const store = useStore()

const databasePool = store.getters.getDatabase
const InfoVisible: Array<Ref<boolean>> = store.getters.getVisible
const DatabaseConnectDialogVisible = ref(false)

// const mysqlConnector = new MysqlConnector({
//   host: 'localhost',
//   port: 3306,
//   user: 'root',
//   password: 'snakedbms',
//   database: 'university',
//   flags: 'INTERACTIVE'
// })
// const redisConnector = await RedisConnector.getInstance({ host: 'localhost', port: 6379, database: 0 })
//
// store.commit('addDatabase', mysqlConnector)
// store.commit('addDatabase', redisConnector)

function closeConnectionDialog () {
  DatabaseConnectDialogVisible.value = false
}

function changeDatabaseView (index: number) {
  store.commit('clearFlag')
  store.commit('setFlag', index)
}

</script>

<style scoped lang="scss">

</style>
