
function example(value: TemplateStringsArray): string {
  return value
    .join('\r\n')
    .replace(/^(\r\n|\r|\n)+/, '')
    .replace(/(\r\n|\r|\n)+$/, '')
}

export const BLOAT_EXAMPLE = example`
.-------------------------------------------------------.
| type  |  schema  |   object_name    | bloat |  waste  |
|-------|----------|------------------|-------|---------|
| table | myschema | users            | 9.9   | 354 MB  |
| index | myschema | users::users_idx | 4.9   | 122 MB  |
'-------------------------------------------------------'
`

export const CACHE_HIT_EXAMPLE = example`
.------------------------.
|      name      | ratio |
|----------------|-------|
| index hit rate | 1.0   |
| table hit rate | 0.999 |
'------------------------'
`

export const CALLS_EXAMPLE = example`
.-----------------------------------------------------------------------.
| total_exec_time | prop_exec_time | ncalls | sync_io_time |   query    |
|-----------------|----------------|--------|--------------|------------|
|      007 millis | 0.3%           | 295    |   000 millis | Query 1... |
|      008 millis | 0.4%           | 29     |   000 millis | Query 2... |
'-----------------------------------------------------------------------'
`

export const EXTENSIONS_EXAMPLE = example`
.-------------------------------------------------------------------------------------.
|        name        | default_version | installed_version |         comment          |
|--------------------|-----------------|-------------------|--------------------------|
| pgcrypto           | 1.3             |                   | cryptographic functions  |
| pg_stat_statements | 1.4             | 1.4               | track execution stati... |
'-------------------------------------------------------------------------------------'
`

export const INDEX_SIZE = example`
.----------------------------------------------.
|              name               |    size    |
|---------------------------------|------------|
| users_idx                       | 153 MB     |
| blog_post_user_manager_type_idx | 39 MB      |
'----------------------------------------------'
`

export const INDEX_USAGE = example`
.---------------------------------------------------------------------------.
|  schema  |       name       | percent_of_times_index_used | rows_in_table |
|----------|------------------|-----------------------------|---------------|
| myschema | users            | 95                          | 0             |
| myschema | blogs            | 100                         | 0             |
'---------------------------------------------------------------------------'
`

export const OUTLIERS = example`
.-----------------------------------------------------------------------.
| total_exec_time | prop_exec_time | ncalls | sync_io_time |   query    |
|-----------------|----------------|--------|--------------|------------|
|      300 millis | 10.7%          | 335    |   000 millis | Query 1... |
|      212 millis | 7.5%           | 1      |   000 millis | Query 2... |
'-----------------------------------------------------------------------'
`

export const RECORDS_RANK = example`
.------------------------------------------------.
|             name             | estimated_count |
|------------------------------|-----------------|
| blogs                        | 134             |
| users                        | 1               |
'------------------------------------------------'
`

export const SEQ_SCANS = example`
.--------------------------------------.
|             name             | count |
|------------------------------|-------|
| users                        | 21    |
| blogs                        | 0     |
'--------------------------------------'
`

export const TABLE_INDEXES_SIZE = example`
.-------------------------------------------.
|            table             | index_size |
|------------------------------|------------|
| blogs                        | 201 MB     |
| users                        | 45 MB      |
'------------------------------'------------'
`

export const TABLE_SIZE = example`
.-------------------------------------------.
|             name             |    size    |
|------------------------------|------------|
| blogs                        | 394 MB     |
| users                        | 111 MB     |
'------------------------------'------------'
`

export const TOTAL_INDEX_SIZE = example`
.--------.
|  size  |
|--------|
| 352 MB |
'--------'
`

export const TOTAL_TABLE_SIZE = example`
.-------------------------------------------.
|             name             |    size    |
|------------------------------|------------|
| discussions                  | 595 MB     |
| users                        | 8192 bytes |
'-------------------------------------------'
`

export const UNUSED_INDEXES = example`
.------------------------------------------------------------------------------------------------------------------.
|       reason       | schema | tablename | indexname | index_scan_pct | scans_per_write | index_size | table_size |
|--------------------|--------|-----------|-----------|----------------|-----------------|------------|------------|
| Never Used Indexes | test   | users     | user_idx  | 0.00           | 0.00            | 46 MB      | 111 MB     |
| Never Used Indexes | test   | blogs     | blogs_idx | 0.00           | 0.00            | 16 kB      | 8192 bytes |
'------------------------------------------------------------------------------------------------------------------'
`

export const USER_CONNECTIONS = example`
.----------------------------.
| usename | connection_count |
|---------|------------------|
| my-user | 4                |
'----------------------------'
`
