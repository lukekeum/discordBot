import * as Discord from 'discord.js';
import dotenv from 'dotenv';

import help from './commands/help';
import MakeGame from './commands/makeGame';

dotenv.config();

const client = new Discord.Client();
const prefix = '!';

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  client.user.setActivity('DEVELOPING', { type: 'PLAYING' });
});

client.on('message', (message) => {
  if (`${process.env.SERVER_ID}` !== `${message.guild.id}`) {
    message.channel.send('끝말잇기 서버가 아닙니다.');
    return;
  }
  if (!message.content.startsWith('!') || message.author.bot) return;

  const server = message.guild;
  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === '도움말' || command === 'help') help(message);
  if (command === '방생성') {
    message.delete();
    MakeGame(message, args);
  }
});

client.login(process.env.TOKEN);
