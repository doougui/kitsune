module.exports = async (client, guild) => {
  client.logger.log(`I've joined the server ${guild.name}.`);

  const channel = client.getChannel({ guild, channelId: process.env.WELCOME_CHAT });
  const emojiNum = client.convertNumberIntoEmoji(guild.memberCount);

  channel.edit({
    topic: `Atualmente há ${emojiNum} membros no servidor.`
  });
};
