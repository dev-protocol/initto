module.exports = function jaItemFilter(items) {
  return items.filter(item => item.data.locale === 'ja');
};
