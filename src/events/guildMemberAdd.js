const { Servers } = require('../dbObjects');

module.exports = async (client, member) => {
  client.logger.log(`${member.displayName} (${member.id}) has joined the server ${member.guild}.`);

  let guild;
  try {
    guild = await Servers.findOne({
      attributes: ['welcome_channel'],
      where: {
        id: member.guild.id
      }
    });

    if (!guild) return;
  } catch (error) {
    return client.logger.error(`Failed to get guild info when user joined a guild. ${error}`);
  }

  const channel = member.guild.channels.cache.find(ch => ch.id === guild.dataValues.welcome_channel);

  channel.send(`Bem-vindo(a) ao servidor, ${member}.`);

  const emojiNum = client.convertNumberIntoEmoji(member.guild.memberCount);

  channel.edit({
    topic: `Atualmente há ${emojiNum} membros no servidor.`
  });
};
