const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const ModlogChannelModel = require('../../models/ModlogChannelModel.js');
const { getAliases, getID } = require('../../utils/functions.js');
const LogModel = require('../../models/LogModel.js');
const mongo = require('../../structures/mongo.js');

class Kick extends Command {
  constructor() {
    super('kick', {
      aliases: ['kick', 'k', 'alt'],
      channel: 'guild',
      category: 'Moderation',
      description: {
        content: 'Kicks a member from the guild.',
        usage: '[member] (reason: can be determined via aliases too)',
      },
      userPermissions: ['KICK_MEMBERS'],
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
        .send('You need to actually provide a member to kick.')
        .then((msg) => msg.delete({ timeout: 5000 }));

    let i;

    for (const perm of this.client.config.info.modPerms) {
      if (member.hasPermission(perm)) {
        message.channel
          .send(
            'I cannot kick this member. Their permissions have at least one main moderator permission.'
          )
          .then((msg) => msg.delete({ timeout: 5000 }));
        i = true;
        break;
      }
    }
    if (i) return;

    if (!reason) reason = 'No reason provided';

    const alias = message.content.toLowerCase().slice(1).split(' ')[0];
    const aliases = getAliases(this, 1);

    if (aliases.includes(alias)) {
      reason = 'Malicous alternate account usage.';
    }

    let chanID;

    await mongo().then(async (mongoose) => {
      chanID = await ModlogChannelModel.findOne({
        _id: message.guild.id,
      });
    });
    const channel = message.guild.channels.cache.get(chanID.channel);

    const id = getID(16);

    const embed = new MessageEmbed()
      .setDescription(`${member} was kicked. | \`${id}\``)
      .setAuthor(
        member.user.tag,
        member.user.displayAvatarURL({ dynamic: true })
      )
      .setFooter(`ID: ${member.id}`)
      .setTimestamp()
      .setColor(this.client.config.colors.main);

    const embed2 = new MessageEmbed()
      .setTitle('Kick')
      .setAuthor(
        member.user.tag,
        member.user.displayAvatarURL({ dynamic: true })
      )
      .addField('User', `${member} (${member.id})`)
      .addField('Moderator', `${message.author} (${message.author.id})`)
      .addField('Reason', reason)
      .setFooter(`Log ID: ${id}`)
      .setTimestamp()
      .setColor(this.client.config.colors.main);

    const embed3 = new MessageEmbed()
      .setTitle(`You were kicked from ${message.guild.name}`)
      .setAuthor(
        member.user.tag,
        member.user.displayAvatarURL({ dynamic: true })
      )
      .setDescription(
        'This has been preformed by a staff member of our moderation system.'
      )
      .addField('Reason', reason)
      .setFooter(`Log ID: ${id}`)
      .setTimestamp()
      .setColor(this.client.config.colors.main);

    member.kick(reason);

    await mongo().then(async (mongoose) => {
      await new LogModel({
        _id: id.toLowerCase(),
        id: message.guild.id,
        type: 'Kick',
        userID: member.id,
        staffID: message.author.id,
        reason,
        timestamp: Date.now(),
      }).save();
    });

    await member.user
      .send(embed3)
      .then((msg) => {
        message.channel.send(embed);
      })
      .catch((err) => {
        message.channel.send("I couldn't dm the member.", embed);
      })
      .finally(() => {
        return channel.send(embed2);
      });
  }
}

module.exports = Kick;
