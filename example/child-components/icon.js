var debug = require('debug')('person-ui');
var mercury = require('mercury');
var h = mercury.h;
var cssBuilder = require('css-builder');
var b = cssBuilder();
var insertCss = require('insert-css');
var exists = require('check-nested');

screenReaderTextInlineStyle = {
  position: 'absolute',
  top: '-9999px',
  left: '-9999px'
}


var rulesObject = {
  '.icon-arrow-right:before': {
    fontFamily: 'icons',
    speak: 'none',
    textTransform: 'none',
    lineHeight: 1,
    webkitFontSmoothing: 'antialiased',
    mozOsxFontSmoothing: 'grayscale',
    content: '"\\f105"',
    textDecoration: 'none'
  }
}

b.rules(rulesObject);
insertCss(b.toString());

var FontIcon = function (options) {
  options = options || {};
  var config = options.config || {};
  var model = options.model || {};
  var style = options.style || {};

  var state = mercury.struct({
    config: mercury.struct(config),
    model: mercury.struct(model),
    style: mercury.struct(style),
    render: mercury.value(FontIcon.render)
  });

  return {state: state};
};

FontIcon.render = function (state, events) {
  return h('div.iconDiv', { style: state.style.iconDiv }, [
    h('span', {className: state.model.iconName}),
    h('span.screen-reader-text', {
      style: state.style.screenReaderText || screenReaderTextInlineStyle
    }, state.model.screenReaderText )
  ]
  )
};


module.exports = FontIcon;
