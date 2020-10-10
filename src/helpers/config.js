const fs = require('fs')
const path = require('path')

module.exports = class Config {
    DEFAULT_CONFIG_FILE_PATH = './../configs/default.json'
    DEFAULT_CONFIG_NAME = 'default'
    configuration = {}

    constructor() {
        this.loadConfig()
    }

    getConfig = (action) => {
        if (this.configuration[action]) {
            return this.configuration[action]
        }
        return {}
    }

    addConfig = (action, name, value) => {
        try {
            if (!this.configuration[action]) {
                this.configuration[action] = {}
            }
            
            if (!this.configuration[action][name]) {
                this.configuration[action][name] = {}
            }

            Object.assign(this.configuration[action][name], value)

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

