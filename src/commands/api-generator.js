const {Command, flags} = require('@oclif/command')
const APIGenerator = require('../generators/api')
const path = require('path')
class ApiGeneratorCommand extends Command {
  async run() {
    const {flags} = this.parse(ApiGeneratorCommand)
    const name = flags.name || 'daily-cli-api'
    const absolutePath = path.join(process.cwd(), name);
    this.log(`creating API Template at ${absolutePath}`)
    APIGenerator({
      logger: this.log,
      dir: absolutePath, 
      apiName: name, 
      options: flags
    })
  }
}

ApiGeneratorCommand.description = `Describe the command here
...
Extra documentation goes here
`

ApiGeneratorCommand.flags = {
  name: flags.string({char: 'n', description: 'API Name'}),
  knex: flags.boolean({char: 'k', description: 'Install knex dependency', default: false}),
  mongo: flags.boolean({char: 'm', description: 'Install mongodb dependency', default: false}),
  docker: flags.boolean({char: 'd', description: 'Creates a Docker File in the root project directory', default: true}),
  metrics: flags.boolean({description: 'Install @condorlabs/metrics middleware', default: false}),
}

module.exports = ApiGeneratorCommand
