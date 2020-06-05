import Discord from 'discord.js';

const filterChecked = (reaction, user) => {
  return '✅' === reaction.emoji.name;
};

const filterDenied = (reaction, user) => {
  return '❌' === reaction.emoji.name;
};

let object = {};

const getUserFromMention = (mention) => {
  if (!mention) return;

  if (mention.startsWith('<@') && mention.endsWith('>')) {
    mention = mention.slice(2, -1);

    if (mention.startsWith('!')) {
      mention = mention.slice(1);
    }

    return mention;
  }
};

export const inviteGameEvent = async (reaction, user, guild) => {
  reaction.message.delete();
  const fetchMessage = await reaction.message.fetch();
  let targetPerson;
  if (fetchMessage.reactions.cache.find(filterChecked).count === 2) {
    let copyObject = {}; // remove player's info from Object array...
    for (let ArrayofInfo of Object.entries(object)) {
      if (`${ArrayofInfo[0]}` === `${user.id}`) {
        targetPerson = ArrayofInfo[1];
        continue;
      }
      copyObject[ArrayofInfo[0]] = ArrayofInfo[1];
    }
    object = copyObject;
    // TODO: add role to player
    const targetPlayer = guild.members.cache.find(
      (member) => member.id === targetPerson,
    );
    const role = targetPlayer.roles.cache.find((roles) =>
      roles.name.includes('HeadGamer-'),
    );
    const roomNumber = role.name.split('-')[1];
    user.roles.add(
      guild.roles.cache.find((roles) => roles.name === `Player-${roomNumber}`),
    );
    console.log(`[LOG] ${user.id} joined channel from ${targetPlayer.id}`);
  }
  if (fetchMessage.reactions.cache.find(filterDenied).count === 2) {
    // TODO: condition of if player clicked cross mark
    inviteTimeout();
  }
};

const inviteTimeout = () => {
  console.log('denied');
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
      let time = 60;
      const interval = setInterval(functionalTimer, 1000);
      function functionalTimer() {
        console.log(time);
        time--;
        if (time < 1) {
          clearTimeout(interval);
          if (msg) {
            msg.delete();
            inviteTimeout();
          }
        }
        return;
      }
    });
  object[getUserFromMention(args[0])] = message.author.id;
  console.log(object);
};

export default InviteGame;
