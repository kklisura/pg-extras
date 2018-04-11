import BaseCommand from '../base-command'
import {defaultExample, defaultUsage, fileName} from '../utils/command'

const COMMAND_NAME = fileName(__filename)

export default class UnusedIndexesCommand extends BaseCommand {
  static description = 'Show unused and almost unused indexes.'

  static help = `Ordered by their size relative to the number of index scans.
Exclude indexes of very small tables (less than 5 pages),
where the planner will almost invariably select a sequential scan,
but may not in the future as the table grows`

  static examples = [defaultExample(COMMAND_NAME)]
  static usage = [defaultUsage(COMMAND_NAME)]

  getQuery() {
    return `
      SELECT
        schemaname AS schema,
        relname AS table,
        indexrelname AS index,
        pg_size_pretty(pg_relation_size(i.indexrelid)) AS index_size,
        idx_scan as index_scans
      FROM pg_stat_user_indexes ui
      JOIN pg_index i ON ui.indexrelid = i.indexrelid
      WHERE NOT indisunique AND idx_scan < 50 AND pg_relation_size(relid) > 5 * 8192
      ORDER BY pg_relation_size(i.indexrelid) / nullif(idx_scan, 0) DESC NULLS FIRST,
      pg_relation_size(i.indexrelid) DESC;`
  }
}
