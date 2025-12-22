const striptags = require('striptags');

module.exports = function extractExcerptFilter(value) {
  let excerpt = null;

  excerpt = striptags(value)
    .substring(0, 200) // Cap at 200 characters
    .replace(/^\\s+|\\s+$|\\s+(?=\\s)/g, '')
    .trim()
    .concat('...');
  return excerpt;
};
