const fetch = require('node-fetch');

module.exports = {
  async execute(client, message, args) {
    catMsg = ['Gatinho :3', 'Mew', 'Miau', ':3', '🐱'];

    const { file } = await fetch('https://aws.random.cat/meow')
      .then(response => response.json());

    message.channel.send(`${catMsg[Math.floor(Math.random() * catMsg.length)]}\n${file}`);
  },

  get cmdInfo() {
    return {
      name: 'cat',
      description: 'Shows a random cat picture.',
      prefix: true,
      cooldown: 5,
      aliases: ['miau', 'meow', 'gato', 'gatinho'],
    };
  }
}