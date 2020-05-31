const mockingcase = require('@strdr4605/mockingcase');

module.exports = {
  async execute (client, message, args) {
    const user = client.getUserFromMention(args[0], message.guild, false);

    if (!user) {
      return client.reply({
        message,
        title: 'Usuário inválido.',
        content: 'Um usuário válido deve ser mencionado!'
      });
    }

    // Fetching messages because user.lastMessage is buggy
    let fetchedMessages;

    try {
      fetchedMessages = await message.channel.messages.fetch({
        limit: 100,
        before: message.id
      });
    } catch (error) {
      client.reply({
        message,
        title: 'Erro ao buscar mensagem.',
        content: 'Talvez este canal não tenha mensagens deste membro ou talvez a mensagem seja muito antiga.'
      });
      client.logger.warn(`${message.author.username} (${message.author.id}) failed to fetch messages from the ${message.channel.name} channel (${message.guild.name} server). Error: ${error}`);
    }

    const lastMessage = fetchedMessages.find(msg => msg.author === user);

    if (!lastMessage) {
      return client.reply({
        message,
        title: 'Mensagem não encontrada.',
        content: 'O usuário precisa ter enviado uma mensagem recente.'
      });
    }

    const mockedMessage = mockingcase(lastMessage.content, {
      random: false
    });

    message.channel.send(mockedMessage, {
      files: [{
        attachment: './assets/img/mock/Mocking-Spongebob.jpg',
        name: 'Mocking-Spongebob.jpg'
      }]
    });
  },

  get info () {
    return {
      name: 'mock',
      description: 'zOa Um bObÃo.',
      guildOnly: true,
      requireArgs: true,
      requirePrefix: true,
      usage: '<@usuário>',
      cooldown: 3,
      aliases: ['sarcastic', 'zoar']
    };
  }
};
