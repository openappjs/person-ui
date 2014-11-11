var reduce = require('reduce');
var isArray = require('is-array');
var _ = require('lodash');

function recurseKeySwap (obj, prevKey, newKey) {
  return reduce(obj, function (acc, value, key) {

    if (isArray(value)) {
      var val = _.clone(value);
      value = [];
      for (var i=0;i<val.length;i++) {
        value.push(recurseKeySwap(val[i], prevKey, newKey));
      }
    } else if (typeof value === 'object') {
      value = recurseKeySwap(value, prevKey, newKey);
    }

    if (key === prevKey) {
      acc[newKey] = value;
    } else {
      acc[key] = value;
    }

    return acc;
  }, {});
};

module.exports = recurseKeySwap;