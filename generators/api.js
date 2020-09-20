const ejs = require("ejs");
const path = require("path");
const fs = require('fs')
const util = require('util');
const execa = require('execa')
const RELATIVE_MONGOOSE_PATH = '/src/database/mongoose'
const RELATIVE_KNEX_PATH = '/src/database/knex'
const RELATIVE_ROUTER_PATH = 'src/router'
const RELATIVE_EXPRESS_PATH = 'src/app'
const RELATIVE_SERVER_PATH = 'index'

function loadTemplate(name) {
  const contents = fs.readFileSync(
    path.join(__dirname, "..", "templates", "api", name + ".ejs"),
    "utf-8"
  );
  const locals = Object.create(null);

  function render() {
    return ejs.render(contents, locals, {
      escape: util.inspect,
    });
  }

  return {
    locals: locals,
    render: render,
  };
}
var MODE_0755 = parseInt('0755', 8)

function write(file, str, mode) {
  fs.writeFileSync(file, str, { mode: mode || MODE_0755 });
  console.log("   \x1b[36mcreate\x1b[0m : " + file);
}

function createFolding(path){
  fs.mkdirSync(path, { recursive: true });
}

function buildEnvironmentVars(envs){
  return Object.keys(envs).reduce((prev, key)=>{
    return `${prev}\n${key}=${envs[key] || `""` }`
  },'')
} 

module.exports = async function ({
  dir = 'c:/template-test',
  apiName =  'daily-api-template', 
  options =  {mongo: false, docker: false}
}) {
    const app = loadTemplate(RELATIVE_EXPRESS_PATH);
    const router = loadTemplate(RELATIVE_ROUTER_PATH);
    const server = loadTemplate(RELATIVE_SERVER_PATH);

    app.locals.modules = Object.create(null)
    server.locals.modules = Object.create(null)
    app.locals.uses = []

    const package = {
      name: apiName,
      version: '0.0.0',
      scripts: {
        start: 'node ./index.js'
      },
      dependencies: {
        'debug': '~2.6.9',
        'dotenv': '~8.2.0',
        'express': '~4.16.1'
      }
    }

    const environment = {
      PORT: 3001,
      SERVER_TIMEOUT: 30000
    }
    //Create folding
    createFolding(dir + '/src/controllers')
    createFolding(dir + '/src/router')

    if(options.mongo || options.knex){
      createFolding(dir + '/src/database')
    }
    
    if(options.mongo){
      const mongodb = loadTemplate(RELATIVE_MONGOOSE_PATH)

      //Load to files
      package.dependencies['@condor-labs/mongodb'] = '1.3.5'
      server.locals.modules.mongodb = './src/database/mongoose'

      //Set environments 
      environment.MONGO_HOST = ''
      environment.MONGO_PORT = '27017'
      environment.MONGO_DATABSE = ''
      environment.MONGO_USER = ''
      environment.MONGO_PASSWORD = ''
      environment.MONGO_REPLICASET = ''
      environment.MONGO_SSL = '1'
      environment.MONGO_AUTH_SOURCE = '1'
      write(path.join(dir, RELATIVE_MONGOOSE_PATH + '.js'), mongodb.render())
    }

    if(options.knex){
      package.dependencies['@condor-labs/knex-oracle'] = '1.2.15'
    }

    if(options.docker){
      const docker = loadTemplate('Dockerfile')
      write(path.join(dir,'Dockerfile'), docker.render())
    }

    //write rendered files
    write(path.join(dir,'.env'), buildEnvironmentVars(environment))
    write(path.join(dir,'package.json'), JSON.stringify(package, null, 2))
    write(path.join(dir, RELATIVE_EXPRESS_PATH + '.js'), app.render())
    write(path.join(dir, RELATIVE_SERVER_PATH + '.js'), server.render())
    write(path.join(dir, RELATIVE_ROUTER_PATH + '.js'), router.render())

    //npm install
    process.chdir(dir)
    console.log('Installing Npm packages')
    const {stdout} = await execa('npm', ['install'])
    console.log(stdout)
    // execa('npm', ['install']).stdout.pipe(process.stdout);
}
