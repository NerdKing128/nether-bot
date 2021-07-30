const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

class Membercount extends Command {
  constructor() {
    super('membercount', {
      aliases: ['membercount', 'members'],
      channel: 'guild',
      category: 'Utility',
      description: {
        content: 'Gets the current member count for the guild.',
      },
    });
  }
  async exec(message) {
    const members = await message.guild.members
      .fetch()
      .catch((err) => console.log(err));

    const embed = new MessageEmbed()
      .setTitle('Member Count')
      .setDescription(
        `There are **${message.guild.memberCount} members** total in **${message.guild.name}**.`
      )
      .addField(
        'Humans',
        members.filter((member) => !member.user.bot).size,
        true
      )
      .addField('Bots', members.filter((member) => member.user.bot).size, true)
      .setFooter(`Guild ID: ${message.guild.id}`)
      .setTimestamp()
      .setColor(this.client.config.colors.utility)
      .setThumbnail(message.guild.iconURL({ dynamic: true }));

    return message.channel.send(embed);
  }
}

module.exports = Membercount;
