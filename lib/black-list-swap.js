module.exports = function(test, blackList) {
  if (typeof test === 'object') {
    var keys = Object.keys(test);
    keys.forEach(function(key) {
      if (blackList.indexOf(key) !== -1) {
        test['_'+key] = test[key];
        delete test[key]
      }
    });
    return test;
  } else {
    if (blackList.indexOf(test) !== -1) {
      return '_'+test;
    } else {
      return test;
    }
  }
};