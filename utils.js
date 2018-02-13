module.exports.fitToLength = function(str, length) {
  if (str.length > length) return `${str.substr(0, length - 3)}...`;

  const padLength = Math.floor((length - str.length) / 2);
  return `${' '.repeat(padLength)}${str}`;
};
