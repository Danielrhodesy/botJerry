const Discord = require('discord.js')
const axios = require('axios')
const client = new Discord.Client()
require('dotenv').config()
const fs = require('fs')

//What you need to use the command
const prefix = '-'

const riotApiKey = process.env.RIOT_API_KEY
const discBotKey = process.env.DISCORD_BOT_KEY


client.commands = new Discord.Collection()

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'))
for(const file of commandFiles){
    const command = require(`./commands/${file}`)
    client.commands.set(command.name, command)
}


client.once('ready', () => {
    console.log('botJerry is ready!');
})



client.on('message', async message => {
    if(!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/)
    const command = args.shift().toLowerCase();

    function convertTime(clashTime){
        let clashTeirTime = clashTime - 7200000
        let clashDate = new Date(clashTeirTime)
        return clashDate.toString()
    }

    if(command === 'yow'){
        client.commands.get('yow').execute(message, args)
    } else if (command === 'list') {
        client.commands.get('list').execute(message, args)
    } else if (command === 'joke'){
        let getList = async () => {
            let response = await axios.get('https://official-joke-api.appspot.com/random_joke')
            let joke = response.data
            console.log(joke)
            return joke
        }
        let jokeValue = await getList()
        console.log(jokeValue);
        message.reply(`Jerrys joke: \n${jokeValue.setup} \n\n ${jokeValue.punchline}`)
    } else if(command === 'clash'){
        let getList = async () => {
            let response = await axios.get(`https://oc1.api.riotgames.com/lol/clash/v1/tournaments?api_key=${riotApiKey}`)
            let clash = response.data
            return clash
        }
        let clashValue = await getList()
        let clashWeek = clashValue.map(x => x.schedule[0].startTime)
        let clashWeekDate = clashWeek.map(x => convertTime(x)).reverse() 
        
        
        //Message Send
        message.reply(`Clash Time: \n Day 1: ${clashWeekDate[0]}\n Day 2: ${clashWeekDate[1]}\n Day 3: ${clashWeekDate[2]}\n Day 4: ${clashWeekDate[3]}`)
    }   
    
    // else if (command === 'call'){

    //     if(!message.member.voiceChannel){
    //         message.channel.send("You gotta be in a channel")
    //     }

    //     if(!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection){
    //         message.channel.send(`Wassup boys`)
    //     })

    // }
})



//This must be the last line
client.login(`${discBotKey}`)

