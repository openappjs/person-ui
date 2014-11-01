var h               = require('mercury').h
  , renderChildren  = require('./render-children')
  , isArray         = require('is-array');

module.exports = function (options, events) {
  var options   = options || {},
      className = (options.className && isArray(options.className)) 
        ? options.className.splice(0, 0, '').join('.')
        : options.className ? '.'+options.className : null,
      key       = options.key,
      value     = options.value,
      style     = options.style,
      children  = options.children,
      elements  = [];

  var a = function (value, options) {
    return h('a', options, value);
  }

  if (isArray(value)) {
    console.log('isArray true', value)
    for (var i = 0; i < value.length; i++) {
      var val = value[i];
      console.log('val', val)
      var aElem = a(val.name, { href: val.id })
      console.log('aElem', aElem)
      elements.push(aElem);
      if (i !== value.length-1) elements.push(' | ');
    }
  } else {
    elements.push(a(key, { href: value }));
  }
  console.log('elements', elements)

  if (children) renderChildren(elements, children);
  return h('p'+className, { style: style[key] }, elements);
};