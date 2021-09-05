const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const SuggestionChannelModel = require('../../models/SuggestionChannelModel.js');
const SuggestionModel = require('../../models/SuggestionModel.js');
const { getID } = require('../../utils/functions.js');
const mongo = require('../../structures/mongo.js');

class Suggest extends Command {
  constructor() {
    super('suggest', {
      aliases: ['suggest', 'sug'],
      channel: 'guild',
      category: 'Utility',
      description: {
        content: 'Suggests something for the guild.',
        usage: '[suggestion]',
      },
      args: [
        {
          id: 'suggestion',
          type: 'string',
          match: 'rest',
        },
      ],
    });
  }

  async exec(message, { suggestion }) {
    message.delete();

    let chanID;

    await mongo().then(async (mongoose) => {
      chanID = await SuggestionChannelModel.findOne({
        _id: message.guild.id,
      });
    });
    const channel = message.guild.channels.cache.get(chanID?.channel);

    if (!channel)
      return message.channel
        .send(
          'The suggestion channel is not properly set up. A suggestion channel actually needs to exist for a suggestion to be sent.'
        )
        .then((msg) => msg.delete({ timeout: 10000 }));

    if (!suggestion)
      return message.channel
        .send(
          'You need to actually suggest something for this command to work.'
        )
        .then((msg) => msg.delete({ timeout: 5000 }));

    const id = getID(8);

    const embed = new MessageEmbed()
      .setTitle('Suggestion')
      .setColor(this.client.config.colors.utility)
      .setAuthor(
        message.author.tag,
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setDescription(suggestion)
      .setFooter(`Suggestion ID: ${id}`)
      .setTimestamp(message.createdTimestamp);

    const msg = await channel.send(embed);

    await mongo().then(async (mongoose) => {
      await new SuggestionModel({
        _id: id.toLowerCase(),
        id: message.guild.id,
        suggestion,
        userID: message.author.id,
        messageID: msg.id,
      }).save();
    });

    return msg.react('⬆').then(() => {
      msg.react('⬇️');
    });
  }
}

module.exports = Suggest;
