import {flags} from '@oclif/command'
import {QueryConfig} from 'pg'

import BaseCommand, {DEFAULT_CONNECTION_FLAGS} from '../base-command'

import {fileName} from '../utils/command'
import {toInt} from '../utils/data'
import {CALLS_EXAMPLE} from '../utils/examples'
import {assertExtensionPresent, QueryResult, setActiveSchema} from '../utils/postgres'

const COMMAND_NAME = fileName(__filename)

const DEFAULT_LIMIT = 10
const DEFAULT_SCHEMA = 'public'

const PG_STAT_STATEMENTS = 'pg_stat_statements'

export default class CallsCommand extends BaseCommand {
  static description = 'Show most frequently called queries.'

  static examples = [`${COMMAND_NAME} my-schema -U my-name -t`, CALLS_EXAMPLE]
  static usage = [`${COMMAND_NAME} [SCHEMA] [OPTIONS]`]

  static flags = {
    ...DEFAULT_CONNECTION_FLAGS,
    reset: flags.boolean({
      char: 'R',
      description: 'resets the statistics gathered by pg_stat_statements'
    }),
    truncate: flags.boolean({
      char: 't',
      description: 'truncate query'
    }),
    limit: flags.string({
      char: 'l',
      description: 'limit number of output queries',
      helpValue: 'LIMIT',
      default: String(DEFAULT_LIMIT)
    })
  }

  static args = [
    {
      name: 'schema',
      required: false,
      description: 'schema name',
      default: DEFAULT_SCHEMA
    }
  ]

  getClass() {
    return CallsCommand
  }

  async logResults(_: QueryResult, args: any, flags: any) {
    if (flags.reset) {
      this.log(`Statistics on schema ${args.schema} reset successfully.`)
    } else {
      super.logResults(_, args, flags)
    }
  }

  getQuery(_: any, flags: any): QueryConfig {
    if (flags.reset) {
      return {text: 'select pg_stat_statements_reset()', values: []}
    }

    const limit = toInt(flags.limit)

    let truncatedQueryString = flags.truncate
      ? "CASE WHEN length(query) <= 60 THEN query ELSE substr(query, 0, 59) || '…' END"
      : 'query'

    const query = `
      SELECT interval '1 millisecond' * total_time AS total_exec_time,
             to_char((total_time/sum(total_time) OVER()) * 100, 'FM90D0') || '%'  AS prop_exec_time,
             to_char(calls, 'FM999G999G990') AS ncalls,
             interval '1 millisecond' * (blk_read_time + blk_write_time) AS sync_io_time,
             ${truncatedQueryString} AS query
      FROM pg_stat_statements WHERE userid = (SELECT usesysid FROM pg_user WHERE usename = current_user LIMIT 1)
      ORDER BY calls DESC
      LIMIT $1;`

    return {text: query, values: [limit]}
  }

  async beforeRun(args: any) {
    const client = this.getPgClient()

    await setActiveSchema(client, args.schema)
    await assertExtensionPresent(client, args.schema, PG_STAT_STATEMENTS)
  }
}
