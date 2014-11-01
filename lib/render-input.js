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
      type      = options.type || 'text',
      style     = options.style,
      readOnly  = options.readOnly || true,
      children  = options.children;

  var displayKey = (key[0] == '_') ? key.slice(1) : key;
  console.log('key', key, style)  

  var elements = [
    h('label.label', { style: style.label }, displayKey),
    h('input.input', {
      style: style.input(readOnly, displayKey),
      type: type,
      name: displayKey,
      value: value,
      readOnly: readOnly
      //disbled temporarily for craftodex
      // 'ev-click': mercury.event(events["toggleEdit-"+propName]),
      // 'ev-event': mercury.changeEvent(events["change-"+propName])
    })
  ];

  if (children) renderChildren(elements, children);
  return h('div'+className, { style: style[key] }, elements);
};