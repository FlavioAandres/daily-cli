daily-cli
=========

multicommand cli to make the developer life easier

Are you a bored developer in charge of support? We're here for you. 

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
<!-- [![Version](https://img.shields.io/npm/v/daily-cli.svg)](https://npmjs.org/package/daily-cli)
[![Downloads/week](https://img.shields.io/npm/dw/daily-cli.svg)](https://npmjs.org/package/daily-cli)
[![License](https://img.shields.io/npm/l/daily-cli.svg)](https://github.com/@FlavioAandres/FlavioAandres/blob/master/package.json) -->

<!-- toc -->
# Functionalities

* [Open a url group in your browser](#daily-cli-run)
* [Generate express API + knex + metrics + mongodb](#To-open-all-urls)

## More... 
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g daily-cli
$ daily-cli COMMAND
running command...
$ daily-cli (-v|--version|version)
daily-cli/0.0.3 win32-x64 node-v12.16.2
$ daily-cli --help [COMMAND]
USAGE
  $ daily-cli COMMAND
...
```

## Getting started 

Create a file in your system using the following sintax
```json
{
    "interface": {
        "urls": ["https://google.com","https://yahoo.com"]
    },
    "elk": {
        "urls": ["https://elk.flavioaandres.com/search/", "https://elk.flavioaandres.com/search/2"]
    },
    "metrics": {
        "urls": ["https://metrics.flavioaandres.com/search/"]
    }
}

```

### To Configure: 

```bash
$ daily-cli configure --path c:/configs.json
```

### `To open all urls`

sintax `daily-cli run <interface> --task urls` you can use `-t` to run `--task`

```bash
$ daily-cli run elk --task urls
```

# Commands
<!-- commands -->
* [`daily-cli api-generator`](#daily-cli-api-generator)
* [`daily-cli configure`](#daily-cli-configure)
* [`daily-cli hello`](#daily-cli-hello)
* [`daily-cli help [COMMAND]`](#daily-cli-help-command)
* [`daily-cli run`](#daily-cli-run)

## `daily-cli api-generator`

Describe the command here

```
USAGE
  $ daily-cli api-generator

OPTIONS
  -d, --docker     Creates a Docker File in the root project directory
  -k, --knex       Install knex dependency
  -m, --mongo      Install mongodb dependency
  -n, --name=name  API Name

DESCRIPTION
  ...
  Extra documentation goes here
```

_See code: [src\commands\api-generator.js](https://github.com/FlavioAandres/daily-cli/blob/v0.0.3/src\commands\api-generator.js)_

## `daily-cli configure`

Hi!

```
USAGE
  $ daily-cli configure

OPTIONS
  -p, --path=path  configuration absolute path file

DESCRIPTION
  ...
  Extra documentation goes here https://github.com/FlavioAandres/daily-cli
```

_See code: [src\commands\configure.js](https://github.com/FlavioAandres/daily-cli/blob/v0.0.3/src\commands\configure.js)_

## `daily-cli hello`

Describe the command here

```
USAGE
  $ daily-cli hello

OPTIONS
  -n, --name=name  name to print

DESCRIPTION
  ...
  Extra documentation goes here
```

_See code: [src\commands\hello.js](https://github.com/FlavioAandres/daily-cli/blob/v0.0.3/src\commands\hello.js)_

## `daily-cli help [COMMAND]`

display help for daily-cli

```
USAGE
  $ daily-cli help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.0/src\commands\help.ts)_

## `daily-cli run`

Describe the command here

```
USAGE
  $ daily-cli run

OPTIONS
  -t, --task=task  task to execute

DESCRIPTION
  ...
  Extra documentation goes here
```

_See code: [src\commands\run.js](https://github.com/FlavioAandres/daily-cli/blob/v0.0.3/src\commands\run.js)_
<!-- commandsstop -->
