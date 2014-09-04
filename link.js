var debug = require('debug')('person-ui');
var mercury = require('mercury');
var h = mercury.h;

var Link = function (options) {
  options = options || {};
  var config = options.config || {};
  var model = options.model || {};

  var state = mercury.struct({
    config: mercury.struct(config),
    model: mercury.struct(model),
    render: mercury.value(Link.render)
  });

  return {state: state};
}


Link.render = function (state, events) {
  var content = state.model.content;

  console.log('content in link', content)

  var recurse = function(content) {
    if (content && content.render) {
      return content.render(content); 
    }
    return content;
  };



  return h('a', {
    className: state.config.className,
    style: state.config.style,
    href: state.model.href,
  }, recurse(content));

}


module.exports = Link;