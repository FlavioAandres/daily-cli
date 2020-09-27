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
* [Description](#description)
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
daily-cli/0.0.4 darwin-x64 node-v12.16.2
$ daily-cli --help [COMMAND]
USAGE
  $ daily-cli COMMAND
...
```
<!-- usagestop -->
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

``` json
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

``` bash
$ daily-cli configure --path c:/configs.json
```

- `--path` is mandatory, you should pass an absolute path of your config file

![](https://s3.amazonaws.com/public.flavioaandres.com/configure_and_urls.gif)

## `To open all urls`

sintax `daily-cli run <interface> --task urls` you can use `-t` to run `--task`

``` bash
$ daily-cli run elk --task urls
```

# Commands

<!-- commands -->
* [`daily-cli aws-accounts ACTION`](#daily-cli-aws-accounts-action)
* [`daily-cli configure`](#daily-cli-configure)
* [`daily-cli hello`](#daily-cli-hello)
* [`daily-cli help [COMMAND]`](#daily-cli-help-command)
* [`daily-cli run`](#daily-cli-run)

## `daily-cli aws-accounts ACTION`

Describe the command here

```
USAGE
  $ daily-cli aws-accounts ACTION

ARGUMENTS
  ACTION  (add|remove|show|to) action that will do the command

OPTIONS
  -k, --key=key        Access Key of the AWS account
  -n, --name=name      Name of the AWS account
  -s, --secret=secret  Secret Access Key of the AWS account

DESCRIPTION
  ...
  Allow administrating your AWS accounts
```

_See code: [src/commands/aws-accounts.js](https://github.com/FlavioAandres/daily-cli/blob/v0.0.4/src/commands/aws-accounts.js)_

## `daily-cli configure`

Use this command for your first initialization of this module, you can use it to load the urls groups to open it later

```
USAGE
  $ daily-cli configure

OPTIONS
  -p, --path=path  configuration absolute path file

DESCRIPTION
  Use this command for your first initialization of this module, you can use it to load the urls groups to open it later

  * --path is mandatory
  ...
  Extra documentation goes here https://github.com/FlavioAandres/daily-cli
```

_See code: [src/commands/configure.js](https://github.com/FlavioAandres/daily-cli/blob/v0.0.4/src/commands/configure.js)_

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

_See code: [src/commands/hello.js](https://github.com/FlavioAandres/daily-cli/blob/v0.0.4/src/commands/hello.js)_

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

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.0/src/commands/help.ts)_

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

_See code: [src/commands/run.js](https://github.com/FlavioAandres/daily-cli/blob/v0.0.4/src/commands/run.js)_
<!-- commandsstop -->
