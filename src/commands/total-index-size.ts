import BaseCommand from '../base-command'
import {defaultExample, defaultUsage, fileName} from '../utils/command'

const COMMAND_NAME = fileName(__filename)

export default class TotalIndexSizeCommand extends BaseCommand {
  static description = 'Show the total size of all indexes in MB.'

  static examples = [defaultExample(COMMAND_NAME)]
  static usage = [defaultUsage(COMMAND_NAME)]

  getQuery() {
    return `
      SELECT pg_size_pretty(sum(c.relpages::bigint*8192)::bigint) AS size
      FROM pg_class c
      LEFT JOIN pg_namespace n
        ON (n.oid = c.relnamespace)
      WHERE n.nspname NOT IN ('pg_catalog', 'information_schema') AND
            n.nspname !~ '^pg_toast' AND
            c.relkind='i';`
  }
}
