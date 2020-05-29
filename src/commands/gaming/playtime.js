const Discord = require('discord.js');
const hltb = require('howlongtobeat');
const hltbService = new hltb.HowLongToBeatService();

module.exports = {
  async execute (client, message, args) {
    const searchResult = await hltbService.search(args.join(' '));

    if (!searchResult.length) {
      client.logger.log(
        `${message.author.username} tried to execute the "playtime" command but failed because no game was found`
      );
      return client.reply({
        message,
        title: 'Nenhum jogo encontrado',
        content: 'Nenhum jogo com este nome foi encontrado'
      });
    }

    const gamesList = [];
    const gamesString = [];

    searchResult.forEach((result, index) =>
      gamesList.push({
        index: index + 1,
        id: result.id,
        name: result.name
      })
    );

    gamesList.forEach(item =>
      gamesString.push(`**${item.index}** | ${item.name}`)
    );

    const gameListEmbed = new Discord.MessageEmbed()
      .setTitle('``🎮`` » Lista de jogos encontrados')
      .addField('Escolha um jogo digitando seu número', gamesString, true)
      .setColor('#a50008')
      .setFooter('Kitsune', client.user.avatarURL())
      .setTimestamp();

    const listMsg = await message.channel.send(gameListEmbed);
    const response = await client.awaitReply(message);

    if (response === false) {
      listMsg.delete();

      client.logger.log(
        `${message.author.username} tried to execute the "playtime" command but failed because the response time expired`
      );
      return client.reply({
        message,
        title: 'Tempo excedido',
        content: 'Você precisa escolher um jogo!'
      });
    }

    if (response > 0 && response <= searchResult.length) {
      const gameDetails = await hltbService.detail(gamesList[response - 1].id);

      const gameDetailsEmbed = new Discord.MessageEmbed()
        .setTitle(`\`\`🎮\`\` » ${gameDetails.name}`)
        .addField('Campanha', `${gameDetails.gameplayMain} horas`, true)
        .addField(
          'Campanha + Extras',
          `${gameDetails.gameplayMainExtra} horas`,
          true
        )
        .addField(
          'Completo ("100%")',
          `${gameDetails.gameplayCompletionist} horas`,
          true
        )
        .addField(
          'Informações completas',
          `https://howlongtobeat.com/game?id=${gamesList[response - 1].id}`
        )
        .setThumbnail(gameDetails.imageUrl)
        .setColor('#a50008')
        .setFooter('Kitsune', client.user.avatarURL())
        .setTimestamp();

      message.channel.send(gameDetailsEmbed);
    } else {
      listMsg.delete();

      client.logger.log(
        `${message.author.username} tried to execute the "playtime" command but failed because he/she chose a invalid game`
      );
      return client.reply({
        message,
        title: 'Jogo inválido',
        content: 'Selecione um dos jogos presentes na lista'
      });
    }
  },

  get info () {
    return {
      name: 'playtime',
      description: 'Exibe o tempo de campanha de um jogo.',
      guildOnly: false,
      requireArgs: true,
      requirePrefix: true,
      usage: '<jogo> (limite de 20 resultados)',
      cooldown: 3,
      aliases: ['gametime', 'howlong', 'howlongtobeat']
    };
  }
};
