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
  console.log(message.guild.id);
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
  }
});

const filter = (reaction, user) => {
  return '✅' === reaction.emoji.name;
};

client.on('guildMemberAdd', async (member) => {
  const guild = client.guilds.cache.find((g) => g.id === '715790300672426105');
  const channel = guild.channels.cache.find(
    (ch) => ch.id === `715791707513290812`,
  );
  member.roles.add('717382493652779008');
  const joinEmbed = new Discord.MessageEmbed()
    .setColor('#3786db')
    .setTitle('DuiKKUT Discord - Welcome')
    .setDescription(
      `안녕하세요 <@${member.id}>! 디스코드 끝말잇기 서버에 오신 것을 환영합니다. 본 서버의 모든 권한을 얻기 위해선, 인증채널에서 이모지를 눌러주세요. <#717545096995799112>에서 규칙을 꼭 읽고, 게임 진행을 해 주시길 바랍니다`,
    )
    .setThumbnail('https://cdn.discordapp.com/embed/avatars/3.png');
  channel.send(`<@${member.id}>`);
  channel.send(joinEmbed);
});

client.on('messageReactionAdd', async (reaction, user) => {
  if (reaction.message.id === '717386338877571153' && !user.bot) {
    await reaction.message.reactions.removeAll;
    await reaction.message.react('👍');
    const guildMember = reaction.message.guild.member(user);
    guildMember.roles.remove('717382493652779008');
    guildMember.roles.add('717382544340942868');
  }
  if (!reaction.message.guild && !user.bot) {
    // fetch message -> resolve promise from fetch -> message#reactions
    inviteGameEvent(
      reaction,
      user,
      client.guilds.cache.find((g) => g.id === '715790300672426105'),
    );
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
