import { createStore } from 'vuex'
import { reactive, Ref, ref } from 'vue'
import { MysqlConnector } from '@/scripts/MysqlConnector'
import { RedisConnector } from '@/scripts/RedisConnector'

export interface DatabaseConnection {
  type: 'mysql' | 'redis'
  connection: MysqlConnector | RedisConnector,
  label: string
}

export default createStore({
  state: {
    DatabaseConnectionPool: reactive<DatabaseConnection[]>([]),
    AsideVisibleFlag: Array<Ref<boolean>>()
  },
  getters: {
    getDatabase: (state) => {
      return state.DatabaseConnectionPool
    },
    getVisible: (state) => {
      return state.AsideVisibleFlag as Array<Ref<boolean>>
    }
  },
  mutations: {
    addDatabase: (state, databaseConnector: MysqlConnector | RedisConnector) => {
      if (state.DatabaseConnectionPool === undefined) {
        state.DatabaseConnectionPool = []
      }
      if (databaseConnector instanceof MysqlConnector) {
        state.DatabaseConnectionPool.push({ type: 'mysql', connection: databaseConnector, label: 'mysql' })
      } else {
        state.DatabaseConnectionPool.push({ type: 'redis', connection: databaseConnector, label: databaseConnector.label })
      }
      if (state.AsideVisibleFlag === undefined) {
        state.AsideVisibleFlag = []
      }
      state.AsideVisibleFlag.push(ref(false))
    },
    clearFlag: (state) => {
      for (const index in state.AsideVisibleFlag) {
        state.AsideVisibleFlag[index].value = false
      }
    },
    setFlag: (state, index) => {
      console.log(`set ${index}`)
      state.AsideVisibleFlag[index].value = true
    }
  },
  actions: {
  },
  modules: {
  }
})
