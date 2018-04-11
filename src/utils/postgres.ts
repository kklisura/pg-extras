import {Client, QueryResult, QueryConfig} from 'pg'
import * as pgformat from 'pg-format'
import {StringifyOptions} from 'querystring'
import {getUsername} from './platform'

export type Client = Client
export type QueryResult = QueryResult

export const DEFAULT_HOST = 'localhost'
export const DEFAULT_PORT = 5432
export const DEFAULT_DBNAME = 'postgres'
export const DEFAULT_USERNAME = getUsername()

/**
 * Connects to a postgres database.
 *
 * @param host Host. Default: localhost
 * @param port Port number. Default: 5432
 * @param database Database name. Default: postgres
 * @param user Optional username.
 * @param password Optional password
 * @returns Pg client.
 */
export async function connect(
  host: string = DEFAULT_HOST,
  port: number = DEFAULT_PORT,
  database: string = DEFAULT_DBNAME,
  user: string = DEFAULT_USERNAME,
  password?: string
): Promise<Client> {
  const result = new Client({
    user,
    host,
    port,
    database,
    password
  })
  await result.connect()
  await result.query('SELECT 1')
  return result
}

/**
 * Executes a query given a client.
 *
 * @param client Client.
 * @param query Query string or query object.
 */
export function query(client: Client, query: string | QueryConfig): Promise<QueryResult> {
  if (typeof query === 'string') {
    return client.query(query)
  }

  return client.query(query)
}

/**
 * Assert specific extension is present and installed.
 *
 * @param client Client.
 * @param schemaName Schema name.
 * @param extensionName Extension name.
 */
export async function assertExtensionPresent(client: Client, schemaName: string, extensionName: string) {
  const queryString = `SELECT exists(
      SELECT 1 FROM pg_extension e LEFT JOIN pg_namespace n ON n.oid = e.extnamespace
      WHERE e.extname = $1 AND n.nspname = $2
    ) AS available`

  const result = await client.query(queryString, [extensionName, schemaName])
  const isAvailable = result.rowCount > 0 && result.rows[0] && result.rows[0].available === true

  if (!isAvailable) {
    throw new Error(`${extensionName} extension need to be installed on schema ${schemaName}.`)
  }
}

/**
 * Sets the active schema.
 *
 * @param client Client
 * @param schemaName Schema name.
 */
export async function setActiveSchema(client: Client, schemaName: string) {
  await client.query(format('SET search_path TO %L', [schemaName]))
}

/**
 * Formats the query string.
 *
 * @param query Query string.
 * @param values Query parts.
 */
export function format(query: string, values: any[]) {
  return pgformat(query, ...values)
}
