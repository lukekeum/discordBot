import * as Discord from 'discord.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import help from './commands/help';
import MakeGame, { getReactionMakeGame } from './commands/makeGame';
import inviteGame, { inviteGameEvent } from './commands/inviteGame';
import Account from './database/models/account';

dotenv.config();

const client = new Discord.Client({
  partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
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

  const id = message.author.id;
  const username = message.author.username;
  const thumbnail = message.author.displayAvatarURL();
  //Account.localRegister({ id, username, thumbnail });
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
    case '방초대':
      message.delete();
      inviteGame(message, args);
    case 'a':
      message.delete();
      const messageEmbed = new Discord.MessageEmbed()
        .setColor('#bf3b3b')
        .setTitle('환영합니다')
        .setDescription(
          ' \n본 서버에 오신걸 환영합니다\n본 서버에서는 끝말잇기를 즐길 수 있습니다\n아래의 이모지를 누르시면, 권한을 얻을 수 있습니다\n권한을 얻으시고, 법전을 꼭 읽어주세요\n그로 인하여 일어나는 피해는 모두 본인과실인점 알아주시면 감사하겠습니다',
        );
      message.channel.send(messageEmbed).then((msg) => msg.react('👍'));
  }
});

const filter = (reaction, user) => {
  return '✅' === reaction.emoji.name;
};

client.on('messageReactionAdd', async (reaction, user) => {
  if (reaction.message.id === 717386338877571153 && !user.bot) {
    reaction.message.reactions.removeAll();
    reaction.message.react('👍');
    
  }
  if (!reaction.message.guild && !user.bot) {
    // fetch message -> resolve promise from fetch -> message#reactions
    inviteGameEvent(reaction, user, client.guilds.get('715791707513290812'));
    return;
  }
  const guild = reaction.message.guild;
  if (reaction.message.author !== client.user || user.bot) {
    return;
  }
  const topic = String(reaction.message.channel.topic);
  if (topic.includes('방번호: ')) {
    if (user.bot) return;
    const channelNumber = topic.replace('방번호: ', '');
    getReactionMakeGame(channelNumber, reaction);
  }
  // TODO: get Room Number with role ==> <Guild>.roles.cache.find(r => r.name === "the string");
});

client.login(process.env.TOKEN);
