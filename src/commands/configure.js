const { Command, flags } = require('@oclif/command')
const { Config } = require('../helpers')
const fs = require('fs')
const path = require('path')
class ConfigureCommand extends Command {
  configHelper = new Config()
  commandConfig = this.configHelper.getConfig('Configure')

  async run() {
    const { flags, args } = this.parse(ConfigureCommand)
    const {
      path
    } = flags

    const existsFile = fs.existsSync(path)
    if (!existsFile) throw new Error('file doesnt exists')
    const file = require(path)
    this.log('✔ file found')
    this.commandConfig.interfaces = []

    for (const key in file) {
      if (key === 'default') throw new Error('default is not allowed as principal key')
      if (!Object.keys(file[key]).length) throw new Error('someting goes wrong importing the key ' + key)

      this.commandConfig.interfaces.push(key)

      const keySettings = {
        ...file[key],
        updatedAt: +new Date(),
      }
     this.configHelper.addConfig('Run',key,keySettings)
    }
    this.log('Keys created successfully')
  }

  createFile = (name, data) => {
    const obsolutePath = path.join(__dirname, `/../configs/${name}.json`)
    if (fs.existsSync(obsolutePath)) this.log('⚠ warning: ' + name + ' configs already exist, it will be overwritten')
    fs.writeFileSync(
      obsolutePath,
      data
    );
  }

}

ConfigureCommand.description = `
Use this command for your first initialization of this module, you can use it to load the urls groups to open it later

* --path is mandatory
...
Extra documentation goes here https://github.com/FlavioAandres/daily-cli
`

ConfigureCommand.flags = {
  path: flags.string({ char: 'p', description: 'configuration absolute path file' }),
}

module.exports = ConfigureCommand
