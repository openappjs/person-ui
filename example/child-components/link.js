var debug = require('debug')('person-ui');
var mercury = require('mercury');
var h = mercury.h;

var Link = function (options) {
  options = options || {};
  var config = options.config || {};
  var model = options.model || {};
  var children = options.children || [];
  var style = options.style || {};

  var state = mercury.struct({
    children: mercury.array(children),
    config: mercury.struct(config),
    model: mercury.struct(model),
    render: mercury.value(Link.render),
    style: mercury.struct(style)
  });

  return {state: state};
};

Link.render = function (state, events) {
  var children = state.children;
  console.log(children, 'children')
  var recursiveRender = function(children) {
    var renderedChildren = [];
    if (children.length > 0) {
      for (var i=0; i<children.length; i++) {
        var child = children[i];
        if (child && child.render) {
          renderedChildren.push(child.render(child));
        } else {
          renderedChildren.push(child);
        }
      }
    }
    return renderedChildren;
  };

  return h('a', {
    className: state.config.className,
    style: state.style,
    href: state.model.href,
  }, recursiveRender(children));

}


module.exports = Link;