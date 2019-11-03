const Discord = require('discord.js');

module.exports = {
	async execute(client, message, args) {
		avatarEmbed = new Discord.RichEmbed()
			.setColor('#a50008');

		if (!message.mentions.users.size) {
			avatarEmbed
				.setTitle('👤 >> Seu avatar')
				.setImage(message.author.displayAvatarURL);

			return message.channel.send(avatarEmbed);
		}
		
		if (message.mentions.users.size <= 3) {
			message.mentions.users.map(user => {
				avatarEmbed
					.setTitle(`👥 >> Avatar de ${user.username}`)
					.setImage(user.displayAvatarURL)

				return message.channel.send(avatarEmbed);
			});
		} else {
			return message.reply('você pode pegar o avatar de apenas três usuários por vez.');
		}
	},

	get cmdInfo() {
		return {
			name: 'avatar',
			description: 'Show user\'s avatar.',
			guildOnly: false,
			args: false,
			usage: '<opcional: [usuário]>'
		};
	},
};
