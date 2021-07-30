const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const { getID } = require('../../utils/functions.js');

class Monke extends Command {
  constructor() {
    super('monke', {
      aliases: ['monke', 'monk'],
      channel: 'guild',
      category: 'Fun',
      description: {
        content: 'Causes the specified member to be sat on by LeMonke.',
        usage: '[member]',
      },
      userPermissions: ['ADMINISTRATOR'],
      args: [
        {
          id: 'member',
          type: 'member',
        },
        {
          id: 'reason',
          type: 'string',
          match: 'rest',
        },
      ],
    });
  }

  async exec(message, { member, reason }) {
    message.delete();

    if (!member)
      return message.channel
        .send('You need to properly provide a member to get sat on.')
        .then((msg) => msg.delete({ timeout: 5000 }));

    if (member == message.member)
      return message.channel
        .send(
          'You cannot cause yourself to get sat on. Why would you want to anyways?'
        )
        .then((msg) => msg.delete({ timeout: 5000 }));
    if (member.id == '454675878614401034')
      return message.channel
        .send('You cannot get the one and only LeMonke to be sat on. Smh.')
        .then((msg) => msg.delete({ timeout: 5000 }));

    if (!reason) reason = 'No reason provided';

    const id = getID(16);

    const embed = new MessageEmbed()
      .setDescription(`${member} was sat on by LeMonke. | \`${id}\``)
      .setAuthor(
        member.user.tag,
        member.user.displayAvatarURL({ dynamic: true })
      )
      .setFooter(`ID: ${member.id}`)
      .setTimestamp()
      .setColor('#c71585');

    return message.channel.send(embed);
  }
}

module.exports = Monke;
