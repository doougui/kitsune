module.exports = async (client, member) => {
  const helpers = require('../modules/functions');

  client.logger.log(`${member.displayName} (${member.id}) has entered the server ${member.guild}.`);

  const channel = helpers.getChannel(member, process.env.WELCOME_CHAT);
  channel.send(`Bem-vindo ao servidor, ${member}.`);

  const emojiNum = helpers.convertNumberIntoEmoji(member, member.guild.memberCount);

  channel.edit({
    topic: `Atualmente há ${emojiNum} membros no servidor.`
  });
};
