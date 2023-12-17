import { Connection, createConnection } from 'mysql'
import { promisify } from 'util'

interface MysqlConnectionConfig {
  host?: string,
  port?: number,
  user?: string,
  password?: string,
  database?: string
}

interface MysqlMethod {
  select(what: string | Array<string>, from: string, where: Array<string>): Promise<Array<any>>
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
  public async select (what: string | Array<string>, from: string, where: string | Array<string>): Promise<Array<any>> {
    let results: Array<any> = []
    try {
      results = await this.execute('SELECT * FROM username') as Array<any>
    } catch (e) {
      console.log(e)
    }
    return results
  }
}
