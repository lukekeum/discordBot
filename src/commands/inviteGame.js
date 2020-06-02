import Discord, { ReactionCollector } from 'discord.js';

const filterChecked = (reaction, user) => {
  return '✅' === reaction.emoji.name;
};

const filterDenied = (reaction, user) => {
  return '❌' === reaction.emoji.name;
};

let object = {};

export const inviteGameEvent = async (reaction, user0, guild) => {
  const fetchMessage = await reaction.message.fetch();
  let targetPerson;
  if (fetchMessage.reactions.cache.find(filterChecked).count === 2) {
    let copyObject = {}; // remove player's info from Object array...
    for (let ArrayofInfo in Object.entries(object)) {
      if (ArrayofInfo[0] === user0.id) {
        targetPerson = ArrayofInfo[1];
        continue;
      }
      copyObject[ArrayofInfo[0]] = ArrayofInfo[1];
    }
    object = copyObject;
    // TODO: add role to player
    const user = guild.member.cache(targetPerson);
    console.log(user);
    console.log(`[LOG] ${user.id} joined channel`);
  }
  if (fetchMessage.reactions.cache.find(filterDenied).count === 2) {
    // TODO: condition of if player clicked cross mark
  }
};

const InviteGame = (message, args) => {
  if (args.length !== 1) {
    const errorEmbed = new Discord.MessageEmbed()
      .setColor('#bf3b3b')
      .setDescription(':loudspeaker: **ERROR**\n올바른 명령어를 입력해주세요');
    message.channel
      .send(errorEmbed)
      .then((msg) => msg.delete({ timeout: 3000 }));
    return;
  }
  if (message.mentions.members.first() === null) {
    const errorEmbed = new Discord.MessageEmbed()
      .setColor('#bf3b3b')
      .setDescription(
        ':loudspeaker: **ERROR**\n올바른 플레이어를 맨션해주세요',
      );
    message.channel
      .send(errorEmbed)
      .then((msg) => msg.delete({ timeout: 3000 }));
    return;
  }
  if (object[message.mentions.members.id]) {
    const errorEmbed = new Discord.MessageEmbed()
      .setColor('#bf3b3b')
      .setDescription(
        ':loudspeaker: **ERROR**\n해당 플레이어는 이미 초대장을 받았습니다',
      );
    message.channel
      .send(errorEmbed)
      .then((msg) => msg.delete({ timeout: 3000 }));
    return;
  }
  const requestEmbed = new Discord.MessageEmbed()
    .setColor('#ff9500')
    .setDescription(
      `:bell: **초대장이 도착했습니다**\n\n**${message.author.username}**님이 당신을 방에 초대했습니다\n초대장을 수락/거절할려면, 아래의 이모지를 눌러주세요\n본 초대장은 60초동안 유효합니다`,
    );
  message.mentions.members
    .first()
    .send(requestEmbed)
    .then(async (msg) => {
      try {
        await msg.react('✅');
        await msg.react('❌');
      } catch (err) {
        console.error(err);
      }
      msg.delete({ timeout: 60000 });
    });
  object[message.mentions.members.id] = message.author.id;
};

export default InviteGame;
