import BaseCommand from '../base-command'
import {defaultExample, defaultUsage, fileName} from '../utils/command'
import {CACHE_HIT_EXAMPLE} from '../utils/examples'

const COMMAND_NAME = fileName(__filename)

export default class CacheHitCommand extends BaseCommand {
  static description = 'Show index and table hit rate.'

  static examples = [defaultExample(COMMAND_NAME), CACHE_HIT_EXAMPLE]
  static usage = [defaultUsage(COMMAND_NAME)]

  getQuery() {
    return `
      SELECT
        'index hit rate' AS name,
        (sum(idx_blks_hit)) / nullif(sum(idx_blks_hit + idx_blks_read),0) AS ratio
      FROM pg_statio_user_indexes
      UNION ALL
      SELECT
       'table hit rate' AS name,
        sum(heap_blks_hit) / nullif(sum(heap_blks_hit) + sum(heap_blks_read),0) AS ratio
      FROM pg_statio_user_tables;`
  }
}
