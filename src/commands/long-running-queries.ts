import BaseCommand from '../base-command'
import {defaultExample, defaultUsage, fileName} from '../utils/command'

const COMMAND_NAME = fileName(__filename)

export default class LongRunningCommands extends BaseCommand {
  static description = 'Show all queries longer than five minutes by descending duration.'

  static examples = [defaultExample(COMMAND_NAME)]
  static usage = [defaultUsage(COMMAND_NAME)]

  getQuery() {
    return `
      SELECT
        pid,
        now() - pg_stat_activity.query_start AS duration,
        query AS query
      FROM
        pg_stat_activity
      WHERE
        pg_stat_activity.query <> ''::text
        AND state <> 'idle'
        AND now() - pg_stat_activity.query_start > interval '5 minutes'
      ORDER BY
        now() - pg_stat_activity.query_start DESC;`
  }
}
