import BaseCommand from '../base-command'
import {defaultExample, defaultUsage, fileName} from '../utils/command'
import {QueryResult} from '../utils/postgres'

const COMMAND_NAME = fileName(__filename)

export default class StatsReset extends BaseCommand {
  static description = 'Reset all statistics counters for the current database to zero (requires superuser privileges).'

  static examples = [defaultExample(COMMAND_NAME)]
  static usage = [defaultUsage(COMMAND_NAME)]

  getQuery() {
    return 'SELECT pg_stat_reset()'
  }

  async logResults(_: QueryResult, __: any, flags: any) {
    this.log(`Statistics on database ${flags.dbname} reset successfully.`)
  }
}
