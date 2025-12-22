module.exports = function dateFilterJa(value) {
  const dateObject = new Date(value);

  return `${dateObject.getFullYear()}-${('0' + (dateObject.getMonth() + 1)).slice(-2)}-${(
    '0' + dateObject.getDate()
  ).slice(-2)}`;
};
