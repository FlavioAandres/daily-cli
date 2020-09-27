const {Command, flags} = require('@oclif/command')
const APIGenerator = require('../generators/api')
const path = require('path')
const { MultiSelect, Input } = require('enquirer')

class ApiGeneratorCommand extends Command {
  async interactive({ name, ...options }) {
    const response = { options }

    if (!name) {
      const inputName = new Input({
        message: "What is your api's name",
        initial: 'daily-cli-api'
      });

      response.name = await inputName.run();
    }

    const entriesOptions = Object.entries(options);

    if (entriesOptions.every(([_key, value]) => !value)) {

      const nextChoices = entriesOptions.map(([key, value]) => ({ name: key, value: key, disabled: value ? '(previously selected ↩)' : false }))

      const currentSelected = entriesOptions.filter(([_key, value]) => value).map(([key]) => key);

      const selectPackages = new MultiSelect({
        name: 'options',
        message: 'Pick the next packages',
        limit: 7,
        choices: nextChoices
      });

      const packages = await selectPackages.run();

      this.log([...packages, ...currentSelected])

      response.options = packages.reduce((prev, current) => ({ ...prev, [current]: true }), response.options)
    }

    this.log(response)
  }

  async run() {
    const {flags} = this.parse(ApiGeneratorCommand)
    const name = flags.name || 'daily-cli-api'
    const absolutePath = path.join(process.cwd(), name);
    console.log(flags)
    this.log(`creating API Template at ${absolutePath}`)
    await this.interactive(flags)
    this.log('Done')
    // APIGenerator({
    //   logger: this.log,
    //   dir: absolutePath, 
    //   apiName: name, 
    //   options: flags
    // })
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
