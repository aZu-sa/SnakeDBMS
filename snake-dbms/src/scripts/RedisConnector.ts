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

interface AttributeAddableObject {
  [key: string]: any
}

type Options = 'NX' | 'XX'

interface RedisBaseMethod {
  ping(): Promise<any>
  select(db: number): Promise<any>
  dbSize(): Promise<any>
  flushDb(): Promise<any>
  flushAll(): Promise<any>
}

interface RedisKeyMethod {
  keys(pattern: string): Promise<any>
  exists(key: string): Promise<any>
  del(...keys: string[]): Promise<any>
  type(key: string): Promise<any>
  expire(key: string, ex: number): Promise<any>
  ttl(key: string): Promise<any>
}

interface RedisStringMethod {
  get(key: string): Promise<any>
  set(key: string, value: string | number, ex?: number, opt?: Options): Promise<any>
}

interface RedisHashMethod {
  hGet(key: string, field: string): Promise<any>
  hSet(key: string, field: string, value: string | number): Promise<any>
  hGetAll(key: string): Promise<any>
  hSetNX(key: string, field: string, value: string | number): Promise<any>
  hDel(key: string, field: string): Promise<any>
  hExists(key: string, field: string): Promise<any>
  hKeys(key: string): Promise<any>
  hVals(key: string): Promise<any>
}

interface RedisSetMethod {
  sAdd(key: string, value: string | number): Promise<any>
  sMembers(key: string): Promise<any>
}

const defaultRedisConnectionConfig: RedisConnectionConfig = {
  host: 'localhost',
  port: 6379
}

export class RedisConnector implements RedisBaseMethod, RedisKeyMethod, RedisStringMethod, RedisHashMethod, RedisSetMethod {
  private client!: RedisClientType<any>

  static async getInstance (config?: RedisConnectionConfig) {
    if (config === undefined) {
      config = defaultRedisConnectionConfig
    }
    const instance = Object.create(RedisConnector.prototype)
    try {
      instance.client = await createClient({ url: toRedisConnectUrl(config) })
        .connect()
    } catch (_) {
      return null
    }
    return instance
  }

  async close () {
    await this.client.disconnect()
  }

  // RedisBaseMethod
  public async ping(): Promise<any> {
    return await this.client.ping()
  }
  public async select(db: number): Promise<any> {
    return await this.client.select(db)
  }
  public async dbSize(): Promise<any> {
    return await this.client.dbSize()
  }
  public async flushDb(): Promise<any> {
    return await this.client.flushDb()
  }
  public async flushAll(): Promise<any> {
    return await this.client.flushAll()
  }

  // RedisKeyMethod
  public async del(...keys: string[]): Promise<any> {
    return await this.client.del(keys)
  }

  public async exists(key: string): Promise<any> {
    return await this.client.exists(key)
  }

  public async expire(key: string, ex: number): Promise<any> {
    return await this.client.expire(key, ex)
  }

  public async keys(pattern: string): Promise<any> {
    return await this.client.keys(pattern)
  }

  public async ttl(key: string): Promise<any> {
    return await this.client.ttl(key)
  }

  public async type(key: string): Promise<any> {
    return await this.client.type(key)
  }

  // RedisStringMethod
  public async get (key: string) {
    return await this.client.get(key)
  }

  public async set(key: string, value: string | number, ex?: number, opt?: Options): Promise<any> {
    let RedisQueryOptions: AttributeAddableObject = {}
    if (ex !== undefined) {
      RedisQueryOptions['EX'] = ex
    }
    if (opt !== undefined) {
      switch (opt) {
        case 'NX':
          RedisQueryOptions['NX'] = true
          break
        case 'XX':
          RedisQueryOptions['XX'] = true
          break
      }
    }
    return await this.client.set(key, value, RedisQueryOptions)
  }

  // RedisHashMethod
  public async hDel(key: string, field: string): Promise<any> {
    return await this.client.hDel(key, field)
  }

  public async hExists(key: string, field: string): Promise<any> {
    return await this.client.hExists(key, field)
  }

  public async hGet(key: string, field: string): Promise<any> {
    return await this.client.hGet(key, field)
  }

  public async hGetAll(key: string): Promise<any> {
    return await this.client.hGetAll(key)
  }

  public async hKeys(key: string): Promise<any> {
    return await this.client.hKeys(key)
  }

  public async hSet(key: string, field: string, value: string | number): Promise<any> {
    return await this.client.hSet(key, field, value)
  }

  public async hSetNX(key: string, field: string, value: string | number): Promise<any> {
    if (typeof value === 'number') {
      value = value.toString()
    }
    return await this.client.hSetNX(key, field, value)
  }

  public async hVals(key: string): Promise<any> {
    return await this.client.hVals(key)
  }

  // RedisSetMethod
  public async sAdd(key: string, value: string | number): Promise<any> {
    if (typeof value === 'number') {
      value = value.toString()
    }
    return await this.client.sAdd(key, value)
  }

  public async sMembers(key: string): Promise<any> {
    return await this.client.sMembers(key)
  }
}