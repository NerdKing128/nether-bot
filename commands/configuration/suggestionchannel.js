const { Command } = require('discord-akairo');
const SuggestionChannelModel = require('../../models/SuggestionChannelModel.js');
const mongo = require('../../structures/mongo.js');

class Suggestionchannel extends Command {
  constructor() {
    super('suggestionchannel', {
      aliases: ['suggestionchannel', 'suggestion-channel', 'sc'],
      channel: 'guild',
      category: 'Configuration',
      description: {
        content: 'Sets the suggestion channel for the guild.',
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
        .send('Please properly provide a valid suggestion channel.')
        .then((msg) => msg.delete({ timeout: 5000 }));

    await mongo().then(async (mongoose) => {
      await SuggestionChannelModel.findOneAndUpdate(
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
    return message.channel.send(
      `The suggestion channel has set to ${channel}.`
    );
  }
}

module.exports = Suggestionchannel;
