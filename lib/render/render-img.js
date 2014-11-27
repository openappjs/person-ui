var h               = require('mercury').h
  , renderChildren  = require('./render-children')
  , isArray         = require('is-array');

module.exports = function (options, events) {
  var options   = options || {},
      className = options.className || '',
      key       = options.key,
      value     = options.value,
      style     = options.style,
      children  = options.children;

  if (isArray(className)) {
    className.splice(0, 0, '');
    className = className.join('.');
  } else if (className) {
    className = '.'+className;
  }

  var elements = [ h('img'+className, { style: style[key], src: value }) ];
  if (children) renderChildren(elements, children);
  return h('div'+className, { style: style[key] }, elements);
}