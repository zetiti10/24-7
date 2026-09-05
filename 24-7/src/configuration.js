const fs = require('node:fs')
const YAML = require('yaml')

let filePath = "/config/24-7.yaml"
if (process.env.NODE_ENV !== 'production') {
    filePath = "./24-7_config.yaml"
}

function getConfig() {
    try {
        const file = fs.readFileSync(filePath, 'utf8')
        const config = YAML.parse(file)
        return config
    } catch (err) {
        console.error(err)
    }
}

function writeConfig(config) {
    file = YAML.stringify(config)
    try {
        fs.writeFileSync(filePath, file);
    } catch (err) {
        console.error(err);
    }
}

function updateConfig(path, value) {
    const config = getConfig()

    const keys = path.split('.')
    let current = config

    for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]]
    }

    current[keys[keys.length - 1]] = value

    writeConfig(config)
}

function getBotConfig(username) {
    const config = getConfig()

    let botConfig = config["accounts"][username]
    botConfig["username"] = username

    const serverName = botConfig["server"]
    const serverConfig = config["servers"][serverName]
    botConfig["host"] = serverConfig["host"]
    botConfig["port"] = serverConfig["port"]
    botConfig["version"] = serverConfig["version"]

    return botConfig
}

function getBots() {
    const config = getConfig()

    let botList = []
    for (let bot in config["accounts"]) {
        botList.push(bot)
    }

    return botList
}

function isAuthorized(username) {
    const users = getConfig()["authorisations"]

    for (let i = 0; i < users.length; i++) {
        if (username === users[i]) {
            return true
        }
    }

    return false
}

module.exports = { getConfig, updateConfig, getBotConfig, getBots, isAuthorized }