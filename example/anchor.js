var debug = require('debug')('person-ui');
var mercury = require('mercury');
var h = mercury.h;

var Anchor = function (options) {
  options = options || {};
  var style = options.style || {};
  var config = options.config || {};
  var model = options.model || {};

  var state = mercury.struct({
    config: mercury.struct(config),
    model: mercury.struct(model),
    style: mercury.struct(style),
    render: mercury.value(Anchor.render)
  });

  return {state: state};
}


Anchor.render = function (state, events) {
  var content = state.model.content;

  var recurse = function(content) {
    if (content && content.render) {
      return content.render(content); 
    }
    return content;
  };

  return h('a', {
    style: state.style,
    href: state.model.href,
  }, recurse(content));

}


module.exports = Anchor;