pg-extras
=========

[![Version](https://img.shields.io/npm/v/pg-extras.svg)](https://npmjs.org/package/pg-extras)
[![Downloads/week](https://img.shields.io/npm/dw/pg-extras.svg)](https://npmjs.org/package/pg-extras)
[![License](https://img.shields.io/npm/l/pg-extras.svg)](https://github.com/kklisura/pg-extras/blob/master/package.json)

<!-- toc -->
* [About](#about)
* [Environment variables](#environment-variables)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# About

`pg-extras` is a command line tool that shows various statistics of postgres db. It's a port of [heroku-pg-extras](https://github.com/heroku/heroku-pg-extras) that can be applied on any postgres database besides heroku's.

# Environment variables

`pg-extras` support some of the same environment variables as `psql` supports.  The most common are:

```
PGDATABASE=my_db
PGUSER=username
PGPASSWORD="my awesome password"
PGPORT=5432
PGSSLMODE=require
```

## Authentication

In order to authenticate a user, use:
```
PGPASSWORD=pass1234 pg-extras ...
```
or export it
```
export PGPASSWORD=pass1234
pg-extras ...
```

# Usage
<!-- usage -->
```sh-session
$ npm install -g pg-extras
$ pg-extras COMMAND
running command...
$ pg-extras (-v|--version|version)
pg-extras/0.0.3 darwin-x64 node-v9.9.0
$ pg-extras --help [COMMAND]
USAGE
  $ pg-extras COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [pg-extras bloat [OPTIONS]](#pg-extras-bloat-options)
* [pg-extras blocking [OPTIONS]](#pg-extras-blocking-options)
* [pg-extras cache-hit [OPTIONS]](#pg-extras-cache-hit-options)
* [pg-extras calls [SCHEMA] [OPTIONS]](#pg-extras-calls-schema-options)
* [pg-extras extensions [OPTIONS]](#pg-extras-extensions-options)
* [pg-extras help [COMMAND]](#pg-extras-help-command)
* [pg-extras index-size [OPTIONS]](#pg-extras-index-size-options)
* [pg-extras index-usage [OPTIONS]](#pg-extras-index-usage-options)
* [pg-extras locks [OPTIONS]](#pg-extras-locks-options)
* [pg-extras long-running-queries [OPTIONS]](#pg-extras-long-running-queries-options)
* [pg-extras outliers [SCHEMA] [OPTIONS]](#pg-extras-outliers-schema-options)
* [pg-extras records-rank [OPTIONS]](#pg-extras-records-rank-options)
* [pg-extras seq-scans [OPTIONS]](#pg-extras-seq-scans-options)
* [pg-extras stats-reset [OPTIONS]](#pg-extras-stats-reset-options)
* [pg-extras table-indexes-size [OPTIONS]](#pg-extras-table-indexes-size-options)
* [pg-extras table-size [OPTIONS]](#pg-extras-table-size-options)
* [pg-extras total-index-size [OPTIONS]](#pg-extras-total-index-size-options)
* [pg-extras total-table-size [OPTIONS]](#pg-extras-total-table-size-options)
* [pg-extras unused-indexes [OPTIONS]](#pg-extras-unused-indexes-options)
* [pg-extras user-connections [OPTIONS]](#pg-extras-user-connections-options)
* [pg-extras vaccum-stats [OPTIONS]](#pg-extras-vaccum-stats-options)

## pg-extras bloat [OPTIONS]

Show table and index bloat in your database ordered by most wasteful.

```
USAGE
  $ pg-extras bloat [OPTIONS]

OPTIONS
  -U, --username=USERNAME  [default: user] user name
  -d, --dbname=DBNAME      [default: postgres] database name
  -h, --host=HOST          [default: localhost] database server host
  -l, --limit=LIMIT        [default: 10] limit number of output items
  -p, --port=PORT          [default: 5432] database server host
  -s, --schema=SCHEMA      schema
  -t, --type=TYPE          [default: both] bloat type, one of (index|table|both)

EXAMPLES
  bloat --type index --limit 20 --schema myschema

  bloat --type table --schema myschema

  bloat --schema myschema

  .-------------------------------------------------------.
  | type  |  schema  |   object_name    | bloat |  waste  |
  |-------|----------|------------------|-------|---------|
  | table | myschema | users            | 9.9   | 354 MB  |
  | index | myschema | users::users_idx | 4.9   | 122 MB  |
  '-------------------------------------------------------'
```

_See code: [src/commands/bloat.ts](https://github.com/kklisura/pg-extras/blob/v0.0.3/src/commands/bloat.ts)_

## pg-extras blocking [OPTIONS]

Display queries holding locks other queries are waiting to be released.

```
USAGE
  $ pg-extras blocking [OPTIONS]

OPTIONS
  -U, --username=USERNAME  [default: user] user name
  -d, --dbname=DBNAME      [default: postgres] database name
  -h, --host=HOST          [default: localhost] database server host
  -p, --port=PORT          [default: 5432] database server host

EXAMPLE
  blocking [OPTIONS]
```

_See code: [src/commands/blocking.ts](https://github.com/kklisura/pg-extras/blob/v0.0.3/src/commands/blocking.ts)_

## pg-extras cache-hit [OPTIONS]

Show index and table hit rate.

```
USAGE
  $ pg-extras cache-hit [OPTIONS]

OPTIONS
  -U, --username=USERNAME  [default: user] user name
  -d, --dbname=DBNAME      [default: postgres] database name
  -h, --host=HOST          [default: localhost] database server host
  -p, --port=PORT          [default: 5432] database server host

EXAMPLES
  cache-hit [OPTIONS]

  .------------------------.
  |      name      | ratio |
  |----------------|-------|
  | index hit rate | 1.0   |
  | table hit rate | 0.999 |
  '------------------------'
```

_See code: [src/commands/cache-hit.ts](https://github.com/kklisura/pg-extras/blob/v0.0.3/src/commands/cache-hit.ts)_

## pg-extras calls [SCHEMA] [OPTIONS]

Show most frequently called queries.

```
USAGE
  $ pg-extras calls [SCHEMA] [OPTIONS]

ARGUMENTS
  SCHEMA  [default: public] schema name

OPTIONS
  -R, --reset              resets the statistics gathered by pg_stat_statements
  -U, --username=USERNAME  [default: user] user name
  -d, --dbname=DBNAME      [default: postgres] database name
  -h, --host=HOST          [default: localhost] database server host
  -l, --limit=LIMIT        [default: 10] limit number of output queries
  -p, --port=PORT          [default: 5432] database server host
  -t, --truncate           truncate query

EXAMPLES
  calls my-schema -U my-name -t

  .-----------------------------------------------------------------------.
  | total_exec_time | prop_exec_time | ncalls | sync_io_time |   query    |
  |-----------------|----------------|--------|--------------|------------|
  |      007 millis | 0.3%           | 295    |   000 millis | Query 1... |
  |      008 millis | 0.4%           | 29     |   000 millis | Query 2... |
  '-----------------------------------------------------------------------'
```

_See code: [src/commands/calls.ts](https://github.com/kklisura/pg-extras/blob/v0.0.3/src/commands/calls.ts)_

## pg-extras extensions [OPTIONS]

List available and installed extensions.

```
USAGE
  $ pg-extras extensions [OPTIONS]

OPTIONS
  -U, --username=USERNAME  [default: user] user name
  -d, --dbname=DBNAME      [default: postgres] database name
  -h, --host=HOST          [default: localhost] database server host
  -p, --port=PORT          [default: 5432] database server host

EXAMPLES
  extensions [OPTIONS]

  .-------------------------------------------------------------------------------------.
  |        name        | default_version | installed_version |         comment          |
  |--------------------|-----------------|-------------------|--------------------------|
  | pgcrypto           | 1.3             |                   | cryptographic functions  |
  | pg_stat_statements | 1.4             | 1.4               | track execution stati... |
  '-------------------------------------------------------------------------------------'
```

_See code: [src/commands/extensions.ts](https://github.com/kklisura/pg-extras/blob/v0.0.3/src/commands/extensions.ts)_

## pg-extras help [COMMAND]

display help for pg-extras

```
USAGE
  $ pg-extras help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v1.2.4/src/commands/help.ts)_

## pg-extras index-size [OPTIONS]

Show the size of indexes, descending by size.

```
USAGE
  $ pg-extras index-size [OPTIONS]

OPTIONS
  -U, --username=USERNAME  [default: user] user name
  -d, --dbname=DBNAME      [default: postgres] database name
  -h, --host=HOST          [default: localhost] database server host
  -p, --port=PORT          [default: 5432] database server host

EXAMPLES
  index-size [OPTIONS]

  .----------------------------------------------.
  |              name               |    size    |
  |---------------------------------|------------|
  | users_idx                       | 153 MB     |
  | blog_post_user_manager_type_idx | 39 MB      |
  '----------------------------------------------'
```

_See code: [src/commands/index-size.ts](https://github.com/kklisura/pg-extras/blob/v0.0.3/src/commands/index-size.ts)_

## pg-extras index-usage [OPTIONS]

Calculates your index hit rate (effective databases are at 99% and up).

```
USAGE
  $ pg-extras index-usage [OPTIONS]

OPTIONS
  -U, --username=USERNAME  [default: user] user name
  -d, --dbname=DBNAME      [default: postgres] database name
  -h, --host=HOST          [default: localhost] database server host
  -p, --port=PORT          [default: 5432] database server host

EXAMPLES
  index-usage [OPTIONS]

  .---------------------------------------------------------------------------.
  |  schema  |       name       | percent_of_times_index_used | rows_in_table |
  |----------|------------------|-----------------------------|---------------|
  | myschema | users            | 95                          | 0             |
  | myschema | blogs            | 100                         | 0             |
  '---------------------------------------------------------------------------'
```

_See code: [src/commands/index-usage.ts](https://github.com/kklisura/pg-extras/blob/v0.0.3/src/commands/index-usage.ts)_

## pg-extras locks [OPTIONS]

Display queries with active locks.

```
USAGE
  $ pg-extras locks [OPTIONS]

OPTIONS
  -U, --username=USERNAME  [default: user] user name
  -d, --dbname=DBNAME      [default: postgres] database name
  -h, --host=HOST          [default: localhost] database server host

  -l, --lock=LOCK          [default: ExclusiveLock] lock mode, one of
                           (AccessShareLock|RowShareLock|RowExclusiveLock|ShareUpdateExclusiveLock|ShareLock|ShareRowExc
                           lusiveLock|ExclusiveLock|AccessExclusiveLock|all)

  -p, --port=PORT          [default: 5432] database server host

  -t, --truncate           truncate query

EXAMPLE
  locks [OPTIONS]
```

_See code: [src/commands/locks.ts](https://github.com/kklisura/pg-extras/blob/v0.0.3/src/commands/locks.ts)_

## pg-extras long-running-queries [OPTIONS]

Show all queries longer than five minutes by descending duration.

```
USAGE
  $ pg-extras long-running-queries [OPTIONS]

OPTIONS
  -U, --username=USERNAME  [default: user] user name
  -d, --dbname=DBNAME      [default: postgres] database name
  -h, --host=HOST          [default: localhost] database server host
  -p, --port=PORT          [default: 5432] database server host

EXAMPLE
  long-running-queries [OPTIONS]
```

_See code: [src/commands/long-running-queries.ts](https://github.com/kklisura/pg-extras/blob/v0.0.3/src/commands/long-running-queries.ts)_

## pg-extras outliers [SCHEMA] [OPTIONS]

Show queries that have longest execution time in aggregate.

```
USAGE
  $ pg-extras outliers [SCHEMA] [OPTIONS]

ARGUMENTS
  SCHEMA  [default: public] schema name

OPTIONS
  -R, --reset              resets the statistics gathered by pg_stat_statements
  -U, --username=USERNAME  [default: user] user name
  -d, --dbname=DBNAME      [default: postgres] database name
  -h, --host=HOST          [default: localhost] database server host
  -l, --limit=LIMIT        [default: 10] limit number of output queries
  -p, --port=PORT          [default: 5432] database server host
  -t, --truncate           truncate query

EXAMPLES
  outliers my-schema -U my-name -t

  .-----------------------------------------------------------------------.
  | total_exec_time | prop_exec_time | ncalls | sync_io_time |   query    |
  |-----------------|----------------|--------|--------------|------------|
  |      300 millis | 10.7%          | 335    |   000 millis | Query 1... |
  |      212 millis | 7.5%           | 1      |   000 millis | Query 2... |
  '-----------------------------------------------------------------------'
```

_See code: [src/commands/outliers.ts](https://github.com/kklisura/pg-extras/blob/v0.0.3/src/commands/outliers.ts)_

## pg-extras records-rank [OPTIONS]

Show all tables and the number of rows in each ordered by number of rows descending.

```
USAGE
  $ pg-extras records-rank [OPTIONS]

OPTIONS
  -U, --username=USERNAME  [default: user] user name
  -d, --dbname=DBNAME      [default: postgres] database name
  -h, --host=HOST          [default: localhost] database server host
  -p, --port=PORT          [default: 5432] database server host

EXAMPLES
  records-rank [OPTIONS]

  .------------------------------------------------.
  |             name             | estimated_count |
  |------------------------------|-----------------|
  | blogs                        | 134             |
  | users                        | 1               |
  '------------------------------------------------'
```

_See code: [src/commands/records-rank.ts](https://github.com/kklisura/pg-extras/blob/v0.0.3/src/commands/records-rank.ts)_

## pg-extras seq-scans [OPTIONS]

Show the count of sequential scans by table descending by order.

```
USAGE
  $ pg-extras seq-scans [OPTIONS]

OPTIONS
  -U, --username=USERNAME  [default: user] user name
  -d, --dbname=DBNAME      [default: postgres] database name
  -h, --host=HOST          [default: localhost] database server host
  -p, --port=PORT          [default: 5432] database server host

EXAMPLES
  seq-scans [OPTIONS]

  .--------------------------------------.
  |             name             | count |
  |------------------------------|-------|
  | users                        | 21    |
  | blogs                        | 0     |
  '--------------------------------------'
```

_See code: [src/commands/seq-scans.ts](https://github.com/kklisura/pg-extras/blob/v0.0.3/src/commands/seq-scans.ts)_

## pg-extras stats-reset [OPTIONS]

Reset all statistics counters for the current database to zero (requires superuser privileges).

```
USAGE
  $ pg-extras stats-reset [OPTIONS]

OPTIONS
  -U, --username=USERNAME  [default: user] user name
  -d, --dbname=DBNAME      [default: postgres] database name
  -h, --host=HOST          [default: localhost] database server host
  -p, --port=PORT          [default: 5432] database server host

EXAMPLE
  stats-reset [OPTIONS]
```

_See code: [src/commands/stats-reset.ts](https://github.com/kklisura/pg-extras/blob/v0.0.3/src/commands/stats-reset.ts)_

## pg-extras table-indexes-size [OPTIONS]

Show the total size of all the indexes on each table, descending by size.

```
USAGE
  $ pg-extras table-indexes-size [OPTIONS]

OPTIONS
  -U, --username=USERNAME  [default: user] user name
  -d, --dbname=DBNAME      [default: postgres] database name
  -h, --host=HOST          [default: localhost] database server host
  -p, --port=PORT          [default: 5432] database server host

EXAMPLES
  table-indexes-size [OPTIONS]

  .-------------------------------------------.
  |            table             | index_size |
  |------------------------------|------------|
  | blogs                        | 201 MB     |
  | users                        | 45 MB      |
  '------------------------------'------------'
```

_See code: [src/commands/table-indexes-size.ts](https://github.com/kklisura/pg-extras/blob/v0.0.3/src/commands/table-indexes-size.ts)_

## pg-extras table-size [OPTIONS]

Show the size of the tables (excluding indexes), descending by size.

```
USAGE
  $ pg-extras table-size [OPTIONS]

OPTIONS
  -U, --username=USERNAME  [default: user] user name
  -d, --dbname=DBNAME      [default: postgres] database name
  -h, --host=HOST          [default: localhost] database server host
  -p, --port=PORT          [default: 5432] database server host

EXAMPLES
  table-size [OPTIONS]

  .-------------------------------------------.
  |             name             |    size    |
  |------------------------------|------------|
  | blogs                        | 394 MB     |
  | users                        | 111 MB     |
  '------------------------------'------------'
```

_See code: [src/commands/table-size.ts](https://github.com/kklisura/pg-extras/blob/v0.0.3/src/commands/table-size.ts)_

## pg-extras total-index-size [OPTIONS]

Show the total size of all indexes in MB.

```
USAGE
  $ pg-extras total-index-size [OPTIONS]

OPTIONS
  -U, --username=USERNAME  [default: user] user name
  -d, --dbname=DBNAME      [default: postgres] database name
  -h, --host=HOST          [default: localhost] database server host
  -p, --port=PORT          [default: 5432] database server host

EXAMPLES
  total-index-size [OPTIONS]

  .--------.
  |  size  |
  |--------|
  | 352 MB |
  '--------'
```

_See code: [src/commands/total-index-size.ts](https://github.com/kklisura/pg-extras/blob/v0.0.3/src/commands/total-index-size.ts)_

## pg-extras total-table-size [OPTIONS]

Show the size of the tables (including indexes), descending by size.

```
USAGE
  $ pg-extras total-table-size [OPTIONS]

OPTIONS
  -U, --username=USERNAME  [default: user] user name
  -d, --dbname=DBNAME      [default: postgres] database name
  -h, --host=HOST          [default: localhost] database server host
  -p, --port=PORT          [default: 5432] database server host

EXAMPLES
  total-table-size [OPTIONS]

  .-------------------------------------------.
  |             name             |    size    |
  |------------------------------|------------|
  | discussions                  | 595 MB     |
  | users                        | 8192 bytes |
  '-------------------------------------------'
```

_See code: [src/commands/total-table-size.ts](https://github.com/kklisura/pg-extras/blob/v0.0.3/src/commands/total-table-size.ts)_

## pg-extras unused-indexes [OPTIONS]

Show unused and almost unused indexes.

```
USAGE
  $ pg-extras unused-indexes [OPTIONS]

OPTIONS
  -U, --username=USERNAME  [default: user] user name
  -d, --dbname=DBNAME      [default: postgres] database name
  -h, --host=HOST          [default: localhost] database server host
  -p, --port=PORT          [default: 5432] database server host
  -s, --schema=SCHEMA      schema

EXAMPLES
  unused-indexes [OPTIONS]

  .------------------------------------------------------------------------------------------------------------------.
  |       reason       | schema | tablename | indexname | index_scan_pct | scans_per_write | index_size | table_size |
  |--------------------|--------|-----------|-----------|----------------|-----------------|------------|------------|
  | Never Used Indexes | test   | users     | user_idx  | 0.00           | 0.00            | 46 MB      | 111 MB     |
  | Never Used Indexes | test   | blogs     | blogs_idx | 0.00           | 0.00            | 16 kB      | 8192 bytes |
  '------------------------------------------------------------------------------------------------------------------'
```

_See code: [src/commands/unused-indexes.ts](https://github.com/kklisura/pg-extras/blob/v0.0.3/src/commands/unused-indexes.ts)_

## pg-extras user-connections [OPTIONS]

Number of connections per credential.

```
USAGE
  $ pg-extras user-connections [OPTIONS]

OPTIONS
  -U, --username=USERNAME  [default: user] user name
  -d, --dbname=DBNAME      [default: postgres] database name
  -h, --host=HOST          [default: localhost] database server host
  -p, --port=PORT          [default: 5432] database server host

EXAMPLES
  user-connections [OPTIONS]

  .----------------------------.
  | usename | connection_count |
  |---------|------------------|
  | my-user | 4                |
  '----------------------------'
```

_See code: [src/commands/user-connections.ts](https://github.com/kklisura/pg-extras/blob/v0.0.3/src/commands/user-connections.ts)_

## pg-extras vaccum-stats [OPTIONS]

Show dead rows and whether an automatic vacuum is expected to be triggered.

```
USAGE
  $ pg-extras vaccum-stats [OPTIONS]

OPTIONS
  -U, --username=USERNAME  [default: user] user name
  -d, --dbname=DBNAME      [default: postgres] database name
  -h, --host=HOST          [default: localhost] database server host
  -p, --port=PORT          [default: 5432] database server host

EXAMPLE
  vaccum-stats [OPTIONS]
```

_See code: [src/commands/vaccum-stats.ts](https://github.com/kklisura/pg-extras/blob/v0.0.3/src/commands/vaccum-stats.ts)_
<!-- commandsstop -->
