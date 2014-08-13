function after (fn, numTicks) {
  return function () {
    numTicks--;
    if (numTicks <= 0) { 
      fn();
      fn = undefined;
    }
  };
};

module.exports = after;
