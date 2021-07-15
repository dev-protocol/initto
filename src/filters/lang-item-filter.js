module.exports = function localeItemFilter(items, locale) {
  return items.filter(item => item.data.locale === locale)
};
