const {Command, flags} = require('@oclif/command')
const fs = require('fs')
const opn = require('opn')
const path = require('path')
class RunCommand extends Command {
  DEFAULT_CONFIG_FILE_PATH ='../configs/default.json'
  static flags = {
    task: flags.string({ char:'t',   description: 'task to execute', }),
  }
  
  async run() {
    const defaultFile = fs.existsSync(path.join(__dirname, this.DEFAULT_CONFIG_FILE_PATH)) && require(this.DEFAULT_CONFIG_FILE_PATH)
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
          '../configs/' + 
          args.interface +
          '.json'
      )
      return await this.procesUrlType(interfaceFile.urls)
    }

    this.log('no task set for: ' + task)
    return null; 
  }

  procesUrlType = (urls = [])=>{
    return Promise.all(urls.map(url=>opn(url)))
  }

}

RunCommand.description = `Describe the command here
...
Extra documentation goes here
`


module.exports = RunCommand
