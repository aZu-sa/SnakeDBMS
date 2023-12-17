import { Connection, createConnection } from 'mysql'

interface MysqlConnectionConfig {
  host?: string,
  port?: number,
  user?: string,
  password?: string,
  database?: string
}

interface MysqlMethod {
  select(what: string | Array<string>, from: string, where: Array<string>): Array<any>
}

export class MysqlConnector implements MysqlMethod {
  private conn: Connection

  public constructor (config: MysqlConnectionConfig) {
    this.conn = createConnection(config)
    this.conn.connect()
  }

  private execute (sql: string, callback?:(err?: any, res?: any)=>void) {
    this.conn.query(sql, callback)
  }

  /**
   * SELECT {what} FROM {from} [WHERE {where}]
   */
  public select (what: string | Array<string>, from: string, where: string | Array<string>): Array<any> {

    return []
  }
}
