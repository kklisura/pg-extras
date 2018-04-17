import {Command, flags} from '@oclif/command'
import {factory as aciiTableFactory} from 'ascii-table'
import * as moment from 'moment'
import * as momentDurationFormatSetup from 'moment-duration-format'
import {QueryConfig} from 'pg'
import * as PostgresInterval from 'postgres-interval'

import {isString, stripNewLines} from './utils/data'
import {
  Client,
  connect,
  DEFAULT_DBNAME,
  DEFAULT_HOST,
  DEFAULT_PORT,
  DEFAULT_USERNAME,
  query,
  QueryResult
} from './utils/postgres'

// Initialize moment duration
momentDurationFormatSetup(moment)

/**
 * Default connection flags for all commands.
 */
export const DEFAULT_CONNECTION_FLAGS: any = {
  host: flags.string({
    char: 'h',
    description: 'database server host',
    helpValue: 'HOST',
    default: DEFAULT_HOST
  }),
  port: flags.string({
    char: 'p',
    description: 'database server host',
    helpValue: 'PORT',
    default: String(DEFAULT_PORT)
  }),
  dbname: flags.string({
    char: 'd',
    description: 'database name',
    helpValue: 'DBNAME',
    default: DEFAULT_DBNAME
  }),
  username: flags.string({
    char: 'U',
    description: 'user name',
    helpValue: 'USERNAME',
    default: DEFAULT_USERNAME
  })
}

/**
 * Connection command flags, default flags present on all commands.
 */
export interface ConnectionCommandFlags {
  host: string
  port: number
  dbname: string
  username: string
}

/**
 * Table interface.
 */
export interface Table {
  toString(): string
}

/**
 * Base command for all other commands.
 */
export default abstract class BaseCommand extends Command {
  /**
   * Override getClass method when adding new flags.
   */
  static flags = {
    ...DEFAULT_CONNECTION_FLAGS
  }

  private client?: Client

  /**
   * Returns a query given command args and flag.s
   *
   * @param args Command arguments.
   * @param flags Command flags.
   */
  abstract getQuery(args: any, flags: any): string | QueryConfig

  // tslint:disable-next-line:no-unused
  beforeRun(args: any, flags: any): void {}

  /**
   * Returns a pg client.
   */
  getPgClient(): Client {
    if (!this.client) {
      throw new Error('Postgre client not created.')
    }

    return this.client
  }

  /**
   * Returns a child class.
   */
  getClass(): typeof BaseCommand {
    return BaseCommand
  }

  /**
   * Runs this command.
   */
  async run() {
    const {flags, args} = this.parse(this.getClass())

    const connectionFlags = this.getConnectionCommandFlags(flags)
    this.client = await this.pgConnect(connectionFlags)

    await this.beforeRun(args, flags)

    const queryResult = await this.pgQuery(this.client, this.getQuery(args, flags))
    this.logResults(queryResult, args, flags)
  }

  /**
   * Logs the result.
   *
   * @param queryResult Query result.
   */
  // tslint:disable-next-line:no-unused
  async logResults(queryResult: QueryResult, args: any, flags: any) {
    this.log(this.queryResultToTable(queryResult).toString())
  }

  /**
   * Called before exiting.
   *
   * @param error Error.
   */
  async finally(error: Error) {
    super.finally(error)

    if (this.client) {
      await this.client.end()
    }
  }

  /**
   * Returns connection command flags from flag.s
   *
   * @param flags Command flags.
   */
  getConnectionCommandFlags(flags: any): ConnectionCommandFlags {
    return {
      host: flags.host,
      port: flags.port,
      dbname: flags.dbname,
      username: flags.username
    }
  }

  /**
   * Connects to a postgres.
   *
   * @param flags Connection flags
   */
  async pgConnect(flags: ConnectionCommandFlags): Promise<Client> {
    try {
      return await connect(flags.host, flags.port, flags.dbname, flags.username)
    } catch (error) {
      throw new Error('Failed connecting to database: ' + error.message)
    }
  }

  /**
   * Executes a query.
   *
   * @param client Client.
   * @param queryString Query string or query object.
   */
  async pgQuery(client: Client, queryString: string | QueryConfig): Promise<QueryResult> {
    try {
      return await query(client, queryString)
    } catch (error) {
      throw new Error('Failed executing query: ' + error.message)
    }
  }

  /**
   * Formats a query response to a table.
   *
   * @param response Query response.
   */
  queryResultToTable(response: QueryResult): Table {
    const heading: Array<string> = response.fields.map((field: any) => field.name)

    const intervalTypesIndices: any = {}

    let rows = response.rows.map(row => {
      return heading.map((heading: string, index: number) => {
        const value = row[heading] || ''

        if (value instanceof PostgresInterval) {
          intervalTypesIndices[index] = true
          return moment.duration(value.toISO()).format('hh [hrs], mm [min], ss [secs], SSS [millis]')
        }
        if (isString(value)) {
          return stripNewLines(value).trim()
        }

        return value
      })
    })

    const table = aciiTableFactory({heading, rows})
    if (!rows.length) {
      table.__maxCells = heading.length
    }

    Object.keys(intervalTypesIndices).forEach(index => table.setAlignRight(index))

    return table
  }
}
