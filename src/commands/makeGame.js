import Discord from 'discord.js';

import randomID from '../api/randomID';

const client = new Discord.Client();

export default async function MakeGame(message, args) {
  if (args.length == 0 || args.length != 2) {
    const exampleEmbed = new Discord.MessageEmbed()
      .setColor('#bf3b3b')
      .setDescription(':loudspeaker: **ERROR**\n올바른 명령어를 입력해주세요');
    message.channel.send(exampleEmbed);
    return;
  }
  if (!(args[1] === '공개' || args[1] === '비공개')) {
    const exampleEmbed = new Discord.MessageEmbed()
      .setColor('#bf3b3b')
      .setDescription(':loudspeaker: **ERROR**\n올바른 명령어를 입력해주세요');
    message.channel.send(exampleEmbed);
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
  channel.send(optionEmbed).then((msg) => {
    msg
      .react('1️⃣')
      .then(() => msg.react('2️⃣'))
      .then(() => msg.react('3️⃣'));
  });
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
}
