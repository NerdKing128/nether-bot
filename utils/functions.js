function formatPms(miliseconds) {
  if (!miliseconds || typeof miliseconds !== 'number')
    throw new ReferenceError('A proper miliseconds paramater must be defined.');

  const ms = require('pretty-ms');

  const format = ms(miliseconds, { verbose: true }).split(' ');
  const arr = [];
  for (let arg of format) {
    if (!parseInt(arg)) {
      if (format[format.length - 1] !== arg) arg = `${arg},`;
    }

    arr.push(arg);
  }

  return arr.join(' ');
}

//Run by requiring it and doing getAliases(this, (number to slice))
function getAliases(This, slice) {
  if (!This || typeof This !== 'object')
    throw new ReferenceError('A proper this parameter must be defined.');

  if (slice) {
    if (typeof slice !== 'number')
      throw new TypeError('Slice parameter must be a number.');
    if (slice >= This.aliases.length)
      throw new TypeError('Slice parameter must be less than aliases length.');
    if (slice < 0)
      throw new TypeError('Slice parameter must be a whole number.');
  } else slice = 0;

  return This.aliases.slice(1 + slice);
}

//Run by requiring it and doing getArgs(message)
function getArgs(message) {
  if (!message || typeof message !== 'object')
    throw new ReferenceError('A proper message parameter must be defined.');

  const args = message.content.trim().split(' ').slice(1);

  return args;
}

//Run by requiring it and doing getID([number of chars])
function getID(length) {
  const chars =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!_?-';
  let id = '';

  if (!length) throw new ReferenceError('ID lengh parameter is not defined.');
  if (typeof length !== 'number')
    throw new TypeError('ID length parameter must be a number.');
  if (length > 256)
    throw new TypeError(
      'ID length parameter must not be greater than 256 characters.'
    );

  for (var i = 0; i !== length; ++i) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return id;
}

//Run by requiring it and doing getUnixTimestamp(date || snowflake, boolean)
//False requires a snowflake (id), True requires a date.
function getUnixTimestamp(time, type) {
  if (![true, false].includes(type))
    throw new ReferenceError('Type parameter must be defined.');
  if (typeof type !== 'boolean')
    throw new TypeError('Type parameter must be a boolean.');

  if (type == true) {
    if (new Date(time).getTime().toString() == 'NaN')
      throw new TypeError('Time parameter must be valid.');

    return Math.floor(new Date(time).getTime() / 1000);
  } else {
    if (
      Math.floor(
        parseInt(
          parseInt(time).toString(2).padStart(64, '0').substring(0, 42),
          2
        )
      ) == 0
    )
      throw new TypeError('Time parameter must be valid.');

    return Math.floor(
      (parseInt(
        parseInt(time).toString(2).padStart(64, '0').substring(0, 42),
        2
      ) +
        1420070400000) /
        1000
    );
  }
}

//Run by requiring it and doing setArg(message, [arg number to swtich to], (toggle arg to rest of content))
function setArg(message, argNum, rest) {
  if (!message || typeof message !== 'object')
    throw new ReferenceError('A proper message parameter must be defined.');

  if (argNum && argNum !== 0) {
    if (typeof argNum !== 'number')
      throw new TypeError('argNum parameter must be a number.');
    if (argNum < 0)
      throw new TypeError('argNum parameter must be a whole number.');
  } else if (!argNum && argNum !== 0)
    throw new ReferenceError('An argNum parameter must be provided.');

  const args = message.content.split(' ').slice(1);

  if (rest) {
    if (typeof rest !== 'boolean')
      throw new TypeError('Rest parameter must be a boolean or undefined.');
    if (rest == true) return args.slice(argNum).join(' ');
  }

  return args.slice(argNum)[0];
}

module.exports = {
  formatPms,
  getAliases,
  getArgs,
  getID,
  getUnixTimestamp,
  setArg,
};
