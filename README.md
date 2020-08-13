daily-cli
=========

multicommand cli to make the developer life easier

Are you a bored developer in charge of support? We're here for you. 

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
<!-- [![Version](https://img.shields.io/npm/v/daily-cli.svg)](https://npmjs.org/package/daily-cli)
[![Downloads/week](https://img.shields.io/npm/dw/daily-cli.svg)](https://npmjs.org/package/daily-cli)
[![License](https://img.shields.io/npm/l/daily-cli.svg)](https://github.com/@FlavioAandres/FlavioAandres/blob/master/package.json) -->

<!-- toc -->
# Usage
<!-- usage -->
We do not have npm package published yet, but we're working on it. 

## Install 

```bash

$ git clone https://github.com/FlavioAandres/daily-cli.git
$ npm i 
$ npm link
```
After run `npm link` you can run daily-cli at any location of your pc 

## Configure for first time

Create a file in your system using the following sintax
```json
{
    "interface": {
        "urls": ["https://google.com","https://yahoo.com"]
    },
    "elk": {
        "urls": ["https://elk.flavioaandres.com/search/"]
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

### To open all urls

sintax `daily-cli run <interface> --task urls` you can use `-t` to run `--task`

```bash
$ daily-cli run elk --task urls
```

# Commands
<!-- commands -->

