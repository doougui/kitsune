module.exports = {
  async execute (client, message, args) {
    message.react('💤');
    message.channel.send(`${args[1]}!`);
  },

  get info () {
    return {
      name: 'boa noite',
      description: 'Mostra uma mensagem de boa noite.',
      requirePrefix: false,
      aliases: ['boa noita']
    };
  }
};
