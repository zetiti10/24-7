const bot = require("./bot.js")
const configuration = require("./configuration.js")
const api = require("./api.js")

console.log("Starting...")

let botList = []
const botNames = configuration.getBots()
for (let i = 0; i < botNames.length; i++) {
  let MFBot = new bot.Bot(configuration.getBotConfig(botNames[i]))
  botList.push(MFBot)

  MFBot.start()
}

api.startServer(botList)