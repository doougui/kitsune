const { Servers } = require('../dbObjects');

module.exports = async (client, guild) => {
  client.logger.log(`I've joined the server ${guild.name}.`);

  const emojiNum = client.convertNumberIntoEmoji(guild.memberCount);

  let channel;
  try {
    channel = await Servers.findOne({
      attributes: ['welcome_channel'],
      where: {
        id: guild.id
      }
    });

    const server = await Servers.upsert({
      id: guild.id,
      name: guild.name,
      welcome_channel: (channel)
        ? channel.dataValues.welcome_channel
        : guild.systemChannelID
    });

    client.logger.log(`The server ${guild.name} was added or updated in the database.`);

    if (!server[0].dataValues.welcome_channel) return;
    channel = guild.channels.cache.find(ch => ch.id === server[0].dataValues.welcome_channel);
  } catch (error) {
    return client.logger.error(`Something went wrong with adding a server. ${error}`);
  }

  channel.send('Salve!');
  channel.edit({
    topic: `Atualmente há ${emojiNum} membros no servidor.`
  });
};
