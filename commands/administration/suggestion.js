const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const SuggestionChannelModel = require('../../models/SuggestionChannelModel.js');
const SuggestionModel = require('../../models/SuggestionModel.js');
const { getAliases, setArg } = require('../../utils/functions.js');
const mongo = require('../../structures/mongo.js');

class Suggestion extends Command {
  constructor() {
    super('suggestion', {
      aliases: ['suggestion', 'accept', 'consider', 'deny'],
      channel: 'guild',
      category: 'Administration',
      description: {
        content: 'Sets the status for a suggestion.',
        usage: '(status: can be determined via aliases too) [id] (reason)',
      },
      userPermissions: ['MANAGE_GUILD'],
      args: [
        {
          id: 'status',
          type: 'string',
        },
        {
          id: 'id',
          type: 'string',
        },
        {
          id: 'reason',
          type: 'string',
          match: 'rest',
        },
      ],
    });
  }

  async exec(message, { status, id, reason }) {
    message.delete();

    let chanID;

    await mongo().then(async (mongoose) => {
      chanID = await SuggestionChannelModel.findOne({
        _id: message.guild.id,
      });
    });
    const channel = message.guild.channels.cache.get(chanID.channel);

    if (!channel)
      return message.channel
        .send(
          'The suggestion channel is not properly set up. A suggestion channel actually needs to exist for a suggestion to be edited.'
        )
        .then((msg) => msg.delete({ timeout: 10000 }));

    status = status || '';

    const alias = message.content.toLowerCase().slice(1).split(' ')[0];
    const aliases = getAliases(this);

    if (aliases.includes(alias)) {
      status = alias;
      id = setArg(message, 0);
      reason = setArg(message, 1, true);
    }

    id = id || '';

    if (!aliases.includes(status.toLowerCase()))
      return message.channel
        .send(
          "You have provided an invalid status. Check the command's aliases for more info."
        )
        .then((msg) => msg.delete({ timeout: 5000 }));

    let suggestion;

    await mongo().then(async (mongoose) => {
      suggestion =
        (await SuggestionModel.findOne({
          _id: id.toLowerCase(),
          id: message.guild.id,
        })) || '';
    });

    if (!suggestion.id)
      return message.channel
        .send('Please provide a valid suggestion ID.')
        .then((msg) => msg.delete({ timeout: 5000 }));

    if (!reason) reason = 'No reason provided';

    let newStatus;

    if (status.endsWith('y')) {
      newStatus = `Suggestion ${
        status.slice(0, -status.length + 1).toUpperCase() +
        status.slice(1).toLowerCase().slice(0, -1)
      }ied`;
    } else {
      newStatus = `Suggestion ${
        status.slice(0, -status.length + 1).toUpperCase() +
        status.slice(1).toLowerCase()
      }ed`;
    }

    const msg = await channel.messages
      .fetch(suggestion.messageID)
      .catch((err) => {});
    const user = await this.client.users
      .fetch(suggestion.userID)
      .catch((err) => {});

    const embed = new MessageEmbed()
      .setTitle(newStatus)
      .setAuthor(user.tag, user.displayAvatarURL({ dynamic: true }))
      .setDescription(suggestion.suggestion)
      .setColor(this.client.config.colors.utility)
      .setFooter(`Suggestion ID: ${suggestion._id}`)
      .addField(`Reason from ${message.author.tag}`, reason)
      .setTimestamp(msg.createdTimestamp);

    msg.edit(embed);

    const type = newStatus.slice(11);
    embed.addField(
      'Extra Information',
      `[Original Message](https://discordapp.com/channels/${message.guild.id}/${channel.id}/${suggestion.messageID})`
    );

    if (user)
      await user
        .send(
          `A suggestion made by you has been ${
            type.slice(0, -type.length + 1).toLowerCase() + type.slice(1)
          } by ${message.author.tag} with the reason: ${reason}`,
          embed
        )
        .catch((err) => console.log(err));
  }
}

module.exports = Suggestion;
