var h               = require('mercury').h
  , renderChildren  = require('./render-children')
  , extend          = require('extend');

module.exports = function (options, events) {
  var options   = options || {}
      className = options.className || ''
   ,  elements  = []
   ,  key       = options.key
   ,  attrs     = options.attrs || {}
   ,  style     = options.style || {}
   ,  children  = options.children;

  if (isArray(className)) {
    className.splice(0, 0, '');
    className = className.join('.');
  } else if (className) {
    className = '.'+className;
  }


  attrs = extend(attrs, style);
  if (children) renderChildren(elements, children);

  return h(
    'image'+className, 
    attrs, 
    elements
  );
}