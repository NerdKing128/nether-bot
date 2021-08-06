const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const { getArgs } = require('../../utils/functions.js');

class Avatar extends Command {
  constructor() {
    super('avatar', {
      aliases: ['avatar', 'av'],
      channel: 'guild',
      category: 'Utility',
      description: {
        content: "Gets a user's avatar.",
        usage: '(user)',
      },
      args: [
        {
          id: 'user',
          type: 'user',
        },
      ],
    });
  }

  async exec(message, { user }) {
    const args = getArgs(message);

    user = user || (await this.client.users.fetch(args[0]).catch((err) => {}));
    if (!user && args[0])
      return message.channel
        .send('Please correctly provide a user.')
        .then((msg) => setTimeout(() => msg.delete(), 5000));
    if (!args[0]) user = message.author;

    const embed = new MessageEmbed()
      .setTitle(`${user.username}'s Avatar`)
      .setDescription(
        `[PNG](${user.displayAvatarURL({
          size: 2048,
          format: 'png',
        })}), [JPG](${user.displayAvatarURL({
          size: 2048,
          format: 'jpg',
        })}), [WEBP](${user.displayAvatarURL({ size: 2048, format: 'webp' })})`
      )
      .setImage(
        user.displayAvatarURL({ size: 2048, format: 'png', dynamic: true })
      )
      .setColor(this.client.config.colors.utility)
      .setTimestamp();

    return message.channel.send(embed);
  }
}

module.exports = Avatar;
