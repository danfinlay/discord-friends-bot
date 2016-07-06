var Discord = require("discord.js");
var auth = require('./auth.json')
var request = require('request')

var path = require('path')
var friendsPath = path.join(__dirname, 'friends_forever.mp3')
var friendsForever = 'https://www.youtube.com/watch?v=MwreUpE1Ulk'

// Local private variables:
var channels, bootMessage, mainChat, voiceConnection

// Playing random game
var games = [
  'head games',
  'games with your heart',
  'to win']
var game = games[ Math.round(Math.random() * games.length) ]
game = 'to win' // override for now

// Human useful bot adding flow for adding this bot to new channels.
var addBotFlow = 'https://discordapp.com/oauth2/authorize?client_id=199328977058267137&scope=bot&permissions=0'

var help = `Hi, I'm FriendsBot! I love singing about friends!
A few things you can ask of me:
!friends: I will paste a link to a youtube video about friends.
!sing: I will sing in the General voice chat about friends.
!stop: I will stop singing in the General voice chat about friends.`


var mybot = new Discord.Client();
mybot.loginWithToken(auth.token)

mybot.on('ready', function(err) {
  if (err) throw err

  mainChat = channelForName(mybot.channels, 'general')

  // Speak any configured boot message
  if (bootMessage) {
    emitBootMessage(mybot)
  }

  mybot.setPlayingGame(game, function(err) {
    if (err) { throw err }
  })

  mybot.on('message', function(message) {
    answerMessage(mybot, message)
  })
})

function emitBootMessage(mybot) {
  mybot.sendMessage(mainChat, bootMessage, function(err, message) {
    if (err) {
      console.error(`Failed to send message ${bootMessage}`)
      console.error(err)
      throw err
    }
  })
}

function answerMessage(mybot, message) {
  if (message.content[0] !== '!') { return }

  channels = message.channel.server.channels

  if (message.content === '!friends') {
    mybot.reply(message, friendsForever)
  } else if (message.content.indexOf('!sing') === 0) {
    var url = message.content.split(' ')[1]
    singThatSong(mybot, url)
  } else if (message.content === '!stop') {
    stopSinging(mybot)
  } else if (message.content === '!help') {
    mybot.reply(message, help)
  }
}

function getMainVoiceChannel(channels) {
  return channelForName(channels, 'General')
}

function channelForName(channels, name) {
  return channels.filter((channel) => {
    return channel.name === name
  })[0]
}


function singThatSong(mybot, url) {
  var channel = getMainVoiceChannel(channels)
  var song, playMethod

  if (!url) {
    song = friendsPath
    playMethod = 'file'
  } else {
    song = request(url)
    playMethod = 'stream'
  }

  mybot.joinVoiceChannel(channel, function(err, voiceConn) {
    voiceConnection = voiceConn
    if (!voiceConnection.playing) {

      let playFunc
      if (playMethod === 'file') {
        playFunc = voiceConnection.playFile.bind(voiceConnection)
      } else {
        playFunc = voiceConnection.playRawStream.bind(voiceConnection)
      }

      console.log(`Attempting to play ${song}`)
      playFunc(song, {
        volume: 0.25
      }, function(err, streamIntent) {
        if (err) {
          console.error('Playing failed')
          console.error(err)
          throw err
        }

        streamIntent.on('end', function() {
          stopSinging(mybot)
        })

        streamIntent.on('error', function(err) {
          console.error('audio stream had error:')
          console.error(err)
          throw err
        })
      })
    }
  })
}

function stopSinging() {
  if (!voiceConnection) { return }

  console.log('stopping song, leaving channel.')
  voiceConnection.destroy(function(err) {
    if (err) {
      console.log('Bot failed to leave channel')
      throw err
    }
  })
}
