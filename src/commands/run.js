const { flags } = require('@oclif/command')
const Command = require('../helpers/baseCommand')
const opn = require('opn')
class RunCommand extends Command {
  interfaces = Object.keys(this.configuration)

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

    if (this.configuration[args.interface]) {
      if (task === 'urls') {
        const interfaceFile = this.configuration[args.interface]
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
