
const INTEGER = /^(\d+)$/

/**
 * Converts a string to number.
 *
 * @param value String value
 */
export function toInt(value: string): number {
  if (INTEGER.exec(value)) {
      return parseInt(value, 10)
  }

  throw new Error(`Cannot parse '${value}' as int.`)
}

/**
 * Strips all new lines from string.
 *
 * @param value Input string.
 */
export function stripNewLines(value: string): string {
  return value.replace(/[\r\n]/g, '')
}

/**
 * Returns true if given value is string.
 *
 * @param value Value
 */
export function isString(value: any): boolean {
  return value && typeof(value) === 'string'
}
