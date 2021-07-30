const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

class Help extends Command {
  constructor() {
    super('help', {
      aliases: ['help', 'h', 'commands'],
      channel: 'guild',
      category: 'Information',
      description: {
        content:
          'Gives information on the entire list of available commands or for a specific command.',
        usage: '(command)',
      },
      args: [
        {
          id: 'command',
          type: 'commandAlias',
        },
      ],
    });
  }

  async exec(message, { command }) {
    const embed = new MessageEmbed()
      .setTimestamp()
      .setColor(this.client.config.colors.information);

    let extra = '';
    if (command) {
      extra =
        this.aliases == command.aliases
          ? 'You on drugs? You literally just used it.'
          : '';

      embed
        .setTitle(
          `Help: ${
            command.id.slice(0, -command.id.length + 1).toUpperCase() +
            command.id.slice(1).toLowerCase()
          }`
        )
        .addField('Description', command.description.content)
        .addField(
          `Aliases [${command.aliases.length - 1}]`,
          `${command.aliases.slice(1).join(', ') || 'None'}`
        )
        .addField(
          'Usage',
          `${this.client.commandHandler.prefix}${command.id} ${
            command.description.usage || ''
          }`
        );
      if (command.ownerOnly == true) {
        embed.addField('Required Permissions', 'None (User Restricted: true)');
      } else {
        if (command.userPermissions) {
          const perms = [];
          const permissions = [];

          for (const perm of command.userPermissions) {
            const p = perm.replace(/_/g, ' ').split(' ');

            for (let i = 0; i < p.length; i++) {
              permissions.push(
                p[i].slice(0, -p[i].length + 1).toUpperCase() +
                  p[i].slice(1).toLowerCase()
              );
            }

            perms.push(permissions.join(' '));
            permissions.splice(0, permissions.length);
          }
          embed.addField('Required Permissions', perms.join(', '));
        } else {
          embed.addField('Required Permissions', 'None');
        }
      }

      embed.setFooter(
        '[] stands for a required argument while () stands for a optional argument.'
      );
    } else {
      for (const category of this.handler.categories.values()) {
        if (['default'].includes(category.id)) continue;

        embed
          .addField(
            category.id,
            category
              .filter((cmd) => cmd.aliases.length > 0)
              .map((cmd) => `\`${cmd}\``)
              .join(', ')
          )
          .setTitle('Help')
          .setFooter(
            `Use ${this.client.commandHandler.prefix}help (command) for more information on a command.`
          );
      }
    }

    return message.util.send(extra, embed);
  }
}

module.exports = Help;
