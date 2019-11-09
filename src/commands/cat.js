const Discord = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
  async execute (client, message, args) {
    const helpers = require('../modules/functions');

    const cats = ['😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '🐱', '🐈', '🐱‍👓', '🐱‍💻', '🐱‍🚀', '🐱‍🐉', '🐱‍👤'];

    const { file } = await fetch('https://aws.random.cat/meow').then(response => response.json());

    const catEmbed = new Discord.RichEmbed()
      .setColor('#a50008')
      .setTitle(`\`\`${helpers.getRandomItem(cats)}\`\` » Meow`)
      .setImage(file);

    message.channel.send(catEmbed);
  },

  get cmdInfo () {
    return {
      name: 'cat',
      description: 'Shows a random cat picture.',
      guildOnly: false,
      requireArgs: false,
      cooldown: 5,
      aliases: ['miau', 'meow', 'gato', 'gatinho']
    };
  }
};
