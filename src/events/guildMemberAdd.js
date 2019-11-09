module.exports = async (client, member) => {
  const helpers = require('../modules/functions');

  client.logger.log(`${member.displayName} (${member.id}) has entered the server ${member.guild}.`);

  const channel = helpers.getWelcomeChannel(member);
  channel.send(`Bem-vindo ao servidor, ${member}.`);

  helpers.updateTopicWithEmojiNum(member, channel);
};
