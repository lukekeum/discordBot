import Discord from 'discord.js';

import randomID from '../api/randomID';

const roundSettingRoom = [];

export const getReactionMakeGame = (roomNumber, reaction) => {
  const array = roundSettingRoom.filter((room) => room === roomNumber);
  if (array.length !== 1) {
    console.log('[ERROR] The Error Has Been Occured while getReaction');
    return;
  }
  if (reaction.emoji.name === '🗑️') {
    reaction.message.channel.delete(
      '[LOG] Player clicked Whaste Emoji to remove this channel',
    );
    // TODO: Delete data from database
    console.log(`[PASS] Room has been deleted [${roomNumber}]`);
    return;
  }
  console.log(`[PASS] Room has been setted [${roomNumber}]`);
  const index = roundSettingRoom.indexOf(roomNumber);
  roundSettingRoom.splice(index, 1);
  const exampleEmbed = new Discord.MessageEmbed()
    .setColor('#34EB3D')
    .setDescription(
      ':wave:  **성공**\n성공적으로 방을 만들었습니다. 이제 플레이어를 초대할 수 있어요\n- **!방초대 @[플레이어이름]** 플레이어를 방으로 초대합니다 ( 봇사용방전용 )   ',
    );
  // TODO: Edit data from database
  reaction.message.delete();
  reaction.message.channel.send(exampleEmbed);
};

export default async function MakeGame(message, args) {
  if (args.length != 2) {
    const exampleEmbed = new Discord.MessageEmbed()
      .setColor('#bf3b3b')
      .setDescription(':loudspeaker: **ERROR**\n올바른 명령어를 입력해주세요');
    message.channel
      .send(exampleEmbed)
      .then((msg) => msg.delete({ timeout: 3000 }));
    return;
  }
  if (!(args[1] === '공개' || args[1] === '비공개')) {
    const exampleEmbed = new Discord.MessageEmbed()
      .setColor('#bf3b3b')
      .setDescription(':loudspeaker: **ERROR**\n올바른 명령어를 입력해주세요');
    message.channel
      .send(exampleEmbed)
      .then((msg) => msg.delete({ timeout: 3000 }));
    return;
  }
  const optionEmbed = new Discord.MessageEmbed()
    .setColor('#6e6e6e')
    .setDescription(
      `:gear: **방설정**\n\n<@${message.author.id}>\n**라운드수**\n- **1.** 3라운드   \n- **2. ** 4라운드   \n- **3. ** 5라운드   \n\n이 메시지는 30초후에 사라집니다   `,
    );
  const guild = message.guild;
  const roomNumber = randomID(5);
  await guild.roles
    .create({
      data: {
        name: `Player-${roomNumber}`,
        mentionable: false,
      },
    })
    .then((role) => {
      message.member.roles.add(role);
    })
    .catch((err) => console.error(err));
  await guild.roles
    .create({
      data: {
        name: `HeadGamer-${roomNumber}`,
        mentionable: false,
      },
    })
    .then((role) => {
      console.log(`[LOG] ${message.author.id} joined room ${roomNumber}`);
      message.member.roles.add(role);
    })
    .catch((err) => console.error(err));
  const role = message.guild.roles.cache.filter(
    (role) => role.name === `Player-${roomNumber}`,
  );
  await guild.channels.create(`${args[0]}`, {
    type: 'text',
    topic: `방번호: ${roomNumber}`,
    parent: `715792584764817468`,
    permissionOverrites: [
      {
        allow: 'VIEW_CHANNEL',
        id: role.id,
      },
      {
        deny: 'VIEW_CHANNEL',
        id: message.guild.roles.everyone.id,
      },
    ],
  });
  const channel = guild.channels.cache.find(
    (ch) => ch.topic === `방번호: ${roomNumber}`,
  );
  if (args[1] === '공개') {
    const roomCreated = new Discord.MessageEmbed()
      .setColor('#34EB3D')
      .setDescription(
        `:white_check_mark: **성공**\n<#${channel.id}> 성공적으로 채널이 만들어졌습니다`,
      );
    message.channel
      .send(roomCreated)
      .then((msg) => msg.delete({ timeout: 3000 }));
  }
  channel.send(optionEmbed).then(async (msg) => {
    try {
      await msg.react('1️⃣');
      await msg.react('2️⃣');
      await msg.react('3️⃣');
      await msg.react('🗑️');
    } catch (err) {
      console.error(err);
    }
  });
  // TODO: Make data which is from database
  roundSettingRoom.push(roomNumber);
}
