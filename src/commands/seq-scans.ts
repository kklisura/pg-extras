import BaseCommand from '../base-command'
import {defaultExample, defaultUsage, fileName} from '../utils/command'

const COMMAND_NAME = fileName(__filename)

export default class SeqScansCommand extends BaseCommand {
  static description = 'Show the count of sequential scans by table descending by order.'

  static examples = [defaultExample(COMMAND_NAME)]
  static usage = [defaultUsage(COMMAND_NAME)]

  getQuery() {
    return `
      SELECT relname AS name,
             seq_scan as count
      FROM pg_stat_user_tables
      ORDER BY seq_scan DESC;`
  }
}
