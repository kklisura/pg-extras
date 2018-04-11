import BaseCommand from '../base-command'
import {defaultExample, defaultUsage, fileName} from '../utils/command'

const COMMAND_NAME = fileName(__filename)

export default class UserConnectionsCommand extends BaseCommand {
  static description = 'Number of connections per credential.'

  static examples = [defaultExample(COMMAND_NAME)]
  static usage = [defaultUsage(COMMAND_NAME)]

  getQuery() {
    return 'SELECT usename, COUNT(*) AS "connection_count" FROM pg_stat_activity GROUP BY usename'
  }
}
