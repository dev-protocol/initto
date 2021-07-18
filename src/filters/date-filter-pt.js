// Stolen from https://stackoverflow.com/a/31615643
module.exports = function dateFilterPt(value) {
  const dateObject = new Date(value);

  const months = [
    'Jan',
    'Fev',
    'Mar',
    'Abr',
    'Mai',
    'Jun',
    'Jul',
    'Ago',
    'Set',
    'Out',
    'Nov',
    'Dez'
  ];

  return `${dateObject.getDate()} de ${
    months[dateObject.getMonth()]
  } de ${dateObject.getFullYear()}`;
};
