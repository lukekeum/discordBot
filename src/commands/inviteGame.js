import Discord, { ReactionCollector } from 'discord.js';

const reactionGameAccept = (reaction, user) => {};

const reactionGameDeny = (reaction, user) => {};

const filter = (reaction, user) => {
  return ['✅', '❌'].includes(reaction.emoji.name) && !user.bot;
};

const object = {};

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
      /*
      msg
        .awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
        .then((collected) => {
          const reaction = collected.first();

          if (reaction.emoji.name === '✅') {
            // TODO: return Accept Message and run Algorithm
            msg.delete();
            reactionGameAccept(reaction, user);
          } else if (reaction.emoji.name === '❌') {
            // TODO: return DENY message
            msg.delete();
            reactionGameDeny(reaction, user);
          }
        })
        .catch((err) => console.error(err));
        */
    });
};

export default InviteGame;
