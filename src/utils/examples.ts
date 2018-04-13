
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
| table | myschema | blogs            | 1.9   | 22 MB   |
'----------------------------------- -------------------'
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
.-------------------------------------------------------------------------------------------.
| total_exec_time | prop_exec_time | ncalls | sync_io_time |             query              |
|-----------------|----------------|--------|--------------|--------------------------------|
|      007 millis | 0.3%           | 295    |   000 millis | SELECT CASE WHEN typbasetype=? |
|      008 millis | 0.4%           | 295    |   000 millis | SELECT format_type(oid,?) as t.|
|      005 millis | 0.3%           | 194    |   000 millis | SELECT attname FROM pg_attribut|
'-------------------------------------------------------------------------------------------'
`

export const EXTENSIONS_EXAMPLE = example`
.-----------------------------------------------------------------------------------------------------.
|        name        | default_version | installed_version |                 comment                  |
|--------------------|-----------------|-------------------|------------------------------------------|
| pgcrypto           | 1.3             |                   | cryptographic functions                  |
| pg_stat_statements | 1.4             | 1.4               | track execution statistics of all SQL..  |
'-----------------------------------------------------------------------------------------------------'
`

export const INDEX_SIZE = example`
.----------------------------------------------.
|              name               |    size    |
|---------------------------------|------------|
| users_idx                       | 153 MB     |
| blog_post_user_manager_type_idx | 39 MB      |
| person_legacy_id_idx            | 33 MB      |
'----------------------------------------------'
`
