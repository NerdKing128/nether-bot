const { Command } = require('discord-akairo');
const { MessageAttachment } = require('discord.js');
const Canvas = require('canvas');

class Smite extends Command {
  constructor() {
    super('smite', {
      aliases: ['smite'],
      channel: 'guild',
      category: 'Fun',
      description: {
        content: 'Smites thy who disobey.',
        usage: '[member]',
      },
      userPermissions: ['ADMINISTRATOR'],
      args: [
        {
          id: 'member',
          type: 'member',
        },
      ],
    });
  }

  async exec(message, { member }) {
    message.delete();

    if (!member)
      return message.channel.send(
        'Smite someone. Do you want to get smited yourself?'
      );

    const canvas = Canvas.createCanvas(1423, 1152);
    const ctx = canvas.getContext('2d');

    const background = await Canvas.loadImage(
      'https://media.discordapp.net/attachments/697657663034490961/835300437514911784/image0.jpg'
    );
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    const avatar = await Canvas.loadImage(
      member.user.displayAvatarURL({ format: 'png' })
    );
    ctx.drawImage(avatar, 780, 700, 300, 300);

    const attachment = new MessageAttachment(
      canvas.toBuffer(),
      `${member.id}.png`
    );

    return message.channel.send(attachment);
  }
}

module.exports = Smite;
