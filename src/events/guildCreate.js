module.exports = async (client, guild) => {
  client.logger.log(`I've joined the server ${guild.name}.`);

  const channel = guild.channels.cache.find(ch => ch.name === '👥・bem-vindo');
  if (!channel) return;
  const emojiNum = client.convertNumberIntoEmoji(guild.memberCount);

  channel.edit({
    topic: `Atualmente há ${emojiNum} membros no servidor.`
  });
};
