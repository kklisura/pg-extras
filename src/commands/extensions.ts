import BaseCommand from '../base-command'
import {defaultExample, defaultUsage, fileName} from '../utils/command'
import {EXTENSIONS_EXAMPLE} from '../utils/examples'

const COMMAND_NAME = fileName(__filename)

export default class ExtensionsCommand extends BaseCommand {
  static description = 'List available and installed extensions.'

  static examples = [defaultExample(COMMAND_NAME), EXTENSIONS_EXAMPLE]
  static usage = [defaultUsage(COMMAND_NAME)]

  getQuery() {
    return 'SELECT * FROM pg_available_extensions'
  }
}
