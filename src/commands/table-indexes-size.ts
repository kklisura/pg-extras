import BaseCommand from '../base-command'
import {defaultExample, defaultUsage, fileName} from '../utils/command'

const COMMAND_NAME = fileName(__filename)

export default class TableIndexesSizeCommand extends BaseCommand {
  static description = 'Show the total size of all the indexes on each table, descending by size.'

  static examples = [defaultExample(COMMAND_NAME)]
  static usage = [defaultUsage(COMMAND_NAME)]

  getQuery() {
    return `
      SELECT c.relname AS table,
        pg_size_pretty(pg_indexes_size(c.oid)) AS index_size
      FROM pg_class c
      LEFT JOIN pg_namespace n ON (n.oid = c.relnamespace)
      WHERE n.nspname NOT IN ('pg_catalog', 'information_schema')
      AND n.nspname !~ '^pg_toast'
      AND c.relkind = 'r'
      ORDER BY pg_indexes_size(c.oid) DESC;`
  }
}
