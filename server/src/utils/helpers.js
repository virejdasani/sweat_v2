const roundToNearestHalf = (num) => {
  return Math.round(num * 2) / 2;
};

const safeDivide = (num, divisor) => {
  return divisor === 0 ? 0 : num / divisor;
};

module.exports = {
  roundToNearestHalf,
  safeDivide,
};
