import {flags} from '@oclif/command'
import {QueryConfig} from 'pg'

import BaseCommand, {DEFAULT_CONNECTION_FLAGS} from '../base-command'
import {defaultExample, defaultUsage, fileName} from '../utils/command'
import {UNUSED_INDEXES} from '../utils/examples'

const COMMAND_NAME = fileName(__filename)

export default class UnusedIndexesCommand extends BaseCommand {
  static description = 'Show unused and almost unused indexes.'

  static help = 'Lists unused indexes.'

  static examples = [defaultExample(COMMAND_NAME), UNUSED_INDEXES]
  static usage = [defaultUsage(COMMAND_NAME)]

  static flags = {
    ...DEFAULT_CONNECTION_FLAGS,
    schema: flags.string({
      char: 's',
      description: 'schema',
      helpValue: 'SCHEMA'
    })
  }

  getClass(): typeof BaseCommand {
    return UnusedIndexesCommand
  }

  /**
   * Query source:
   * http://www.databasesoup.com/2014/05/new-finding-unused-indexes-query.html
   * (https://github.com/jberkus) https://gist.github.com/jberkus/6b1bcaf7724dfc2a54f3
   */
  getQuery(_: any, flags: any): QueryConfig {
    let values: any[] = []

    let whereSchema = ''
    if (flags.schema) {
      whereSchema = ' WHERE schemaname = $1 '
      values.push(flags.schema)
    }

    const query = `
      WITH table_scans as (
          SELECT relid,
              tables.idx_scan + tables.seq_scan as all_scans,
              ( tables.n_tup_ins + tables.n_tup_upd + tables.n_tup_del ) as writes,
                      pg_relation_size(relid) as table_size
              FROM pg_stat_user_tables as tables
      ),
      all_writes as (
          SELECT sum(writes) as total_writes
          FROM table_scans
      ),
      indexes as (
          SELECT idx_stat.relid, idx_stat.indexrelid,
              idx_stat.schemaname, idx_stat.relname as tablename,
              idx_stat.indexrelname as indexname,
              idx_stat.idx_scan,
              pg_relation_size(idx_stat.indexrelid) as index_bytes,
              indexdef ~* 'USING btree' AS idx_is_btree
          FROM pg_stat_user_indexes as idx_stat
              JOIN pg_index
                  USING (indexrelid)
              JOIN pg_indexes as indexes
                  ON idx_stat.schemaname = indexes.schemaname
                      AND idx_stat.relname = indexes.tablename
                      AND idx_stat.indexrelname = indexes.indexname
          WHERE pg_index.indisunique = FALSE
      ),
      index_ratios AS (
          SELECT schemaname, tablename, indexname,
              idx_scan, all_scans,
              round(( CASE WHEN all_scans = 0 THEN 0.0::NUMERIC
                          ELSE idx_scan::NUMERIC/all_scans * 100 END),2) as index_scan_pct,
              writes,
              round((CASE WHEN writes = 0 THEN idx_scan::NUMERIC ELSE idx_scan::NUMERIC/writes END),2) as scans_per_write,
              pg_size_pretty(index_bytes) as index_size,
              pg_size_pretty(table_size) as table_size,
              idx_is_btree, index_bytes
          FROM indexes
          JOIN table_scans
          USING (relid)
      ),
      index_groups AS (
        SELECT 'Never Used Indexes' as reason, *, 1 as grp
        FROM index_ratios
        WHERE
            idx_scan = 0
            and idx_is_btree
        UNION ALL
        SELECT 'Low Scans, High Writes' as reason, *, 2 as grp
        FROM index_ratios
        WHERE
            scans_per_write <= 1
            and index_scan_pct < 10
            and idx_scan > 0
            and writes > 100
            and idx_is_btree
        UNION ALL
        SELECT 'Seldom Used Large Indexes' as reason, *, 3 as grp
        FROM index_ratios
        WHERE
            index_scan_pct < 5
            and scans_per_write > 1
            and idx_scan > 0
            and idx_is_btree
            and index_bytes > 100000000
        UNION ALL
        SELECT 'High-Write Large Non-Btree' as reason, index_ratios.*, 4 as grp
        FROM index_ratios, all_writes
        WHERE
            ( writes::NUMERIC / ( total_writes + 1 ) ) > 0.02
            AND NOT idx_is_btree
            AND index_bytes > 100000000
        ORDER BY grp, index_bytes DESC )
      SELECT reason, schemaname AS schema, tablename, indexname,
          index_scan_pct, scans_per_write, index_size, table_size
      FROM index_groups
      ${whereSchema};`

    return {text: query, values}
  }
}
