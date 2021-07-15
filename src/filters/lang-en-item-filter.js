module.exports = function enItemFilter(items) {
  return items.filter(item => item.data.locale !== 'ja');
};
