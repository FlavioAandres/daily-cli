const {Command, flags} = require('@oclif/command')
const fs = require('fs')
const path = require('path')
class ConfigureCommand extends Command {
  DEFAULT_CONFIG_FILE_PATH = './../configs/default.json'
  async run() {
    const {flags, args} = this.parse(ConfigureCommand)
    const {
      path
    } = flags
    const existsDefaultConfig = fs.existsSync(__dirname + this.DEFAULT_CONFIG_FILE_PATH)
    
    const defaultConfig = existsDefaultConfig 
      ? require(this.DEFAULT_CONFIG_FILE_PATH) 
      : {}

    const existsFile = fs.existsSync(path)
    if(!existsFile)  throw new Error('file doesnt exists')
    const file = require(path)
    this.log('✔ file found')
    defaultConfig.interfaces = []
    
    for (const key in file) {
      if(key === 'default') throw new Error('default is not allowed as principal key')
      if(!Object.keys(file[key]).length) throw new Error('someting goes wrong importing the key ' + key)
    
      defaultConfig.interfaces.push(key)
    
      const keySettings = {
        ...file[key],
        updatedAt: +new Date(),
      }
      this.createFile(key, JSON.stringify(keySettings,null,  2))
    }
    
    this.createFile('default', JSON.stringify(defaultConfig,null,  2))
    this.log('Keys created successfully')
  }


  createFile = (name, data) => {
    const obsolutePath = path.join(__dirname, `/../configs/${name}.json`)
    if(fs.existsSync(obsolutePath)) this.log('⚠ warning: ' + name + ' configs already exist, it will be overwritten')
    fs.writeFileSync(
      obsolutePath,
      data
    );
  }
}

ConfigureCommand.description = `Hi!
...
Extra documentation goes here https://github.com/FlavioAandres/daily-cli
`

ConfigureCommand.flags = {
  path: flags.string({char: 'p', description: 'configuration absolute path file'}),
}

module.exports = ConfigureCommand
