var svg               = require('mercury').svg
  , renderChildren  = require('./render-children')
  , extend          = require('extend')
  , isArray         = require('is-array');

module.exports = function (options, events) {
  var options   = options || {}
   ,  className = options.className || ''
   ,  elements  = []
   ,  key       = options.key
   //TODO validate attrs: cx, cy r
   ,  attrs     = options.attrs || {}
   ,  style     = options.style || {}
   ,  children  = options.children;

  if (isArray(className)) {
    className.splice(0, 0, '');
    className = className.join('.');
  } else if (className) {
    className = '.'+className;
  }


  attrs = extend(attrs, style[key]);
  console.log('attrs', attrs)
  if (children) renderChildren(elements, children);

  return svg(
    'circle'+className, 
    attrs, 
    elements
  );
}