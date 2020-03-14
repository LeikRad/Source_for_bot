var fs = require("fs");
var request = require("request");
var options = { method: 'GET',
    url: 'https://api.twitch.tv/helix/streams?game_id=[insert game id here from twitch]&first=100'
    headers: {'Client-ID': '-----'
};
var C = 0

const Discord = require('discord.js')
const bot = new Discord.Client()

var Animals = ["Red Pandas", "Moths", "Seals", "Doggos", "Axolotls"]
var Boop = []
var object
var user_name = []
var X
removed = []

var temp = fs.readFileSync('./streamers.json', 'utf-8')
var streamerlist = JSON.parse(temp)
var streamerkeys = Object.keys(streamerlist)

bot.on('ready', () => {
    bot.user.setActivity(`Stalking Twitch`)
})

fs.readFile('./Token.txt', 'utf-8', function (err, bot_secret_token) {
    if (err)
	return console.error(err);
	bot.login(bot_secret_token);
    })
    bot.on('message', (receivedMessage) => {
        if (receivedMessage.author == bot.user) { // Prevent bot from responding to its own messages
	    return
        }

        if (receivedMessage.content.startsWith("<@!556632241850155008>")) {
            processCommand(receivedMessage)
        } else {
	return;
	}
    })

    function processCommand(receivedMessage) {
        let fullCommand = receivedMessage.content.substr(23) // Remove the leading exclamation mark
        let splitCommand = fullCommand.split(" ") // Split the message up in to pieces for each space
        var primaryCommand = splitCommand[0] // The first word directly after the exclamation is the command
		var primaryCommand = primaryCommand.toLowerCase()//Makes it lower case
		let arguments = splitCommand.slice(1) // All other words are arguments/parameters/options for the command
	if (((receivedMessage.member.roles.some(r=>["Moderator", "Zerglings", "Puppet Master"].includes(r.name))) || (receivedMessage.author.id === "217679970045132801") || (receivedMessage.author.id === "402509831845576724"))) {
		if (primaryCommand == "ping") {
			Ping(receivedMessage)
		}  else if(primaryCommand == "reboot") {
			reboot(receivedMessage)
		} else if(primaryCommand == "help") {
			Help(receivedMessage)
		} else if(primaryCommand == "stalk") {
			Stalk()
		} else if (primaryCommand == "verify") {
			Verify(receivedMessage)
		//} else if (primaryCommand == "test") {
		//	Test()
		//} else if (primaryCommand == "test2") {
		//	Test2(receivedMessage)
		} else {
    		        receivedMessage.channel.send("I don't understand the command. Type `@StreamBot help` and see what commands are availabe and what they do.")
		}
	} else {
		if (primaryCommand == "verify") {
			Verify(receivedMessage)
		} else {
			return
		}
	}
}
	function Stalk(){
    console.log("Starting the Request Function")
		bot.channels.get("591682660057874451").send("Starting.")
		var interval = setInterval (function () {                                               	//30 seconds requests
			request(options, function (error, response, body) {                                   	//Start: Get and parse json data to object
				if (error) throw new Error(error);
				var object = JSON.parse(body);                                                  //End: Get and parse json data to object
				for (var e in object.data) {
					var temp_username = [object.data[e].user_name]
					var temp_title = [object.data[e].title]
					var temp_game_id = [object.data[e].game_id]
          var temp_stream_url
          for (var t in streamerkeys){
            if (temp_username == streamerkeys[t]) {
              temp_stream_url = streamerlist[streamerkeys[t]]
              break
            } else {
              temp_stream_url = ("https://www.twitch.tv/" + temp_username)
            }
          }
          console.log(temp_stream_url)
					if (temp_username[0] == ""){
					break;
				} else {
					if (user_name.includes(temp_username[0])) {
						continue;
					} else {
						user_name.push(temp_username[0]);              //Start: Adding streamers to the list
						switch (temp_game_id[0]) {
							case "490617":
							bot.channels.get("591682660057874451").send(temp_username + " is playing The Black Watchmen. Go check them out at " + temp_stream_url + " ! \n```" + temp_title + "```")
							continue;
							case "497016":
							bot.channels.get("591682660057874451").send(temp_username + " is playing NITE Team 4. Go check them out at " + temp_stream_url + " ! \n```" + temp_title + "```")
							continue;
							case "501298":
							bot.channels.get("591682660057874451").send(temp_username + " is playing Ahnayro: The Dream World. Go check them out at " + temp_stream_url + " ! \n```" + temp_title + "```")
							continue;
						}
					}
				}
				}                                                                  //End: Adding streamers to the list
				for (var i in user_name) {                                         //Start: Start check if streamer is offline
					for (var z in object.data){
						var temp_username2 = object.data[z].user_name
						if (temp_username2.includes(user_name[i])) {
							X = 0
							break
						} else {
							X = 1
						}
					}
					if (X == 0){
						continue
					}
					removed.push(user_name[i])
				}
				if (object.data == "") {
					user_name.length = 0
				} else {
					for(r in removed){
						var index = user_name.indexOf(removed[r])
						if (index >-1){
							user_name.splice(index, 1);
						}
					}
				}
				removed = []
			});
		}, 60 * 1000);                                                                            //End: Start check if streamer is offline
	}

function Ping(receivedMessage) {
  console.log("Running the Ping Function")
	receivedMessage.channel.send(Animals[Math.floor(Math.random() * Animals.length)] + ` are CUTE! API Latency is ${Math.round(bot.ping)}ms`);
}

function reboot(receivedMessage) {
  console.log("Running the Reboot Function")
	receivedMessage.channel.send("Y/N?");
	const collector = new Discord.MessageCollector(receivedMessage.channel, m => m.author.id === receivedMessage.author.id, { time: 10000 });
	collector.on('collect', message => {
		if (message.content == "Y" || message.content == "y") {
			message.channel.send("Rebooting.");
			setTimeout(function() {
				process.exit(0)
			}, 3000)
		} else if (message.content == "N" || message.content == "n") {
			message.channel.send("Reboot aborted.");
		} else {
			message.channel.send("Invalid command entered. Aborting reboot")
		}
	})
}
function Help(receivedMessage) {
  console.log("Running the Help Function")
	receivedMessage.author.send("@StreamBot Stalk/stalk (better command name pending) = It will start the request function again if the bot was reboot. \n@StreamBot Ping/ping = Calculates the average latency of the API. \n@StreamBot Help/help = Gives you help based on every command \n@StreamBot Reboot/reboot = Restarts the bot in case of a emergency, if you feel confident you can try to run it again with !stalk. (I.e It's spamming or doing something it shouldn't, don't use it while it's behaving correctly.)")
}


function Verify(receivedMessage) {
	console.log("Running the Verify Function")
	if(receivedMessage.channel.id == "575727755941904395") {
		if(receivedMessage.member.roles.some(r=>["Verified"].includes(r.name))){
			receivedMessage.delete()
			return
		} else {
			let role = receivedMessage.guild.roles.find(r => r.name === "Verified");
			receivedMessage.member.addRole(role).catch(console.error);
			receivedMessage.delete()
		}
	} else {
	return
	}
}

bot.on('disconnect', function(erMsg, code) {
    console.log('----- Bot disconnected from Discord with code', code, 'for reason:', erMsg, '-----');
    bot.login(bot_secret_token);
});

bot.on('error', console.error)
