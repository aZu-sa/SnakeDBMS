import { Connection, createConnection } from 'mysql'
import { attrSplicer, conditionSplicer } from '@/scripts/Splicer'
import { promisify } from 'util'

interface MysqlConnectionConfig {
  host?: string,
  port?: number,
  user?: string,
  password?: string,
  database?: string
}

interface MysqlMethod {
  select(what: string | Array<string>, from: string, where?: Array<string>): Promise<Array<any>>
}

export class MysqlConnector implements MysqlMethod {
  private conn: Connection
  private query

  public constructor (config: MysqlConnectionConfig) {
    this.conn = createConnection(config)
    this.conn.connect()
    this.query = promisify(this.conn.query).bind(this.conn)
  }

  private async execute (sql: string) {
    return this.query(sql)
  }

  /**
   * SELECT {what} FROM {from} [WHERE {where}]
   */
  public async select (what: string | Array<string>, from: string, where?: string | Array<string>): Promise<Array<any>> {
    let results: Array<any> = []
    let sql = `SELECT ${attrSplicer(what)} FROM ${from}`
    if (typeof where !== 'undefined') {
      sql = `${sql} WHERE ${conditionSplicer(where)}`
    }
    sql += ';'
    try {
      results = await this.execute(sql) as Array<any>
      results = JSON.parse(JSON.stringify(results))
    } catch (e) {
      console.log(e)
    }
    return results
  }
}