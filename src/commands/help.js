require('dotenv/config')
const Discord = require('discord.js');

module.exports = {
  async execute(client, message, args) {
    const { commands } = message.client;

    if (!args.length) {
      commandList = commands.map(command => {
        let { name, description } = command.cmdInfo;
        return { name, description };
      });

      const helpEmbed = new Discord.RichEmbed()
        .setColor('#a50008')
        .setTitle('Comandos')
        .setURL('https://github.com/doougui/kitsune')
        .setDescription('Aqui está a lista de todos os comandos disponíveis:')
        .setTimestamp()
        .setFooter('Kitsune', 'https://cdn131.picsart.com/272777513014211.png?r1024x1024');

      for (commandInfo of commandList) {
        helpEmbed.addField(`${process.env.PREFIX}${commandInfo.name}`, `**Função**: ${commandInfo.description}`);
      }

      return message.author.send(helpEmbed)
        .then(() => {
          if (message.channel.type === 'dm') return;
          message.reply('te enviei uma mensagem com todos os meus comandos :)');
        })
        .catch(error => {
          console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
          message.reply('não foi possível te enviar uma mensagem com os comandos, talvez você esteja com as mensagem diretas desabilitadas. Ou será que... Você me bloqueou? :(');
        });
    } else {
      const commandName = args[0].toLowerCase();
      const command = commands.get(commandName) 
        || commands.find(cmd => cmd.cmdInfo.aliases && cmd.cmdInfo.aliases.includes(commandName));

        
      if (commandName.startsWith(process.env.PREFIX)) {
        return message.reply(`utilize $help <comando> (sem o prefixo (${process.env.PREFIX})).`);
      }
      
      if (!command) {
        return message.reply(`este comando não é válido!`);
      }

      const cmdInfo = command.cmdInfo;

      const helpEmbed = new Discord.RichEmbed()
        .setColor('#a50008')
        .setTitle(`\`${process.env.PREFIX}${cmdInfo.name}\``)
        .setDescription(`Informações sobre o comando \`${process.env.PREFIX}${cmdInfo.name}\`:`)
        .setTimestamp()
        .setFooter(`Comando solicitado por: ${message.author.username}`, 'https://cdn131.picsart.com/272777513014211.png?r1024x1024');

      if (cmdInfo.aliases) helpEmbed.addField(`Alternativas`, cmdInfo.aliases.join(', '));
      if (cmdInfo.description) helpEmbed.addField(`Descrição`, cmdInfo.description);
      if (cmdInfo.usage) helpEmbed.addField(`Uso`, `${process.env.PREFIX}${cmdInfo.name} ${cmdInfo.usage}`);

      helpEmbed.addField(`Tempo de espera`, `${cmdInfo.cooldown || 3} segundos`);

      return message.channel.send(helpEmbed);
    }
  },

  get cmdInfo() {
    return {
      name: 'help',
      description: 'Show available commands.',
      aliases: ['commands', 'ajuda', 'comandos'],
      usage: '<opcional: [nome do comando]>',
    };
  }
}