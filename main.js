const Discord = require('discord.js')
const axios = require('axios')
const client = new Discord.Client()

//What you need to use the command
const prefix = '-'

const fs = require('fs')

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
        let clashDate = new Date(clashTime)
        return clashDate.toString()
    }

    if(command === 'yow'){
        client.commands.get('yow').execute(message, args)
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
            let response = await axios.get('https://oc1.api.riotgames.com/lol/clash/v1/tournaments?api_key=RGAPI-31bdddc2-bc62-42a4-8a5c-c6ab00f8c8f4')
            let clash = response.data
            return clash
        }
        let clashValue = await getList()
        let clashTime = clashValue[0].schedule[0].startTime
        let clashDate = convertTime(clashTime)
        console.log(clashValue);
        
        message.reply(`Clash Time: \n${clashDate}`)
    }
})



//This must be the last line
client.login('NzczMzI5ODY0OTMyOTgyODE2.X6Hpjw.6-4hdyKf4LOWCmSFwIbOqx7u_Vo')

