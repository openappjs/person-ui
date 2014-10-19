var debug = require('debug')('person-ui');
var mercury = require('mercury');
var h = mercury.h;
var cssBuilder = require('css-builder');
var b = cssBuilder();
var insertCss = require('insert-css');
var exists = require('check-nested');
var extend = require('extend');

screenReaderTextInlineStyle = {
  position: 'absolute',
  top: '-9999px',
  left: '-9999px'
}


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

  var selector = '.' + model.iconName + ':before';
  var rulesObject = {};
  rulesObject[selector] = {
      fontFamily: model.fontFamily,
      speak: 'none',
      textTransform: 'none',
      webkitFontSmoothing: 'antialiased',
      mozOsxFontSmoothing: 'grayscale',
      content: "'" + model.unicode +"'",
      textDecoration: 'none',
  };

  rulesObject[selector] = extend(rulesObject[selector], style);

  b.rules(rulesObject);
  insertCss(b.toString());

  return {state: state};
};

FontIcon.render = function (state, events) {
  return h('div.icon', { style: state.style.icon }, [
    h('span', {className: state.model.iconName}),
    h('span.screen-reader-text', {
      style: screenReaderTextInlineStyle
    }, state.model.screenReaderText )
  ]
  )
};


module.exports = FontIcon;
