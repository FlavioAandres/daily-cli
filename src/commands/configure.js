const {Command, flags} = require('@oclif/command')
const fs = require('fs')
const cli = require( 'cli-ux')
const JSON5 = require('json5')
const { create } = require('domain')
const { EIDRM } = require('constants')
// {
//   elk: {
//     urls:[''] 
//   },
//   metrics: {
//     urls:['']
//   },
//   aws:{
//     urls: [],
//     sqs: [],
//   }
// }

class ConfigureCommand extends Command {
  DEFAULT_CONFIG_FILE_PATH = __dirname + '/../../configs/default.json'
  async run() {
    const {flags, args} = this.parse(ConfigureCommand)
    const {
      path
    } = flags
    const existsDefaultConfig = fs.existsSync(this.DEFAULT_CONFIG_FILE_PATH)
    console.log(existsDefaultConfig)
    
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
    const path = __dirname + `/../../configs/${name}.json` 
    if(fs.existsSync(path)) this.log('⚠ warning: ' + name + ' configs already exist, it will be overwritten')
    fs.writeFileSync(
      path,
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
