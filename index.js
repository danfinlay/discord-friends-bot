var Discord = require("discord.js");
var auth = require('./auth.json')

var friendsForever = 'https://www.youtube.com/watch?v=MwreUpE1Ulk'

// Playing random game
var games = [
  'head games',
  'games with your heart',
  'to win']
var game = games[ Math.round(Math.random() * games.length) ]
game = 'to win' // override for now

// Human useful bot adding flow for adding this bot to new channels.
var addBotFlow = 'https://discordapp.com/oauth2/authorize?client_id=199328977058267137&scope=bot&permissions=0'



var mybot = new Discord.Client();
mybot.loginWithToken(auth.token)

mybot.on('ready', function(err) {
  if (err) throw err

  mybot.setPlayingGame(game, function(err) {
    if (err) { throw err }
  })

  mybot.on("message", function(message) {
    if (message.content[0] !== '!') { return }

    if (message.content === '!friends') {
      mybot.reply(message, friendsForever)
    }

    if (message.content === '!ping') {
      mybot.reply(message, 'pong!')
    }
  })
})

