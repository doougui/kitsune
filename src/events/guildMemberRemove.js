module.exports = async (client, member) => {
  client.logger.log(`${member.displayName} (${member.id}) has left the server ${member.guild}.`);

  const channel = client.getChannel({ member, channelId: process.env.WELCOME_CHAT });
  channel.send(`${member.displayName} saiu do servidor.`);

  const emojiNum = client.convertNumberIntoEmoji(member.guild.memberCount);

  channel.edit({
    topic: `Atualmente há ${emojiNum} membros no servidor.`
  });
};
