var Discord = require("discord.js");
var auth = require('./auth.json')

var path = require('path')
var friendsPath = path.join(__dirname, 'friends_forever.mp3')
var friendsForever = 'https://www.youtube.com/watch?v=MwreUpE1Ulk'

var channels

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
      //mybot.reply(message, friendsForever)
      channels = message.channel.server.channels

      singThatSong(mybot)

    } else if (message.content === '!sing') {
    }

    if (message.content === '!ping') {
      mybot.reply(message, 'pong!')
    }
  })
})

function singThatSong(mybot) {
  var channel = channels.filter((channel) => {
    return channel.name === 'General'
  })[0]

  mybot.joinVoiceChannel(channel, function(err, voiceConnection) {

    if (!voiceConnection.playing) {

      voiceConnection.playFile(friendsPath, {
        volume: 0.25
      }, function(err, streamIntent) {
        if (err) {
          console.error('Playing friends failed')
          console.error(err)
        }

        streamIntent.on('end', function() {
          mybot.leaveVoiceChannel(channel, function(err) {
            if (err) {
              console.log('Bot failed to leave channel')
            }
          })
        })
      })
    }
  })
}
