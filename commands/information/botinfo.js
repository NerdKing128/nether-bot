const { Command } = require('discord-akairo');
const { MessageEmbed, version: v } = require('discord.js');
const { formatPms, getUnixTimestamp } = require('../../utils/functions.js');
const { version } = require('../../package.json');

class Botinfo extends Command {
  constructor() {
    super('botinfo', {
      aliases: ['botinfo'],
      channel: 'guild',
      category: 'Information',
      description: {
        content: 'Gives information about the bot.',
      },
    });
  }

  async exec(message) {
    const guild = this.client.guilds.cache.get(process.env.main);

    const embed = new MessageEmbed()
      .setThumbnail(this.client.user.displayAvatarURL({ dynamic: true }))
      .setDescription(
        `**${this.client.user.username}** is a multi-purpose discord bot rewritten for the [**${guild.name}**](https://discord.gg/Gar3Bzyufm) discord. \nThe bot is coded by <@551486851408461867> and <@859516255748227122> and created by <@551486851408461867>.`
      )
      .setTitle('Bot Info')
      .addField(
        'Bot Name',
        `${this.client.user.tag} (${this.client.user.id}) `,
        true
      )
      .addField(
        'Bot Created',
        `<t:${getUnixTimestamp(
          this.client.user.id,
          false
        )}:F> (<t:${getUnixTimestamp(this.client.user.id, false)}:R>)`,
        true
      )
      .addField('Bot Version', `v${version}`)
      .addField('Node.js Version', process.version)
      .addField('Discord.js Version', `v${v}`)
      .addField('Bot Uptime', formatPms(this.client.uptime))
      .addField(
        'RAM Usage',
        `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB`
      )
      .setTimestamp()
      .setColor(this.client.config.colors.information);

    return message.channel.send(embed);
  }
}

module.exports = Botinfo;
