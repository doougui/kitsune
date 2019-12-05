module.exports = {
  async execute (client, message, args) {
    message.react('💤');
    message.channel.send('noite!');
  },

  get info () {
    return {
      name: 'boa noite',
      description: 'Mostra uma mensagem de boa noite.',
      requirePrefix: false
    };
  }
};
