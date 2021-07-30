const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

class Ping extends Command {
  constructor() {
    super('ping', {
      aliases: ['ping', 'p'],
      channel: 'guild',
      category: 'Utility',
      description: {
        content: 'Sends a message that displays the current ping.',
      },
    });
  }

  async exec(message) {
    const embed = new MessageEmbed()
      .setTitle('Pong!')
      .addField('Message Latency (Msg Send)', 'Pinging..')
      .addField('API Latency (Websocket)', 'Pinging..')
      .setColor(this.client.config.colors.utility)
      .setThumbnail(this.client.user.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setFooter(`Bot ID: ${this.client.user.id}`);

    const msg = await message.channel.send(embed);
    embed.fields = [];

    embed
      .addField(
        'Message Latency (Msg Send)',
        `${
          (msg.editedTimestamp || msg.createdTimestamp) -
          (message.editedTimestamp || message.createdTimestamp)
        }ms`
      )
      .addField(
        'API Latency (Websocket)',
        `${Math.round(this.client.ws.ping)}ms`
      );
    return msg.edit(embed);
  }
}

module.exports = Ping;
