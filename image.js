var debug = require('debug')('person-ui');
var mercury = require('mercury');
var h = mercury.h;

var Image = function (options) {
  options = options || {};
  var style = options.style || {};
  var config = options.config || {};
  var model = options.model || {};

  var state = mercury.struct({
    config: mercury.struct(config),
    model: mercury.struct(model),
    style: mercury.struct(style),
    render: mercury.value(Image.render)
  });

  return {state: state};
}


Image.render = function (state, events) {
  return h('img', {
    style: state.style,
    src: state.model.src
  });

}

module.exports = Image;