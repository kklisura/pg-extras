import {flags} from '@oclif/command'
import {QueryConfig} from 'pg'

import BaseCommand, {DEFAULT_CONNECTION_FLAGS} from '../base-command'
import {defaultUsage, fileName} from '../utils/command'
import {toInt} from '../utils/data'

const COMMAND_NAME = fileName(__filename)

const DEFAULT_LIMIT = 10
const DEFAULT_BLOAT_TYPE = 'both'

const SUPPORTED_BLOAT_TYPES = ['index', 'table', 'both']

export default class BloatCommand extends BaseCommand {
  static description = 'Show table and index bloat in your database ordered by most wasteful.'

  static examples = [
    `${COMMAND_NAME} --type index --limit 20 --schema myschema`,
    `${COMMAND_NAME} --type table --schema myschema`,
    `${COMMAND_NAME} --schema myschema`,
    `${COMMAND_NAME}`
  ]
  static usage = [defaultUsage(COMMAND_NAME)]

  static flags = {
    ...DEFAULT_CONNECTION_FLAGS,
    type: flags.enum({
      char: 't',
      description: `bloat type, one of (${SUPPORTED_BLOAT_TYPES.join('|')})`,
      helpValue: 'TYPE',
      default: DEFAULT_BLOAT_TYPE,
      options: SUPPORTED_BLOAT_TYPES
    }),
    limit: flags.string({
      char: 'l',
      description: 'limit number of output items',
      helpValue: 'LIMIT',
      default: String(DEFAULT_LIMIT)
    }),
    schema: flags.string({
      char: 's',
      description: 'schema',
      helpValue: 'SCHEMA'
    })
  }

  getClass(): typeof BaseCommand {
    return BloatCommand
  }

  getQuery(_: any, flags: any): QueryConfig {
    const values: any[] = []
    const valuesIndex = () => '$' + (values.length + 1)

    let bloat = ''

    let whereSchema = ''

    if (flags.schema) {
      whereSchema = `WHERE schemaname = ${valuesIndex()}`
      values.push(flags.schema)
    }

    if (isTableBloat(flags.type)) {
      bloat += `
        SELECT
          'table' as type,
          schemaname,
          tablename as object_name,
          ROUND(CASE WHEN otta=0 THEN 0.0 ELSE table_bloat.relpages/otta::numeric END,1) AS bloat,
          CASE WHEN relpages < otta THEN '0' ELSE (bs*(table_bloat.relpages-otta)::bigint)::bigint END AS raw_waste
        FROM
          table_bloat`
    }

    if (isIndexBloat(flags.type)) {
      if (bloat) {
        bloat += ' UNION '
      }

      bloat += `
        SELECT
          'index' as type,
          schemaname,
          tablename || '::' || iname as object_name,
          ROUND(CASE WHEN iotta=0 OR ipages=0 THEN 0.0 ELSE ipages/iotta::numeric END,1) AS bloat,
          CASE WHEN ipages < iotta THEN '0' ELSE (bs*(ipages-iotta))::bigint END AS raw_waste
        FROM
          index_bloat`
    }

    const query = `
      WITH constants AS (
        SELECT current_setting('block_size')::numeric AS bs, 23 AS hdr, 4 AS ma
      ), bloat_info AS (
        SELECT
          ma,bs,schemaname,tablename,
          (datawidth+(hdr+ma-(case when hdr%ma=0 THEN ma ELSE hdr%ma END)))::numeric AS datahdr,
          (maxfracsum*(nullhdr+ma-(case when nullhdr%ma=0 THEN ma ELSE nullhdr%ma END))) AS nullhdr2
        FROM (
          SELECT
            schemaname, tablename, hdr, ma, bs,
            SUM((1-null_frac)*avg_width) AS datawidth,
            MAX(null_frac) AS maxfracsum,
            hdr+(
              SELECT 1+count(*)/8
              FROM pg_stats s2
              WHERE null_frac<>0 AND s2.schemaname = s.schemaname AND s2.tablename = s.tablename
            ) AS nullhdr
          FROM pg_stats s, constants
          GROUP BY 1,2,3,4,5
        ) AS foo
      ), table_bloat AS (
        SELECT
          schemaname, tablename, cc.relpages, bs,
          CEIL((cc.reltuples*((datahdr+ma-
            (CASE WHEN datahdr%ma=0 THEN ma ELSE datahdr%ma END))+nullhdr2+4))/(bs-20::float)) AS otta
        FROM bloat_info
        JOIN pg_class cc ON cc.relname = bloat_info.tablename AND cc.reltype <> 0
        JOIN pg_namespace nn ON cc.relnamespace = nn.oid AND nn.nspname = bloat_info.schemaname AND nn.nspname <> 'information_schema'
      ), index_bloat AS (
        SELECT
          schemaname, tablename, bs,
          COALESCE(c2.relname,'?') AS iname, COALESCE(c2.reltuples,0) AS ituples, COALESCE(c2.relpages,0) AS ipages,
          COALESCE(CEIL((c2.reltuples*(datahdr-12))/(bs-20::float)),0) AS iotta -- very rough approximation, assumes all cols
        FROM bloat_info
        JOIN pg_class cc ON cc.relname = bloat_info.tablename
        JOIN pg_namespace nn ON cc.relnamespace = nn.oid AND nn.nspname = bloat_info.schemaname AND nn.nspname <> 'information_schema'
        JOIN pg_index i ON indrelid = cc.oid
        JOIN pg_class c2 ON c2.oid = i.indexrelid
      )
      SELECT
        type, schemaname AS schema, object_name, bloat, pg_size_pretty(raw_waste) as waste
      FROM
      (${bloat}) bloat_summary
      ${whereSchema}
      ORDER BY raw_waste DESC, bloat DESC
      LIMIT ${valuesIndex()}`

    values.push(toInt(flags.limit))

    return {text: query, values}
  }
}

function isTableBloat(type: string): boolean {
  return type === 'table' || type === 'both'
}

function isIndexBloat(type: string): boolean {
  return type === 'index' || type === 'both'
}
