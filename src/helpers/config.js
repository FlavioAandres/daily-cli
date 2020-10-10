const fs = require('fs')
const path = require('path')

module.exports = class Config {
    DEFAULT_CONFIG_FILE_PATH = './../configs/default.json'
    DEFAULT_CONFIG_NAME = 'default'
    configuration = {}

    constructor() {
        this.loadConfig()
    }

    getConfig = (command) => {
        if (this.configuration[command]) {
            return this.configuration[command]
        }
        return {}
    }

    addConfig = (command, key, value) => {
        try {
            if (!this.configuration[command]) {
                this.configuration[command] = {}
            }
            
            if (!this.configuration[command][key]) {

                if(typeof value === 'object'){
                    this.configuration[command][key] = {}
                    Object.assign(this.configuration[command][key], value)
                }else{
                    this.configuration[command][key] = value;
                }
                
            }            

            this.createFile()

            return true
        } catch (error) {
            console.error(error)
            return false
        }
    }

    loadConfig = () => {
        this.configuration =
            fs.existsSync(path.join(__dirname, this.DEFAULT_CONFIG_FILE_PATH)) &&
            require(this.DEFAULT_CONFIG_FILE_PATH);
        if (!this.configuration) {
            this.configuration = {};
            this.createFile({})
        }
    }

    createFile = () => {
        const obsolutePath = path.join(__dirname, `/../configs/${this.DEFAULT_CONFIG_NAME}.json`)
        fs.writeFileSync(
            obsolutePath,
            JSON.stringify(this.configuration, null, 5)
        );
    }
}

