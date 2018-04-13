import {basename, extname} from 'path'

export const TOOL_NAME = 'pg-extras'

export function defaultExample(commandName: string): string {
    return `${commandName} [OPTIONS]`
}

export function defaultUsage(commandName: string): string {
  return `${commandName} [OPTIONS]`
}

export function fileName(filename: string): string {
  return basename(filename, extname(filename))
}
