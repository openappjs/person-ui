var debug = require('debug')('person-ui');
var mercury = require('mercury');
var h = mercury.h;
var cssBuilder = require('css-builder');
var b = cssBuilder();
var insertCss = require('insert-css');
var cfs = require('css-face-string');

var fontFace = cfs.file({
  name: 'icons',
  files: [
    {url: 'fonts/icomoon.eot', format: 'eot'},
    {url: 'fonts/icomoon.svg', format: 'svg'},
    {url: 'fonts/icomoon.ttf', format: 'ttf'},
    {url: 'fonts/icomoon.woff', format: 'woff'},
  ]
});


var rulesObject = {
  '.icon-arrow-right:before': {
    fontFamily: 'icons',
    speak: 'none',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontVariant: 'normal',
    textTransform: 'none',
    lineHeight: 1,
    webkitFontSmoothing: 'antialiased',
    mozOsxFontSmoothing: 'grayscale',
    content: '"\\e600"'
  }
}

b.rules(rulesObject);
insertCss(fontFace);
insertCss(b.toString());

var FontIcon = function (options) {
  options = options || {};
  var style = options.style || {};
  var config = options.config || {};
  var model = options.model || {};

  var state = mercury.struct({
    config: mercury.struct(config),
    model: mercury.struct(model),
    style: mercury.struct(style),
    render: mercury.value(FontIcon.render)
  });

  return {state: state};
}

FontIcon.render = function (state, events) {
  return h('div', {}, [
    h('span', {
      className: 'icon-arrow-right'
    }),
    h('span', {
      className: 'screen-reader-text'
    }, state.model.iconName)
  ]
  )
};


module.exports = FontIcon;