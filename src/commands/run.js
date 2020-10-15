const { Command, flags } = require('@oclif/command')
const { Config } = require('../helpers')
const fs = require('fs')
const opn = require('opn')
const path = require('path')
class RunCommand extends Command {
  configHelper = new Config()
  commandConfig = this.configHelper.getConfig('Run')
  interfaces = Object.keys(this.commandConfig)


  static flags = {
    task: flags.string({ char: 't', description: 'task to execute', }),
  }

  async run() {
  
    RunCommand.args = [{
      name: 'interface',
      options: this.interfaces,
      required: true
    }]

    const { flags, args } = this.parse(RunCommand)
    const {
      task
    } = flags

    if (this.commandConfig[args.interface]) {
      if (task === 'urls') {
        const interfaceFile = this.commandConfig[args.interface]
        return await this.procesUrlType(interfaceFile.urls)
      } else {
        this.error('no task set for: ' + task)
      }
    }

    return null;
  }

  procesUrlType = (urls = []) => {
    return Promise.all(urls.map(url => opn(url)))
  }

}

RunCommand.description = `Describe the command here
...
Extra documentation goes here
`


module.exports = RunCommand
