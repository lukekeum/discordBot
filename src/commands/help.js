import Discord from 'discord.js';

const help = (message) => {
  const exampleEmbed = new Discord.MessageEmbed()
    .setColor('#34EB3D')
    .setDescription(
      ':mag: **도움말**\n\n**명령어**\n- **!방생성 [방이름] [공개/비공개]** 방을 생성합니다\n- **!방참가 [방번호]** 방에 참가합니다\n- **!방초대 @[이름]** 사용자를 자신의 방에 초대합니다\n- **!게임시작** 방에 있을 때만 사용가능합니다 (방장전용)\n- **!랭킹** 레벨 순위를 확인합니다\n\n- **!신고 [플레이어ID] [사유]** 플레이어를 신고합니다\n',
    );
  message.channel.send(exampleEmbed);
};

export default help;
