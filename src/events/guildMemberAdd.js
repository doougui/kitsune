module.exports = async (client, member) => {
  client.logger.log(`${member.displayName} (${member.id}) has entered the server ${member.guild}.`);

  const channel = client.getChannel({ member, channelId: process.env.WELCOME_CHAT });
  channel.send(`Bem-vindo ao servidor, ${member}.`);

  const emojiNum = client.convertNumberIntoEmoji(member.guild.memberCount);

  channel.edit({
    topic: `Atualmente há ${emojiNum} membros no servidor.`
  });
};
