var h               = require('mercury').h
  , renderChildren  = require('./render-children')
  , isArray         = require('./isArray');

module.exports = function (options, events) {
  var options   = options || {},
      className = (options.className && isArray(options.className)) 
        ? options.className.unshift('').join('.')
        : options.className ? '.'+options.className : null,
      key       = oprions.key,
      value     = options.value,
      style     = options.style,
      children  = options.children ? renderChildren(options.children) : null;

  var elements = [ h('p', { style: style[key] }, value) ];
  if (children) renderChildren(elements, children);
  return h('div'+className, { style: style[key] }, elements);
}