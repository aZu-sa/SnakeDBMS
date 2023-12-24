import { Connection, createConnection } from 'mysql'
import { attrSplicer, conditionSplicer, valuesSplicer } from '@/scripts/Splicer'
import { promisify } from 'util'
import { SpeedRatio } from '@/scripts/SpeedRatio'

export interface MysqlConnectionConfig {
  host?: string,
  port?: number,
  user?: string,
  password?: string,
  database?: string,
  flags?: string
}

interface MysqlMethod {
  select(what: string | Array<string>, from: string, rowFrom: number, rowTo: number, where?: string): Promise<Array<any>>
  insert(into: string, values: Array<Array<string>>, attr?: string | Array<string>): Promise<any>
  delete(from: string, where: string): Promise<any>
  update(table: string, set: Array<string>, where?: string): Promise<any>
  create(table: string, attrs: Array<string>): Promise<any>
  drop(table: string): Promise<any>
  createIndex(indexType: string, indexName: string, on: string, attrs: Array<string>): Promise<any>
  dropIndex(indexName: string, on: string): Promise<any>
  startTransaction(): Promise<any>
  rollback(): Promise<any>
  commit(): Promise<any>
  createUser(userName: string, password: string):Promise<any>
  showProfiles(): Promise<Array<any>>
  showTables(): Promise<any>
  currentDatabase(): Promise<any>
  getTableAttrs(table: string): Promise<Array<any>>
  showIndex(table: string): Promise<Array<any>>
}

export class MysqlConnector implements MysqlMethod {
  private conn: Connection
  private query
  public label!: string

  public constructor (config: MysqlConnectionConfig, label?: string) {
    this.conn = createConnection(config)
    this.conn.connect()
    this.query = promisify(this.conn.query).bind(this.conn)
    if (label === undefined) {
      this.label = `mysql_${config.host}:${config.port}/${config.database}_${config.user}`
    } else {
      this.label = label
    }
  }

  public async close () {
    this.conn.end()
  }

  private async execute (sql: string) {
    return this.query(sql)
  }

  private async Execute (sql: string, speedRatio: SpeedRatio) {
    const query = this.conn.query(sql)
    const resultGroup: any[] = []
    query.on('error', function (err) {
      // console.log('ERROR')
      console.log(err)
    }).on('fields', function (fields) {
      // console.log('FIELDS')
      console.log(fields)
      speedRatio.start()
    }).on('result', function (row) {
      resultGroup.push(row)
      speedRatio.add()
    }).on('end', function () {
      speedRatio.end()
      // console.log(speedRatio.getRatioCounts())
    })
    return resultGroup
  }

  /**
   * SELECT {what} FROM {from} [WHERE {where}] Limit
   */
  public async select (what: string | Array<string>, from: string, rowFrom: number, limit: number, where?: string): Promise<Array<any>> {
    let results: Array<any> = []
    let sql = `SELECT ${attrSplicer(what)} FROM ${from}`
    if (where !== undefined && where.length > 0) {
      sql = `${sql} WHERE ${conditionSplicer(where)}`
    }
    sql = `${sql} LIMIT ${rowFrom}, ${limit};`
    // sql += ';'
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
      console.log(results)
      results = JSON.parse(JSON.stringify(results))
      if (results.Error !== undefined) {
        return 'error'
      }
    } catch (e) {
      console.log(e)
      return 'error'
    }
    return 'success'
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
      if (results.Error !== undefined) {
        return 'error'
      }
    } catch (e) {
      results = 'error'
      console.log(e)
    }
    return results
  }

  /**
   * UPDATE {table} SET {set} [WHERE {where}]
   */
  public async update (table: string, set: Array<string>, where?: string): Promise<any> {
    let results: any
    let sql: string
    sql = `UPDATE ${table} SET ${attrSplicer(set)}`
    if (where !== undefined && where.length > 0) {
      sql = `${sql} WHERE ${conditionSplicer(where)}`
    }
    sql += ';'
    console.log(sql)
    try {
      results = await this.execute(sql)
      // results = JSON.parse(JSON.stringify(results))
      if (results.Error !== undefined) {
        return 'error'
      }
    } catch (e) {
      results = 'error'
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
      if (results.Error !== undefined) {
        return 'error'
      }
    } catch (e) {
      results = 'error'
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
      if (results.Error !== undefined) {
        return 'error'
      }
    } catch (e) {
      console.log(e)
      results = 'error'
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
      if (results.Error !== undefined) {
        return 'error'
      }
    } catch (e) {
      console.log(e)
      results = 'error'
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
      if (results.Error !== undefined) {
        return 'error'
      }
    } catch (e) {
      console.log(e)
      results = 'error'
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
      if (results.Error !== undefined) {
        return 'error'
      }
    } catch (e) {
      console.log(e)
      results = 'error'
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
      if (results.Error !== undefined) {
        return 'error'
      }
    } catch (e) {
      console.log(e)
      results = 'error'
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
      if (results.Error !== undefined) {
        return 'error'
      }
    } catch (e) {
      console.log(e)
      results = 'error'
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
      if (results.Error !== undefined) {
        return 'error'
      }
    } catch (e) {
      console.log(e)
      results = 'error'
    }
    return results
  }

  public async showProfiles (): Promise<Array<any>> {
    let results: Array<any> = []
    try {
      results = await this.execute('show profiles;') as Array<any>
      results = JSON.parse(JSON.stringify(results))
    } catch (e) {
      console.log(e)
      results = ['error']
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
      results = ['error']
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
      results = ['error']
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
      results = ['error']
    }
    return results
  }

  /**
   * SHOW INDEX FROM {table}
   */
  public async showIndex (table: string): Promise<Array<any>> {
    let results: any
    try {
      results = await this.execute(`SHOW INDEX FROM ${table};`)
      results = JSON.parse(JSON.stringify(results))
    } catch (e) {
      console.log(e)
      results = ['error']
    }
    return results
  }

  public async setProfilesOn () {
    let results: any
    try {
      results = await this.execute('SET profiling = 1;')
      results = JSON.parse(JSON.stringify(results))
    } catch (e) {
      console.log(e)
      results = ['error']
    }
    return results
  }
}
