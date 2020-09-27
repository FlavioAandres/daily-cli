const { Command, flags } = require('@oclif/command')
const { Health } = require('../api')
const chalk = require('chalk')
const ora = require('ora')

const { statusRequest, purgeDetails, config, render } = Health

class HealthCommand extends Command {

    async run() {
        const { flags } = this.parse(HealthCommand)

        let summary = purgeDetails(
            statusRequest(flags.services),
            this.log
        )

        const spinner = ora({
            text: 'loading services...',
            prefixText: chalk.bold('Provide on'),
            spinner: 'earth',
            color: 'gray'
        }).start()

        const response = await Promise.all(summary)
            .finally(() => spinner.stop())


        await render(response, config, { flags, log: this.log })
    }
}

HealthCommand.description = `Describe the command here
...
It's a simple command for check health status about external services. 🙌

currently just supporting: 
- ${chalk.bold('Github')}
- ${chalk.bold('Trello')}

`

HealthCommand.flags = {
    // add --version flag to show CLI version
    version: flags.version({ char: 'v' }),
    // add --help flag to show CLI version
    help: flags.help({ char: 'h' }),
    services: flags.string({ char: 's', description: 'name of services to check like {github,trello} (separated by `<space>`)', multiple: true, default: ['github', 'trello'] }),
    incidents: flags.integer({ char: 'i', description: 'Number of latest incidents on the current services', default: 3 })
}

HealthCommand.examples = [
    '$ health ',
    '$ health -s github trello',
]

module.exports = HealthCommand
