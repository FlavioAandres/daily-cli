const fs = require('fs')
const path = require('path')
const os = require('os')
const cliPackage = require('../../package.json')
const defaultConfig = require('../configs/default.json')

module.exports = class Config {
    DEFAULT_CONFIG_FILE_DIR = path.join(os.homedir(), '.config', cliPackage.name)
    DEFAULT_CONFIG_FILE_PATH = path.join(os.homedir(), '.config', cliPackage.name, 'default.json')
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

            if (typeof value === 'object') {
                this.configuration[command][key] = {}
                Object.assign(this.configuration[command][key], value)
            } else {
                this.configuration[command][key] = value;
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
            fs.existsSync(this.DEFAULT_CONFIG_FILE_PATH) &&
            require(this.DEFAULT_CONFIG_FILE_PATH);
        if (!this.configuration) {
            this.configuration = defaultConfig;
            this.createFile()
        }
    }

    createFile = () => {
        if (!fs.existsSync(this.DEFAULT_CONFIG_FILE_DIR)) {
            fs.mkdirSync(this.DEFAULT_CONFIG_FILE_DIR, { recursive: true })
        }
        fs.writeFileSync(
            this.DEFAULT_CONFIG_FILE_PATH,
            JSON.stringify(this.configuration, null, 5)
        );
    }
}

