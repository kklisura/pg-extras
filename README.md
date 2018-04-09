pg-extras
=========



[![Version](https://img.shields.io/npm/v/pg-extras.svg)](https://npmjs.org/package/pg-extras)
[![CircleCI](https://circleci.com/gh/kklisura/pg-extras/tree/master.svg?style=shield)](https://circleci.com/gh/kklisura/pg-extras/tree/master)
[![Appveyor CI](https://ci.appveyor.com/api/projects/status/github/kklisura/pg-extras?branch=master&svg=true)](https://ci.appveyor.com/project/kklisura/pg-extras/branch/master)
[![Codecov](https://codecov.io/gh/kklisura/pg-extras/branch/master/graph/badge.svg)](https://codecov.io/gh/kklisura/pg-extras)
[![Downloads/week](https://img.shields.io/npm/dw/pg-extras.svg)](https://npmjs.org/package/pg-extras)
[![License](https://img.shields.io/npm/l/pg-extras.svg)](https://github.com/kklisura/pg-extras/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g pg-extras
$ pg-extras COMMAND
running command...
$ pg-extras (-v|--version|version)
pg-extras/0.0.1 darwin-x64 node-v9.9.0
$ pg-extras --help [COMMAND]
USAGE
  $ pg-extras COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [pg-extras hello [FILE]](#pg-extras-hello-file)
* [pg-extras help [COMMAND]](#pg-extras-help-command)

## pg-extras hello [FILE]

describe the command here

```
USAGE
  $ pg-extras hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ pg-extras hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/kklisura/pg-extras/blob/v0.0.1/src/commands/hello.ts)_

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

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v1.2.3/src/commands/help.ts)_
<!-- commandsstop -->
