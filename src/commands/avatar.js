module.exports = {
  name: 'avatar',
  description: 'Show user\'s avatar.',
  guildOnly: false,
  prefix: true,
  args: false,
  execute(message, args) {
		if (!message.mentions.users.size) {
		  return message.channel.send(`Seu icon: ${message.author.displayAvatarURL}`);
		}

		const avatarList = message.mentions.users.map(user => {
		  return `Icon de ${user.username}: ${user.displayAvatarURL}`;
		});

		message.delete();
		message.channel.send(avatarList);
  }
}