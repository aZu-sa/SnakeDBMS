<template>
  <el-form :model="ConnectionForm" label-width="100px">
    <el-form-item label="Type:">
      <el-select>
        <el-option
          v-for="item in DatabaseSet"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="Host:">
      <el-input v-model="ConnectionForm.host" placeholder="localhost" />
    </el-form-item>
    <el-form-item label="Port:">
      <el-input v-model="ConnectionForm.port" placeholder="6379" />
    </el-form-item>
    <el-form-item label="User:">
      <el-input v-model="ConnectionForm.user" />
    </el-form-item>
    <el-form-item label="Password:">
      <el-input v-model="ConnectionForm.password" />
    </el-form-item>
    <el-form-item label="Database:">
      <el-input v-model="ConnectionForm.database" placeholder="0" />
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { FormInstance } from 'element-plus'
import { RedisConnectionConfig } from '@/scripts/RedisConnector'

const DatabaseSet = [{ value: 'mysql', label: 'mysql' }, { value: 'redis', label: 'redis' }]
const ConnectionForm: RedisConnectionConfig = reactive({
  host: '',
  port: undefined,
  user: '',
  password: '',
  database: undefined
})

// const props = defineProps({
//   RedisConnectionFormRef: {
//     type: Object
//   }
// })
// const RedisConnectionFormRef = props.RedisConnectionFormRef

const RedisConnectionFormRef = ref<RedisConnectionConfig>()

function onSubmit (redisConnectionForm: FormInstance | undefined) {
  return {}
}

</script>
