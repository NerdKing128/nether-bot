const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const { getArgs, getUnixTimestamp } = require('../../utils/functions.js');

class Whois extends Command {
  constructor() {
    super('whois', {
      aliases: ['whois', 'userinfo', 'info'],
      channel: 'guild',
      category: 'Utility',
      description: {
        content:
          'Gets info on a specified user or gets info on the current user.',
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
        .then((msg) => msg.delete({ timeout: 5000 }));
    if (!args[0]) user = message.author;
    const member = message.guild.member(user);

    const embed = new MessageEmbed()
      .setTitle('Whois')
      .setAuthor(`${user.tag}`, user.displayAvatarURL({ dynamic: true }))
      .setDescription(user.bot ? `${user} <:BOT:870486574410915850>` : user)
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .setColor(this.client.config.colors.utility)
      .setFooter(`ID: ${user.id}`)
      .setTimestamp()
      .addField(
        'Joined Discord',
        `<t:${getUnixTimestamp(user.id, false)}:F> (<t:${getUnixTimestamp(
          user.id,
          false
        )}:R>)`,
        true
      );

    if (member) {
      embed
        .addField(
          'Joined Guild',
          `<t:${getUnixTimestamp(
            member.joinedAt,
            true
          )}:F> (<t:${getUnixTimestamp(member.joinedAt, true)}:R>)`,
          true
        )

        .addField('Status', user.presence.status);
      let status = user.presence.activities.find(
        (s) => s.type == 'CUSTOM_STATUS'
      );
      if (!status) status = null;
      if (status !== null) {
        if (!status.emoji) embed.addField('Custom Status', status.state);
        if (status.emoji && status.state !== null)
          embed.addField('Custom Status', `${status.emoji} ${status.state}`);
        if (status.emoji && status.state == null)
          embed.addField('Custom Status', `${status.emoji}`);
      }
      if (status == null) {
        embed.addField('Custom Status', 'None');
      }

      embed.addField(
        `Roles [${member.roles.cache.size - 1}]`,
        `${
          member.roles.cache
            .map((role) => role)
            .slice(0, -1)
            .join(', ') || 'None'
        }`
      );

      const permissions = member.permissions.toArray();
      const perms = [];

      permissions.forEach((perm) => {
        let i = [];
        const h = perm.replace(/_/g, ' ').split(' ');

        h.forEach((m) => {
          i.push(
            m.slice(0, -m.length + 1).toUpperCase() + m.slice(1).toLowerCase()
          );
        });

        if (i.includes('Vad')) i = ['Use Voice Activity'];
        perms.push(i.join(' '));
      });
      embed.addField(`Permissions`, perms.join(', '));
    }

    for (const perm of this.client.config.info.modPerms) {
      if (this.client.config.info.developers.includes(user.id)) {
        embed.addField('Acknowledgements', 'Bot Developer');
        break;
      } else if (user.id == this.client.user.id) {
        embed.addField('Acknowledgements', 'The Nether Bot');
        break;
      } else if (member) {
        if (member.hasPermission('ADMINISTRATOR')) {
          embed.addField('Acknowledgements', 'Server Administrator');
          break;
        } else if (member.hasPermission(perm)) {
          embed.addField('Acknowledgements', 'Server Moderator');
          break;
        }
      } else break;
    }

    return message.channel.send(embed);
  }
}

module.exports = Whois;
