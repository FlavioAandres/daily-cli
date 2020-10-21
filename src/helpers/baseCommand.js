const Config = require('./config')
const { Command } = require('@oclif/command');

class BaseCommand extends Command {
    configHelper = new Config()
    configuration = this.configHelper.getConfig(this.id)
   
}



module.exports = BaseCommand;