const { Config } = require("../helpers");
const { Command, flags } = require("@oclif/command");
const { Snippet } = require('enquirer');
const Table = require('cli-table3');
const colors = require('colors')
const { execFile } = require('child_process');

const configHelper = new Config()
const commandConfig = configHelper.getConfig('GoTo')
const  paths = Object.keys(commandConfig)

class GoToCommand extends Command {
  

  static args = [
    {
      name: "action",
      required: true,
      hidden: false,
      options: ['add','list', ...paths],
      description: "action that will do the command",
    },
  ];



  static description = `
  ...
  Path Automatization!!.

  > Go through multiple paths with the CLI
  `;

  pathPrompt = (path) => new Snippet({
    name: 'pathInfo',
    message: 'Fill out the fields in path',
    required: false,
    fields: [
      {
        name: 'path_name',
        message: 'Path name'
      },
      {
        name: 'path',
        message: 'Folder Location'
      }
    ],
    template: `{
    "name": "\${path_name}",
    "path": "\${path:${path}}"
    }`
  });


  async run() {
    const { args } = this.parse(GoToCommand);

    switch (args.action) {
      case "add": {
        const answer = await this.pathPrompt(process.cwd()).run()
        const result = JSON.parse(answer.result);
        const added = configHelper.addConfig('GoTo', result.name, result.path)
        if (added) {
          this.log(`✔ path ${result.name} saved suceesfully`)
          return;
        }
        throw new Error(`❌ There was an issue saving the path.`)
      }
      case "list": {
        const paths = commandConfig || {}
        const PathsTable = new Table({
          head: [colors.cyan("Name"), colors.cyan("Path")]
        })
        const pathsParsed = Object.keys(paths).map((key) => {
          if(process.cwd() == paths[key]){
            return [ colors.bgWhite(colors.black(key)), colors.bgWhite(colors.black(paths[key]))]
          }
          return [ key, paths[key]]
        })
        PathsTable.push(...pathsParsed)

        this.log(PathsTable.toString())
        break;
      }
      default: {
        const path = commandConfig[args.action]
        execFile(process.env.SHELL, ['-i'], {
          cwd: path,
          stdio: 'ignore'
        });
        break;
      }
    }
  }


}


module.exports = GoToCommand;