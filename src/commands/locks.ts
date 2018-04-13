import {flags} from '@oclif/command'
import {QueryConfig} from 'pg'

import BaseCommand, {DEFAULT_CONNECTION_FLAGS} from '../base-command'
import {defaultExample, defaultUsage, fileName} from '../utils/command'

const COMMAND_NAME = fileName(__filename)

const DEFAULT_LOCK_MODE = 'ExclusiveLock'

const SUPPORTED_LOCKS_MODE = [
  'AccessShareLock',
  'RowShareLock',
  'RowExclusiveLock',
  'ShareUpdateExclusiveLock',
  'ShareLock',
  'ShareRowExclusiveLock',
  'ExclusiveLock',
  'AccessExclusiveLock',
  'all'
]

export default class LocksCommand extends BaseCommand {
  static description = 'Display queries with active locks.'

  static examples = [defaultExample(COMMAND_NAME)]
  static usage = [defaultUsage(COMMAND_NAME)]

  static flags = {
    ...DEFAULT_CONNECTION_FLAGS,
    truncate: flags.boolean({
      char: 't',
      description: 'truncate query'
    }),
    lock: flags.enum({
      char: 'l',
      description: `lock mode, one of (${SUPPORTED_LOCKS_MODE.join('|')})`,
      helpValue: 'LOCK',
      default: DEFAULT_LOCK_MODE,
      options: SUPPORTED_LOCKS_MODE
    })
  }

  getClass(): typeof BaseCommand {
    return LocksCommand
  }

  getQuery(_: any, flags: any): QueryConfig {
    let values: any[] = []

    let truncatedQueryString = (prefix: string): string => {
      let column = `${prefix}query`
      if (flags.truncate) {
        return `CASE WHEN length(${column}) <= 40 THEN ${column} ELSE substr(${column}, 0, 39) || '…' END`
      } else {
        return column
      }
    }

    let whereLocksMode = ''
    if (isAll(flags.locks)) {
      whereLocksMode = 'AND pg_locks.mode = $1'
      values.push(flags.lock)
    }

    let query = `
      SELECT
        pg_stat_activity.pid,
        pg_class.relname,
        pg_locks.transactionid,
        pg_locks.granted,
        ${truncatedQueryString('pg_stat_activity.')} AS query_snippet,
        age(now(),pg_stat_activity.query_start) AS "age"
      FROM pg_stat_activity,pg_locks left
      OUTER JOIN pg_class
        ON (pg_locks.relation = pg_class.oid)
      WHERE pg_stat_activity.query <> '<insufficient privilege>'
        AND pg_locks.pid = pg_stat_activity.pid
        ${whereLocksMode}
        AND pg_stat_activity.pid <> pg_backend_pid() order by query_start;
    `

    return {text: query, values}
  }
}

function isAll(type: string): boolean {
  return type === 'all'
}
