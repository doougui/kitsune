const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
  async execute (client, message, args) {
    const policeEmojis = ['🚓', '🚔', '👮‍♂️', '👮‍♀️', '🚨'];
    message.react(client.getRandomItem(policeEmojis));

    const nudes = [];

    const nudeFiles = fs.readdirSync('./assets/img/nude');
    nudeFiles.forEach(file => nudes.push(file));

    const randomNude = client.getRandomItem(nudes);

    const imgAttachment = new Discord.MessageAttachment(
      `./assets/img/nude/${randomNude}`,
      `${randomNude}`
    );

    const nudeEmbed = new Discord.MessageEmbed()
      .setColor('#a50008')
      .setTitle('``🚔`` » Eles estão chegando...')
      .attachFiles([imgAttachment])
      .setImage(`attachment://${randomNude}`);

    message.channel.send(nudeEmbed);
  },

  get info () {
    return {
      name: 'manda nudes',
      description: 'Cuidado....',
      requirePrefix: false
    };
  }
};
