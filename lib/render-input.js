var h               = require('mercury').h
  , renderChildren  = require('./render-children')
  , isArray         = require('is-array');

module.exports = function (options, events) {
  var options   = options || {},
      //make better
      className = options.className,
      _key       = options.key,
      value     = options.value,
      type      = options.type || 'text',
      style     = options.style,
      readOnly  = options.readOnly || true,
      children  = options.children;

  if (isArray(className)) {
    className.splice(0, 0, '');
    className = className.join('.');
  } else if (className) {
    className = '.'+className;
  }

  var key = (_key[0] == '_') ? _key.slice(1) : _key;

  var elements = [
    h('label.label', { style: style.label }, key),
    h('input.input', {
      style: style.input(readOnly, key),
      type: type,
      name: key,
      value: value,
      readOnly: readOnly
      //disbled temporarily for craftodex
      // 'ev-click': mercury.event(events["toggleEdit-"+propName]),
      // 'ev-event': mercury.changeEvent(events["change-"+propName])
    })
  ];

  if (children) renderChildren(elements, children);
  return h('div'+className, { style: style[_key] }, elements);
};