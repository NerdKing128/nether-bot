const { Command } = require('discord-akairo');
const { MessageAttachment } = require('discord.js');
const Canvas = require('canvas');

class Basement extends Command {
  constructor() {
    super('basement', {
      aliases: ['basement', 'bm'],
      channel: 'guild',
      category: 'Fun',
      description: {
        content: "Sends a member to luca's basement.",
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
      return message.channel.send('Send someone to the basement. Smh.');
    if (member.id == '379420154955825153')
      return message.channel.send(
        'You cannot put the almighty Lord Luca in the basement.'
      );

    const canvas = Canvas.createCanvas(946, 624);
    const ctx = canvas.getContext('2d');

    const background = await Canvas.loadImage(
      'https://media.discordapp.net/attachments/697657663034490961/866860790451404810/LucaBasement.PNG'
    );
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    const avatar = await Canvas.loadImage(
      member.user.displayAvatarURL({ format: 'png' })
    );
    ctx.drawImage(avatar, 310, 265, 350, 350);

    const attachment = new MessageAttachment(canvas.toBuffer(), `basement.png`);

    return message.channel.send(attachment);
  }
}

module.exports = Basement;
