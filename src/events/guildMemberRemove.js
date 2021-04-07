const { Servers } = require('../dbObjects');

module.exports = async (client, member) => {
  client.logger.log(`${member.displayName} (${member.id}) has left the server ${member.guild}.`);

  let server;
  try {
    server = await Servers.findOne({
      attributes: ['welcome_channel'],
      where: {
        id: member.guild.id
      }
    });

    if (!server) return;
  } catch (error) {
    return client.logger.error(`Failed to get server info when user left a guild. ${error}`);
  }

  const channel = member.guild.channels.cache.find(ch => ch.id === server.dataValues.welcome_channel);

  channel.send(`${member.displayName} saiu do servidor.`);

  const emojiNum = client.convertNumberIntoEmoji(member.guild.memberCount);

  channel.edit({
    topic: `Atualmente há ${emojiNum} membros no servidor.`
  });
};
