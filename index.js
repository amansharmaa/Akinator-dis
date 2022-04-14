require("dotenv").config();
const chalk = require('chalk');
const express = require('express')
const app = express()
const port = 8080

app.get('/', (req, res) => {
  res.send('Server Online!')
})

app.listen(port, () => {
    console.log(`${chalk.green(`Server online!`)}`)
})

// Code
const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client({disableEveryone: true});
client.akinator = require('./util/akinator');
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

// Ready
client.on('ready', () => {
  console.log(`${client.user.username} is Online`)
setInterval(async () => {
const statuses = [`Akinator Discord`, `with ${await client.users.cache.size} Users`, `${process.env.prefix}aki`]
   client.user.setActivity(statuses[Math.floor(Math.random() * statuses.length)], { type: "STREAMING", url: "https://www.twitch.tv/Amansharmaa"})
}, 10000)
});

// Command Handler
client.on("message", async message => {
  if (message.author.bot || message.channel.type === "dm") return;
// command 
  let messageArray = message.content.split(" "),
    cmd = messageArray[0].toLowerCase(),
    args = messageArray.slice(1),
    prefix = process.env.prefix; // Add Prefix

  if (!message.content.startsWith(prefix)) return;
  let commandfile = client.commands.get(cmd.slice(prefix.length)) || client.commands.get(client.aliases.get(cmd.slice(prefix.length)));
  if (commandfile) commandfile.run(client, message, args);

});


fs.readdir("./commands/", (err, files) => {
  if (err) console.log(err);
  let jsfile = files.filter(R => R.endsWith('.js'));
  if (jsfile.length <= 0) {
    return console.log(chalk.red("There are no commands"));
  }
  jsfile.forEach((f, i) => {
    let pull = require(`./commands/${f}`);
    console.log(`Loaded - ${f} | ${pull.config.aliases}`)

    client.commands.set(pull.config.name, pull);
if (pull.config.aliases) pull.config.aliases.forEach(alias => client.aliases.set(alias, pull.config.name))
  });
});
// Login
client.login(process.env.token); // Your Discord Bot Token
