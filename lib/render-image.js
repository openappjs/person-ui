var h               = require('mercury').h
  , renderChildren  = require('./render-children')
  , isArray         = require('is-array');

module.exports = function (options, events) {
  var options   = options || {},
      className = (options.className && isArray(options.className)) 
        ? options.className.unshift('').join('.')
        : options.className ? '.'+options.className : null,
      key       = options.key,
      value     = options.value,
      style     = options.style,
      children  = options.children;

  var elements = [ h('img'+className, { style: style[key], src: value }) ];
  if (children) renderChildren(elements, children);
  return h('div'+className, { style: style[key] }, elements);
}