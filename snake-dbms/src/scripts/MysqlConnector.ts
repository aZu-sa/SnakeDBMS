import { Connection, createConnection } from 'mysql'
import { attrSplicer, conditionSplicer, valuesSplicer } from '@/scripts/Splicer'
import { promisify } from 'util'

interface MysqlConnectionConfig {
  host?: string,
  port?: number,
  user?: string,
  password?: string,
  database?: string
}

interface MysqlMethod {
  select(what: string | Array<string>, from: string, where?: string): Promise<Array<any>>
  insert(into: string, values: Array<Array<string>>, attr?: string | Array<string>): Promise<any>
  delete(from: string, where: string): Promise<any>
  update(table: string, set: Array<string>, where?: Array<string>): Promise<any>
  create(table: string, attrs: Array<string>): Promise<any>
  drop(table: string): Promise<any>
  createIndex(indexType: string, indexName: string, on: string, attrs: Array<string>): Promise<any>
  dropIndex(indexName: string, on: string): Promise<any>
  startTransaction(): Promise<any>
  rollback(): Promise<any>
  commit(): Promise<any>
  createUser(userName: string, password: string):Promise<any>
  showProfiles(): Promise<any>
  showTables(): Promise<any>
  currentDatabase(): Promise<any>
  getTableAttrs(table: string): Promise<Array<any>>
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
  public async select (what: string | Array<string>, from: string, where?: string): Promise<Array<any>> {
    let results: Array<any> = []
    let sql = `SELECT ${attrSplicer(what)} FROM ${from}`
    if (where !== undefined && where.length > 0) {
      sql = `${sql} WHERE ${conditionSplicer(where)}`
    }
    sql += ';'
    console.log(sql)
    try {
      results = await this.execute(sql) as Array<any>
      results = JSON.parse(JSON.stringify(results))
    } catch (e) {
      console.log(e)
      results = ['error']
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
  public async delete (from: string, where: string): Promise<any> {
    let results: any
    const sql = `DELETE FROM ${from} WHERE ${conditionSplicer(where)};`
    console.log(sql)
    try {
      results = await this.execute(sql)
      // results = JSON.parse(JSON.stringify(results))
    } catch (e) {
      results = 'error'
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

  /**
   * CREATE TABLE {table} ( ${attr} )
   */
  public async create (table: string, attrs: Array<string>): Promise<any> {
    let results: any
    const sql = `CREATE TABLE ${table} (${attrSplicer(attrs)});`
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
   * DROP TABLE ${table}
   */
  public async drop (table: string): Promise<any> {
    let results: any
    const sql = `DROP TABLE ${table};`
    try {
      results = await this.execute(sql)
      // results = JSON.parse(JSON.stringify(results))
    } catch (e) {
      console.log(e)
    }
    return results
  }

  /**
   * CREATE {index_type} {index_name} ON {on}({attrs})
   */
  public async createIndex (indexType: string, indexName: string, on: string, attrs: Array<string>): Promise<any> {
    let results: any
    const sql = `CREATE ${indexType} ${indexName} ON ${on}(${attrSplicer(attrs)});`
    try {
      results = await this.execute(sql)
      // results = JSON.parse(JSON.stringify(results))
    } catch (e) {
      console.log(e)
    }
    return results
  }

  /**
   * DROP {index_name} ON {on}
   */
  public async dropIndex (indexName: string, on: string): Promise<any> {
    let results: any
    const sql = `DROP INDEX ${indexName} ON ${on};`
    try {
      results = await this.execute(sql)
      // results = JSON.parse(JSON.stringify(results))
    } catch (e) {
      console.log(e)
    }
    return results
  }

  /**
   * START TRANSACTION
   */
  public async startTransaction () : Promise<any> {
    let results: any
    try {
      results = await this.execute('START TRANSACTION;')
      // results = JSON.parse(JSON.stringify(results))
    } catch (e) {
      console.log(e)
    }
    return results
  }

  /**
   * ROLLBACK
   */
  public async rollback () : Promise<any> {
    let results: any
    try {
      results = await this.execute('ROLLBACK;')
      // results = JSON.parse(JSON.stringify(results))
    } catch (e) {
      console.log(e)
    }
    return results
  }

  /**
   * COMMIT
   */
  public async commit () : Promise<any> {
    let results: any
    try {
      results = await this.execute('COMMIT;')
      // results = JSON.parse(JSON.stringify(results))
    } catch (e) {
      console.log(e)
    }
    return results
  }

  /**
   * CREATE USER {userName}@'%' identified by {password}
   * GRANT ALL PRIVILEGES ON *.* TO {userName}@'%'
   */
  public async createUser (userName: string, password: string):Promise<any> {
    let results: any
    let sql = `CREATE USER '${userName}'@'%' identified by '${password}';`
    try {
      results = await this.execute(sql)
      sql = `GRANT ALL PRIVILEGES ON *.* TO '${userName}'@'%';`
      results = await this.execute(sql)
    } catch (e) {
      console.log(e)
    }
    return results
  }

  public async showProfiles (): Promise<any> {
    let results: any
    try {
      results = await this.execute('SHOW PROFILES;')
      // results = JSON.parse(JSON.stringify(results))
    } catch (e) {
      console.log(e)
    }
    return results
  }

  public async showTables (): Promise<any> {
    let results: any
    try {
      results = await this.execute('SHOW TABLES;')
      results = JSON.parse(JSON.stringify(results))
    } catch (e) {
      console.log(e)
    }
    return results
  }

  public async currentDatabase (): Promise<any> {
    let results: any
    try {
      results = await this.execute('SELECT DATABASE();')
      results = JSON.parse(JSON.stringify(results))
    } catch (e) {
      console.log(e)
    }
    return results
  }

  public async getTableAttrs (table: string): Promise<Array<any>> {
    let results: any
    try {
      results = await this.execute(`SHOW COLUMNS FROM ${table};`)
      results = JSON.parse(JSON.stringify(results))
    } catch (e) {
      console.log(e)
    }
    return results
  }
}
