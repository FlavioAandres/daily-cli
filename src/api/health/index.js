const fetch = require('node-fetch')
const chalk = require('chalk')
const figures = require('figures')
const boxen = require('boxen')
const link = require('terminal-link')
const Parser = require('rss-parser')
const ora = require('ora')

const { externalServices } = require('../../configs')

exports.config = externalServices;

const parserRSS = new Parser()

const fetchData = (service) => {
    return fetch(service).then(response => response.json())
}

const textChunks = (text, final = '') => {
    const words = text.split(" ")

    const newSplice = words.splice(0, 15)

    final = `${final ? `${final} \n` : ''}${newSplice.join(' ')}`

    if (words.length === 0) {
        return final;
    }

    return textChunks(words.join(' '), final)
}

exports.render = async (responseData, configService, { flags, log }) => {
    for (const item of responseData) {
        const { page, status } = item

        const name = page.name.toLowerCase();

        const config = configService[name]

        const indicator = config.indicators[status.indicator] ? config.indicators[status.indicator] : 'orange';

        log(`
    ${link(chalk.bold(page.name), page.url)}
    ${chalk.keyword(indicator)(figures.bullet)} - ${chalk.grey(status.description)}
        `)

        if (status.indicator) {

            const spinner = ora({
                text: 'loading incidents history...',
                prefixText: chalk.bold(`From ${name}`),
                spinner: 'dots11',
                color: 'yellow'
            }).start()

            const { items, ...rest } = await parserRSS.parseURL(config.rss)
                .finally(() => spinner.stop())

            log(`      ${chalk.bold(rest.title)}`)

            for (const item of items.slice(0, flags.incidents)) {
                const newText = item.contentSnippet.split(/\n/).reduce((prev, current) => {
                    const words = current.split(" ")
                    if (words.length > 20) {
                        const reduceWidthWords = textChunks(current)
                        current = reduceWidthWords;
                    }
                    return `${prev} \n\n${current}`
                }, "")

                log(`${boxen(`${chalk.keyword('orange').bold(item.title)} - ${chalk.gray(item.link)} \n ${newText}`, {
                    padding: 1, borderStyle: 'round', borderColor: 'gray', margin: {
                        left: 5
                    }
                })}`)
            }
        }
    }

    return configService;
}

exports.purgeDetails = (result, log) => {
    if (result.errors.length) {
        log(`${chalk.keyword('orange')(figures.warning)} ${chalk.bold.keyword('orange')('Warning')} - We don't support ${result.errors.length > 1 ? 'these services' : 'this service'}: `)
        result.errors.forEach(item => {
            log(`   - ${chalk.bold(item)}`)
        })
    }

    return result.currents;
}

exports.statusRequest = (services) => {
    const result = { currents: [], errors: [] }

    for (const name of services) {
        const configService = externalServices[name];

        if (!configService) {
            result.errors.push(name)
            continue
        }

        result.currents.push(
            fetchData(configService.status)
        )
    }

    return result;
}

