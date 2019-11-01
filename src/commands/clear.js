module.exports = {
  name: 'clear',
  description: 'Clean the chat.',
  guildOnly: true,
  prefix: true,
  args: true,
  usage: '<número de mensagens a serem excluídas>',
  cooldown: 5,
  aliases: ['limpar'],
  async execute(message, args) {
    if (!args.length) {
      return message.reply('você não especificou o número de mensagens.');
    }

    const amount = parseInt(args[0], 10);

    if (isNaN(amount)) {
      return message.reply('você precisa digitar o número de mensagens a serem excluídas.');
    } else if (amount <= 0 || amount > 100) {
      return message.reply('você precisa digitar um número maior que 0 e menor que 100.');
    }

    await message.delete();

    await message.channel.fetchMessages({ limit: amount })
      .then(fetchedMessages => {
        message.channel.bulkDelete(fetchedMessages, true)
          .then(removedMessages => message.channel.send(`${removedMessages.size} mensagens foram deletadas!`)
            .then(botMsg => botMsg.delete(3000)))
          .catch(err => message.channel.send(`Não foi possível deletar as mensagens deste canal! Erro: ${err}`));
      });
  }
}