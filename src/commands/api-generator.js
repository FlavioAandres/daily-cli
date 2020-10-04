const {Command, flags} = require('@oclif/command')
const { Generators } = require('../api')
const path = require('path')
const { MultiSelect, Input } = require('enquirer')

class ApiGeneratorCommand extends Command {
  async inputCase({ name, ...options }) {
    const nextResponse = { name, options }

    if (!name) {
      const inputName = new Input({
        message: "What is the api's name",
        initial: 'daily-cli-api'
      });

      nextResponse.name = await inputName.run();
    }

    const entriesOptions = Object.entries(options);

    if (entriesOptions.every(([_, value]) => !value)) {

      const nextChoices = entriesOptions.map(([key, value]) => ({ name: key, disabled: value ? '(previously selected ↩)' : false }))

      const selectPackages = new MultiSelect({
        name: 'options',
        message: 'Pick the next packages',
        choices: nextChoices
      });

      const packages = await selectPackages.run();

      nextResponse.options = packages.reduce((prev, current) => ({ ...prev, [current]: true }), nextResponse.options)
    }

    return nextResponse;
  }

  async run() {
    const {flags} = this.parse(ApiGeneratorCommand)
    const { name, options } = await this.inputCase(flags)
    const absolutePath = path.join(process.cwd(), name);
    this.log(`creating API Template at ${absolutePath}`)
    Generators.api({
      logger: this.log,
      dir: absolutePath,
      apiName: name,
      options
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
  docker: flags.boolean({ char: 'd', description: 'Creates a Docker File in the root project directory', default: false }),
  metrics: flags.boolean({description: 'Install @condorlabs/metrics middleware', default: false}),
}

module.exports = ApiGeneratorCommand
