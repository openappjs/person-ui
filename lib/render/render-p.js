var h               = require('mercury').h
  , renderChildren  = require('./render-children')
  , isArray         = require('is-array')
  , stringify       = require('node-stringify');

module.exports = function (options, events) {
  var options   = options || {},
      className = options.className || '',
      key       = options.key,
      value     = options.value,
      style     = options.style,
      children  = options.children ? renderChildren(options.children) : null;

  if (isArray(className)) {
    className.splice(0, 0, '');
    className = className.join('.');
  } else if (className) {
    className = '.'+className;
  }

  if (typeof value !== 'string') { value = stringify(value) };
  var elements = [ h('p', { style: style }, value) ]; 
  if (children) renderChildren(elements, children);
  return h('div'+className, { style: style[key] }, elements);
}