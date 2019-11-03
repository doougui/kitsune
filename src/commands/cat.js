const Discord = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
  async execute(client, message, args) {
    const cats = ['😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '🐱', '🐈', '🐱‍👓', '🐱‍💻', '🐱‍🚀', '🐱‍🐉', '🐱‍👤'];
    const { file } = await fetch('https://aws.random.cat/meow')
      .then(response => response.json());

    catEmbed = new Discord.RichEmbed()
      .setTitle(`${cats[Math.floor(Math.random() * cats.length)]}`)
      .setImage(file);

    message.channel.send(catEmbed);
  },

  get cmdInfo() {
    return {
      name: 'cat',
      description: 'Shows a random cat picture.',
      args: false,
      cooldown: 5,
      aliases: ['miau', 'meow', 'gato', 'gatinho'],
    };
  }
}