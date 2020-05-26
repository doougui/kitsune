const Discord = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
  async execute (client, message, args) {
    const cats = ['😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '🐱', '🐈', '🐱‍👓', '🐱‍💻', '🐱‍🚀', '🐱‍🐉', '🐱‍👤'];

    const { file } = await fetch('https://aws.random.cat/meow').then(response => response.json());

    const catEmbed = new Discord.MessageEmbed()
      .setColor('#a50008')
      .setTitle(`\`\`${client.getRandomItem(cats)}\`\` » Meow`)
      .setImage(file);

    message.channel.send(catEmbed);
  },

  get info () {
    return {
      name: 'cat',
      description: 'Mostra uma imagem aleatória de um gatinho.',
      guildOnly: false,
      requireArgs: false,
      requirePrefix: true,
      cooldown: 5,
      aliases: ['miau', 'meow', 'gato', 'gatinho']
    };
  }
};
