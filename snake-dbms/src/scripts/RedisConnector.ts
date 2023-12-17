import { createClient } from 'redis'
import { RedisClientType } from '@redis/client'

import { toRedisConnectUrl } from '@/scripts/formatTools'

export interface RedisConnectionConfig {
  host?: string,
  port?: number,
  user?: string,
  password?: string,
  database?: number
}

interface RedisMethod {
  get(key: string): Promise<any>
}

const defaultRedisConnectionConfig: RedisConnectionConfig = {
  host: 'localhost',
  port: 6379
}

export class RedisConnector implements RedisMethod {
  private client!: RedisClientType<any>

  static async getInstance (config?: RedisConnectionConfig) {
    if (config === undefined) {
      config = defaultRedisConnectionConfig
    }
    const instance = Object.create(RedisConnector.prototype)
    instance.client = await createClient({ url: toRedisConnectUrl(config) })
      .on('error', err => console.log(err))
      .connect()
    return instance
  }

  async close () {
    await this.client.disconnect()
  }

  public async get (key: string) {
    return await this.client.get(key)
  }
}
