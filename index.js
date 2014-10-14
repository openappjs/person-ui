var debug = require('debug')('person-ui');
var mercury = require('mercury');
var _ = require('lodash');
var fs = require('fs'); 
var h = mercury.h;
var ElementQuery = require('element-query');


function Person (options) {
  options = options || {};
  var styles = options.styles || {};
  var config = options.config || {};
  var model = options.model || {};
  var commands = options.commands || {};
  var children = options.children || [];
  var view = options.view || 'profile';


  // setup property state and events
  var eventNames = [];
  var entityStruct = {};
  var editingStruct = {};

  Person.properties.forEach(function (propName) {
    entityStruct["prop-"+propName] = mercury.value(options.model[propName]);
    switch (propName) {
      case 'image':
        break;
      case 'id':
        break;
      default:
        eventNames.push("change-"+propName);
        editingStruct["prop-"+propName] = mercury.value(false);
        eventNames.push("toggleEdit-"+propName);
    }
  });


  eventNames.push('click');
  var events = mercury.input(eventNames);

  // create state
  var state = mercury.struct({
    children: mercury.array(children),
    commands: mercury.value(commands),
    config: mercury.struct(config),
    entity: mercury.struct(entityStruct),
    editing: mercury.struct(editingStruct),
    styles: mercury.value(styles),
    events: events,
    view: mercury.value(view),
    render: mercury.value(Person.render),
  });

  // define events
  Person.properties.forEach(function (propName) {
    switch (propName) {
      case 'image':
        break;
      case 'id':
        break;
      default:
        events["change-"+propName](
          Person.changeProperty(propName, state)
        );
        events["toggleEdit-"+propName](
          Person.toggleEditProperty(propName, state)
        );
    }
  });

  events['click'](Person.click);


  debug("setup", state());

  return { state: state, events: events };
}

Person.properties = ["name", "email", "bio", "image", "id"];

Person.click = function (state) {
  console.log('outer clicked', state)
  return function (evt) {
    state.commands.click()
  }
}


Person.changeViewAs = function (view, state) {
  return function (data) {
    state.view.set(view)
  }
};

Person.changeProperty = function (propName, state) {
  return function (data) {
    debug("changeProperty", propName, ":", data);
    state.entity["prop-"+propName].set(data[propName]);
  };
};

Person.toggleEditProperty = function (propName, state) {
  return function (data) {
    debug("toggleEdit", propName, ":", data);
    state.editing["prop-"+propName].set(!state.editing["prop-"+propName]());
  };
};

Person.renderProperty = function (propName, state, events) {
  var readOnly = !state.editing["prop-"+propName];

  return h('div.property.prop-'+propName, {}, [
    h('label.label', propName),
    h('input.input', {
      type: "text",
      name: propName,
      value: state.entity["prop-"+propName],
      readOnly: readOnly,
      'ev-click': mercury.event(events["toggleEdit-"+propName]),
      'ev-event': mercury.changeEvent(events["change-"+propName])
    }),
  ]);
};

Person.renderImage = function (state, events) {
  return h('img', {
    src: state.entity['prop-image']
  })
};

Person.render = function (state, events) {
  debug("render", state, events);

  var children = [];

  for (var i = 0; i < state.children.length; i++) {
    var child = state.children[i];
    if (typeof child !== 'undefined') {
      children.push(
        child && child.render && child.render(child) || child
      );
    }
  };

  return h('.ui.person', {
    'ev-elementQuery': new ElementQuery(state.styles, state.view),
    'ev-click': Person.click(state)
  }, [
    h('.image', Person.renderImage(state, state.events)),
    h('.properties', Person.properties.map(function (propName) {
      if (propName !== ('image' || 'id')) { return Person.renderProperty(propName, state, state.events); }
    })),
    h('.children', children.map(function (child) {
      return h('.child', child)
    }))
  ]);
};

module.exports = Person;
