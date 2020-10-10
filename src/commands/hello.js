const {Command, flags} = require('@oclif/command')

class HelloCommand extends Command {
  async run() {
    const { flags } = this.parse(HelloCommand)
    const name = flags.name || 'unknown'
    this.log(`hello ${name} wellcome to daily-cli`)
  }
}

HelloCommand.description = `Describe the command here
...
Extra documentation goes here
`

HelloCommand.flags = {
  name: flags.string({char: 'n', description: 'name to print'}),
}

HelloCommand.examples = [
  '$ daily-cli hello --name pecue'
]

module.exports = HelloCommand
