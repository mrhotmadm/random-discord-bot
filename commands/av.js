const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "av",
    description: "butt",
    async execute(message, args) {
        if (args[0]) {
            const user = message.mentions.users.first();
            message.channel.send(new MessageEmbed().setColor('GREEN').setImage(user.displayAvatarURL({size: 2048})));
        } 
        else {
            message.channel.send(new MessageEmbed().setColor('GREEN').setImage(message.author.displayAvatarURL({size: 2048})));
        }
    }
}