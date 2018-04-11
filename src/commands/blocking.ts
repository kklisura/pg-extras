import BaseCommand from '../base-command'
import {defaultExample, defaultUsage, fileName} from '../utils/command'

const COMMAND_NAME = fileName(__filename)

export default class BlockingCommand extends BaseCommand {
  static description = 'Display queries holding locks other queries are waiting to be released.'

  static examples = [defaultExample(COMMAND_NAME)]
  static usage = [defaultUsage(COMMAND_NAME)]

  getQuery() {
    return `
      SELECT bl.pid AS blocked_pid,
             ka.query AS blocking_statement,
             now() - ka.query_start AS blocking_duration,
             kl.pid AS blocking_pid,
             a.query AS blocked_statement,
             now() - a.query_start AS blocked_duration
     FROM pg_catalog.pg_locks bl
     JOIN pg_catalog.pg_stat_activity a
        ON bl.pid = a.pid
     JOIN pg_catalog.pg_locks kl
     JOIN pg_catalog.pg_stat_activity ka
        ON kl.pid = ka.pid
        ON bl.transactionid = kl.transactionid AND bl.pid != kl.pid
     WHERE NOT bl.granted`
  }
}
