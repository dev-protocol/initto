module.exports = function dateFilterJa(value) {
  const dateObject = new Date(value);

  return `${dateObject.getFullYear()}-${("0" + dateObject.getMonth()).slice(-2)}-${("0" + dateObject.getDate()).slice(-2)}`;
}
