import * as Discord from 'discord.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import help from './commands/help';
import MakeGame from './commands/makeGame';
import Account from './models/account';

dotenv.config();

const client = new Discord.Client({
  partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_MEMBER', 'USER'],
});
const prefix = '!';

mongoose.Promise = global.Promise; // Node의 네이티브 Promise 사용
// mongoDB 연결
mongoose
  .connect(process.env.MONGO_URI, {
    useMongoClient: true,
  })
  .then(() => {
    console.log('[PASS] Successfully Connected to MongoDB');
  })
  .catch((e) => {
    console.error(e);
  });

client.once('ready', () => {
  console.log(`[PASS] Successfully Logged in as ${client.user.tag}`);
  client.user.setActivity('DEVELOPING', { type: 'PLAYING' });
});

client.on('message', (message) => {
  if (!message.content.startsWith('!') || message.author.bot) return;
  if (message.guild === null) {
    message.channel.send('ERROR, 끝말잇기 서버에서 이용해주세요');
    return;
  }
  if (`${process.env.SERVER_ID}` !== `${message.guild.id}`) {
    message.channel.send('끝말잇기 서버가 아닙니다.');
    return;
  }

  if (Account.findById(message.author.id) === null) {
    try {
      const id = message.author.id;
      const username = message.author.username;
      const thumbnail = message.author.displayAvatarURL;
      Account.localRegister({ id, username, thumbnail });
    } catch (err) {
      console.error(err);
    }
  }
  console.log(Account.findById(message.author.id) === null);

  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();

  switch (command) {
    case '도움말':
      message.delete();
      help(message);
      break;
    case 'help':
      message.delete();
      help(message);
      break;
    case '방생성':
      message.delete();
      MakeGame(message, args);
      break;
  }
});

client.on('messageReactionAdd', async (reaction, user) => {
  if (user === client.user || reaction.message.author !== client.user) return;
});

client.login(process.env.TOKEN);
