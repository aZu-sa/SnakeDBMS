import { Connection, createConnection } from 'mysql'
import { attrSplicer, conditionSplicer, splicer, valuesSplicer } from '@/scripts/Splicer'
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
  insert(into: string, values: Array<Array<string>>, attr?: string | Array<string>): Promise<any>
  delete(from: string, where: Array<string>): Promise<any>
  update(table: string, set: Array<string>, where?: Array<string>): Promise<any>
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
    if (where !== undefined) {
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

  /**
   * INSERT INTO {into} [({attr})] VALUES {values}
   */
  public async insert (into: string, values: Array<Array<string>>, attr?: Array<string>): Promise<any> {
    let sql: string
    let results: any
    sql = `INSERT INTO ${into}`
    if (attr !== undefined) {
      sql = `${sql}(${attrSplicer(attr)}) VALUES ${valuesSplicer(values)};`
    } else {
      sql = `${sql} VALUES ${values};`
    }
    console.log(sql)
    try {
      results = await this.execute(sql)
      // results = JSON.parse(JSON.stringify(results))
    } catch (e) {
      console.log(e)
    }
    return results
  }

  /**
   * DELETE FROM {from} WHERE {where}
   */
  public async delete (from: string, where: Array<string>): Promise<any> {
    let results: any
    const sql = `DELETE FROM ${from} WHERE ${conditionSplicer(where)};`
    console.log(sql)
    try {
      results = await this.execute(sql)
      // results = JSON.parse(JSON.stringify(results))
    } catch (e) {
      console.log(results)
      console.log(e)
    }
    return results
  }

  /**
   * UPDATE {table} SET {set} [WHERE {where}]
   */
  public async update (table: string, set: Array<string>, where?: Array<string>): Promise<any> {
    let results: any
    let sql: string
    const valueArr = []
    sql = `UPDATE ${table} SET ${conditionSplicer(set)}`
    if (where !== undefined) {
      sql = `${sql} WHERE ${conditionSplicer(where)}`
    }
    sql += ';'
    try {
      results = await this.execute(sql)
      // results = JSON.parse(JSON.stringify(results))
    } catch (e) {
      console.log(e)
    }
    return results
  }
}
