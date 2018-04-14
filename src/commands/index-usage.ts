import BaseCommand from '../base-command'
import {defaultExample, defaultUsage, fileName} from '../utils/command'
import {INDEX_USAGE} from '../utils/examples'

const COMMAND_NAME = fileName(__filename)

export default class IndexUsageCommand extends BaseCommand {
  static description = 'Calculates your index hit rate (effective databases are at 99% and up).'

  static examples = [defaultExample(COMMAND_NAME), INDEX_USAGE]
  static usage = [defaultUsage(COMMAND_NAME)]

  getQuery() {
    return `
      SELECT
        schemaname AS schema,
        relname AS name,
        CASE idx_scan
          WHEN 0 THEN 'Insufficient data'
          ELSE (100 * idx_scan / (seq_scan + idx_scan))::text
        END percent_of_times_index_used,
        n_live_tup rows_in_table
      FROM
        pg_stat_user_tables
      ORDER BY
        n_live_tup DESC;`
  }
}
