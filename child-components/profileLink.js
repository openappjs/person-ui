var Link = require('./link');

module.exports = function(options) {
  var id = options.id || '#';
  var config = options.config || {};
  var children = options.children || [];

  return Link({
    model: {
      href: "/"+id,
    },
    config: config,
    children: children
  }).state;
}