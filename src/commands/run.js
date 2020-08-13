const {Command, flags} = require('@oclif/command')
const fs = require('fs')
const opn = require('opn')

class RunCommand extends Command {
  DEFAULT_CONFIG_FILE_PATH = __dirname + '/../../configs/default.json'
  static flags = {
    task: flags.string({ char:'t',   description: 'task to execute', }),
  }
  
  async run() {
    const defaultFile = fs.existsSync(this.DEFAULT_CONFIG_FILE_PATH) &&  require(this.DEFAULT_CONFIG_FILE_PATH)
    if(!defaultFile) throw new Error('daily-cli is not configured yet, please run using: \n\tdaily-cli configure --path c:/path/file.json ')
    RunCommand.args = [{
      name: 'interface', 
      options: defaultFile.interfaces,
      required: true
    }] 

    const {flags, args} = this.parse(RunCommand)
    const { 
      task
    }= flags

    if(task === 'urls'){
      const interfaceFile = require(
        __dirname 
        + '/../../configs/' 
        + args.interface
        + '.json'
      )
      return await this.procesUrlType(interfaceFile.urls)
    }
  }

  procesUrlType = (urls = [])=>{
    return Promise.all(urls.map(u=>opn(u)))
  }

}

RunCommand.description = `Describe the command here
...
Extra documentation goes here
`


module.exports = RunCommand
