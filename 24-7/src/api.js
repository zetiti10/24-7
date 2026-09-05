const express = require('express');
const bot = require("./bot.js")
const path = require('node:path');
const configuration = require("./configuration.js")


function startServer(bots) {
    function getBot(username) {
        for (let i = 0; i < bots.length; i++) {
            if (bots[i].options.username === username) {
                return bots[i]
            }
        }
        return undefined
    }
    const app = express()
    app.use(express.json());
    const port = 3000

    app.get('/', function (req, res) {
        res.sendFile(path.join(__dirname, 'html/index.html'));
    });

    app.get('/api/bot/{:username}/activate', (req, res) => {
        let username = req.params.username
        getBot(username).activate()
        res.json({ ok: true })
    })

    app.get('/api/bot/{:username}/desactivate', (req, res) => {
        let username = req.params.username
        getBot(username).desactivate()
        res.json({ ok: true })
    })

    app.get('/api/bots', (req, res) => {
        const botNames = configuration.getBots()
        res.json(botNames)
    })

    app.post('/api/bot/{:username}/command', (req, res) => {
        const html = req.body.content
        let username = req.params.username
        console.log(html)

        let bot = getBot(username).bot
        eval(html)

        res.json({
            success: true,
            content: html
        });
    });

    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}

module.exports = { startServer }