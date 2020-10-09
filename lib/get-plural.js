module.exports = function getPlural(num, label, suffix = 's') {
  return `${label}${Math.abs(num) !== 1 ? suffix : ''}`;
};
