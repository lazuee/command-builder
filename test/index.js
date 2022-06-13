const { Client, Intents } = require('discord.js');
const { Command, CommandStore } = require('../');

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
  ],
  partials: ['CHANNEL', 'MESSAGE'],
  restWsBridgeTimeout: 60000,
  allowedMentions: { parse: ['users', 'roles'], repliedUser: true },
});
CommandStore.client = client;

const test = new Command('test', 'description')
  .setExecutor(async arg => {
    if (arg.isMessage()) {
      return arg.reply({ content: arg.content });
    } else if (arg.isInteraction()) {
      return arg.reply({ content: arg.content });
    }
  })
  .addOption()
  .addMemberPermissions(['EMBED_LINKS', 'READ_MESSAGE_HISTORY', 'SEND_MESSAGES', 'VIEW_CHANNEL'])
  .addBotPermissions(['ADD_REACTIONS', 'EMBED_LINKS', 'READ_MESSAGE_HISTORY', 'SEND_MESSAGES', 'VIEW_CHANNEL']);

console.log(test.toCommand());
console.log(test.toSlash());
