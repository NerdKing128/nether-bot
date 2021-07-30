const { Command } = require('discord-akairo');
const ModlogChannelModel = require('../../models/ModlogChannelModel.js');
const mongo = require('../../structures/mongo.js');

class Modlogchannel extends Command {
  constructor() {
    super('modlogchannel', {
      aliases: ['modlogchannel', 'modlog-channel', 'mlc'],
      channel: 'guild',
      category: 'Configuration',
      description: {
        content: 'Sets the modlog channel for the guild.',
        usage: '[channel]',
      },
      userPermissions: ['MANAGE_GUILD'],
      args: [
        {
          id: 'channel',
          type: 'channel',
        },
      ],
    });
  }

  async exec(message, { channel }) {
    if (!channel)
      return message.channel
        .send('Please properly provide a valid modlog channel.')
        .then((msg) => msg.delete({ timeout: 5000 }));

    await mongo().then(async (mongoose) => {
      await ModlogChannelModel.findOneAndUpdate(
        {
          _id: message.guild.id,
        },
        {
          _id: message.guild.id,
          channel: channel.id,
        },
        {
          upsert: true,
        }
      );
    });
    return message.channel.send(`The modlog channel has set to ${channel}.`);
  }
}

module.exports = Modlogchannel;
