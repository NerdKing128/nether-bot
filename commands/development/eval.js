const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const { inspect } = require('util');

class Eval extends Command {
  constructor() {
    super('eval', {
      aliases: ['eval', 'ev'],
      channel: 'guild',
      category: 'Development',
      description: {
        content: 'Evaluates a certain segment of code.',
        usage: '[code]',
      },
      ownerOnly: true,
      args: [
        {
          id: 'code',
          type: 'string',
          match: 'rest',
        },
      ],
    });
  }

  async exec(message, { code }) {
    if (!code)
      return message.channel
        .send('You know I need something to actually evaluate. Smh.')
        .then((msg) => msg.delete({ timeout: 5000 }));

    let output;
    let type;
    let instance;

    try {
      output = await eval(code);
      type = typeof output;
      if (typeof output !== 'string') output = await inspect(output);
      instance = output;
    } catch (error) {
      output = error.stack;
      type = error.name;
      instance = error;
    }

    return message.channel
      .send(
        `**Evaluation**\n\n**Input**\n\`\`\`js\n${code}\`\`\`\n**Output**\n${
          instance instanceof Error
            ? `\`\`\`${output}\`\`\``
            : `\`\`\`js\n${output}\`\`\``
        }\n**Type**\n\`\`\`js\n${
          instance instanceof Error
            ? type
            : type.slice(0, -type.length + 1).toUpperCase() +
              type.slice(1).toLowerCase()
        }\`\`\``
      )
      .catch((err) => {
        if (err.code == 50035)
          return message.channel.send('Log that instead. Smh.');
      });
  }
}

module.exports = Eval;
