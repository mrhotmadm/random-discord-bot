// -- Modules -- 
const Discord = require('discord.js');
const bot = new Discord.Client({ partials: ['CHANNEL', 'MESSAGE', 'REACTION'] });
const fs = require('fs');
const db = require('mongoose');
const GuildSchema = require('./schemas/GuildSchema.js');
const dbOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true
}

// -- Collections --
bot.commands = new Discord.Collection();
// bot.category = new Discord.Collection();
// bot.aliases = new Discord.Collection();

// -- Config --
const configuration = require("./config.json");
const MONGO_URI = process.env.MONGO_URI || config.MONGO_URI;
const TOKEN = process.env.TOKEN || config.TOKEN;
const PREFIX = process.env.PREFIX || config.PREFIX;

// -- Login --
bot.login(TOKEN);

// -- CMD Handler -- 
const commandFiles = fs.readdirSync('./commands')
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    bot.commands.set(command.name, command)
}

bot.once('ready', () => {
    console.log(`Nexus is online!`);
    
    // -- MongoDB Connect --
    db.connect(MONGO_URI, dbOptions)
        .then(() => console.log('connected to mongodb'))
        .catch(err => console.log(err));
})

bot.on('message', async (message) => {
    if (message.channel.type === "dm") return
    
    if (message.author.bot) return;
    
    const dbres = await GuildSchema.findOne({guildId: message.guild.id})
    if (!dbres) {
        const newPrefix = new GuildSchema({
            guildId: message.guild.id,
            prefix: PREFIX
        })
            
        await newPrefix.save().catch(err => console.log(err));
    }
    
    const prefix = dbres.prefix;

    if (!message.content.startsWith(prefix)) return;
    const args = message.content.substring(prefix.length).split(" ");
    const command = args.shift();

    const cmd = bot.commands.get(command);
    
    if (!cmd) return;
    
    try {
        cmd.execute(message, args, bot);
    } 
    catch (error) {
        console.log(error);
        message.channel.send(error);
    }
})
