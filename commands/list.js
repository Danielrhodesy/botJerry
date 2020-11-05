module.exports = {
    name: 'list',
    description: "This is a list command",
    execute(message,args){
        message.channel.send(`Here the list g: \n -yow \n -joke \n -clash`)
    }
}