<template>
  <RedisConnectionForm />
  <RedisDataDisplay :redis-connector="redisConnector"></RedisDataDisplay>
  <el-text v-if="ratio">speed:{{ ratio }}</el-text>
<!--  <p></p>-->
<!--  <el-text v-if="perRef">read: {{ perRef }}</el-text>-->
</template>

<script lang="ts" setup>
import RedisDataDisplay from '@/components/redis/RedisDataDisplay.vue'
// import RedisConnectionForm from '@/components/forms/RedisConnectionForm.vue'
import { RedisConnector } from '@/scripts/RedisConnector'
import { MysqlConnector } from '@/scripts/MysqlConnector'
import { SpeedRatio } from '@/scripts/SpeedRatio'

const mysqlConnector = new MysqlConnector({ user: 'root', password: 'snakedbms', database: 'store', host: '10.242.62.167', port: 3306 })
const redisConnector = RedisConnector.getInstance({ host: '10.242.62.167' })

const speedRatio = new SpeedRatio(1000)
const ratio = speedRatio.getRatio()

const query = mysqlConnector.conn.query('SELECT * FROM sell')
query.on('error', function (err) {
  console.log('ERROR')
  console.log(err)
}).on('fields', function (fields) {
  console.log('FIELDS')
  console.log(fields)
  speedRatio.start()
}).on('result', function (row) {
  speedRatio.add()
}).on('end', function () {
  speedRatio.end()
  console.log(speedRatio.getRatioCounts())
})

</script>
