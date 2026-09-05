const mineflayer = require("mineflayer")
const configuration = require("./configuration.js")
const login = require("./login.js")

class Bot {
  constructor(options) {
    this.options = options
    this.connected = false
    this.bot = undefined
  }

  start() {
    if (this.options.activated && !this.connected) {
      this.activate()
    }
  }

  activate() {
    this.options.activated = true
    configuration.updateConfig("accounts." + this.options.username + ".activated", true)

    if (this.connected) { return }

    console.log("Connecting " + this.options.username + "...")
    this.bot = mineflayer.createBot(this.options)
    setTimeout(() => {
      console.log("Sending password for " + this.options.username + "...")
      login.sendAuthMeLogin(this.bot, this.options.password)
    }, 3000)
    this.connected = true
    console.log("Connected " + this.options.username + "!")

    this.bot.once('end', () => {
      this.connected = false

      if (!this.options.activated) { return }

      console.log("Lost reconnection for " + this.options.username + "! Trying to reconnect in 30 seconds.")
      setTimeout(() => {
        this.activate()
      }, 30000)
    })

    this.startChatControl()
  }

  startChatControl() {
    this.bot.on("chat", (username, message, translate, jsonMsg, matches) => {
      console.log(message)

      if (message.substring(0, 4) !== "me] ") {
        return;
      }
      // TODO : enregistrer en config les autorisés
      if (!configuration.isAuthorized(username)) {
        return
      }
      let command = message.substring(4)

      if (command.substring(0, 1) === "#") {
        try {
          command = command.substring(1).replace(/&/g, ".")
          eval(command)
        }
        catch (error) {
          const errorMessage = "Command execution failed: " + error
          console.log(errorMessage)
          this.bot.chat("/msg " + username + " " + errorMessage)
        }
      }
      else {
        this.bot.chat(command)
      }

      console.log(this.options.username, "ececuted the command", command, "on the order of", username + ".")
    })
  }

  desactivate() {
    this.options.activated = false
    configuration.updateConfig("accounts." + this.options.username + ".activated", false)

    if (!this.connected) { return }

    this.bot.quit()
    this.connected = false
    console.log("Disconnected " + this.options.username)
  }
}

module.exports = { Bot }