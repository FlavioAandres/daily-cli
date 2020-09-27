daily-cli
=========

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/daily-cli.svg)](https://npmjs.org/package/daily-cli)
[![Downloads/week](https://img.shields.io/npm/dw/daily-cli.svg)](https://npmjs.org/package/daily-cli)
[![License](https://img.shields.io/npm/l/daily-cli.svg)](https://github.com/@FlavioAandres/FlavioAandres/blob/master/package.json)

# Description

We want to build a set of tools useful for all developers allways thinking in making the developer life easier.

*Are you a bored developer in charge of support? We're here for you.*


<!-- toc -->

# Main Functionalities

* [Open a group of URLS in your browser](#To-open-all-urls)
* [Generate express API + knex + metrics + mongodb](#daily-cli-api-generator)

## More... 
* [Installation](#installation)
* [Commands](#commands)
<!-- tocstop -->
# Installation
<!-- usage -->
```sh-session
$ npm install -g daily-cli
```

## Getting started 

Create a file in your system using the following sintax: 

```json
{
    "interface": {
        "urls": ["https://google.com","https://yahoo.com"]
    },
    "start-day": {
        "urls": ["https://mail.google.com", "https://your-business.slack.com"]
    }
}
```

Note: each new key added in the config object will be taken as a URL group and this name will be used to run the commands. 

## To Configure: 

```bash
$ daily-cli configure --path c:/configs.json
```

- `--path` is mandatory, you should pass an absolute path of your config file

![](https://s3.amazonaws.com/public.flavioaandres.com/configure_and_urls.gif)

## `To open all urls`

sintax `daily-cli run <interface> --task urls` you can use `-t` to run `--task`

```bash
$ daily-cli run start-day --task urls
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

Use this command for your first initialization of this module, you can use it to load the urls groups to open it later

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
