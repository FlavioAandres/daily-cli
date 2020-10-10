const { Command, flags } = require('@oclif/command')
const { Health } = require('../api')
const { Input } = require('enquirer')
const chalk = require('chalk')
const ora = require('ora')

const { statusRequest, purgeDetails, config, render, addService } = Health

class HealthCommand extends Command {
    static args = [
        {
            name: "action",
            required: false,
            hidden: true,
            options: ["add"],
            description: "action that will do the command",
        },
    ]

    dataInput = (action) => new Input({
        name: "data",
        message: `What is the ${action}?`
    })

    async run() {
        const { flags, args } = this.parse(HealthCommand)

        if (args.action === "add") {

            const serviceName = await this.dataInput('service name').run()
            const serviceJsonLink = await this.dataInput('status service json link').run()
            const serviceRSSLink = await this.dataInput('status service json link').run()
            const response = addService(serviceName, serviceJsonLink, serviceRSSLink, {
                none: 'green'
            })

            if (response) {
                this.log('Service added successfully')
            } else {
                this.error('There was an error at try to add the new service')
            }

        } else {
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

            await render(response, { flags, log: this.log })
        }

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
