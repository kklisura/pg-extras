import BaseCommand from '../base-command'
import {defaultExample, defaultUsage, fileName} from '../utils/command'
import {RECORDS_RANK} from '../utils/examples'

const COMMAND_NAME = fileName(__filename)

export default class RecordsRankCommand extends BaseCommand {
  static description = 'Show all tables and the number of rows in each ordered by number of rows descending.'

  static examples = [defaultExample(COMMAND_NAME), RECORDS_RANK]
  static usage = [defaultUsage(COMMAND_NAME)]

  getQuery() {
    return `
      SELECT
        relname AS name,
        n_live_tup AS estimated_count
      FROM
        pg_stat_user_tables
      ORDER BY
        n_live_tup DESC;`
  }
}
