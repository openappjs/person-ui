var debug = require('debug')('person-ui');
var mercury = require('mercury');
var _ = require('lodash');
var fs = require('fs'); 
var h = mercury.h;
var ElementQuery = require('element-query');


function Person (options) {
  options = options || {};
  var styleController = options.styleController;
  var config = options.config || {};
  var model = options.model || {};
  //TODO commands -> events
  var commands = options.commands || {};
  var parent = options.parent || {};
  var children = options.children || [];
  var view = options.view || {};

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

  eventNames.push('click')
  var events = mercury.input(eventNames);

  // create state
  var state = mercury.struct({
    parent: mercury.struct(parent),
    children: mercury.array(children),
    commands: mercury.value(commands),
    config: mercury.struct(config),
    entity: mercury.struct(entityStruct),
    editing: mercury.struct(editingStruct),
    styleController: mercury.value(styleController),
    events: events,
    view: mercury.value(view),
    render: mercury.value(Person.render),
  });

  state.events.click(function() {
    state.view.set('profile')
  })

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

  debug("setup", state());

  return { state: state, events: events };
}

Person.properties = ["name", "email", "bio", "image", "id"];

Person.click = function (state) {
  return function (data) {
    state.commands.click(state)
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

Person.renderProperty = function (propName, state, events, style) {
  var key = 'prop-' + propName;
  var readOnly = !state.editing[key];
  var view = state.view

  return h('div.property.prop-'+propName, { style: style[key] }, [
    h('label.label', { style: style.label }, propName),
    h('input.input', {
      style: style.input(readOnly, view),
      type: "text",
      name: propName,
      value: state.entity[key],
      readOnly: readOnly,
      'ev-click': mercury.event(events["toggleEdit-"+propName]),
      'ev-event': mercury.changeEvent(events["change-"+propName])
    }),
  ]);
};

Person.renderImage = function (state, events, style) {
  return h('img', {
    style: style.img,
    src: state.entity['prop-image']
  })
};

Person.render = function (state, events) {
  console.log('rendering ', state, events)

  debug("render", state, events);

  var style = state.styleController(state.parent, state.view);
  var children = [];

  for (var i = 0; i < state.children.length; i++) {
    var child = state.children[i];
    if (typeof child !== 'undefined') {
      children.push(
        child && child.render && child.render(child) || child
      );
    }
  };

  return h('#_'+state.entity['prop-id']+'.ui.person', {
    style: style.person,
    'ev-click': state.commands.click ? mercury.event(state.commands.click, {id: state.entity['prop-id']}) : null
  }, [
    h('.image', {style: style.image}, Person.renderImage(state, state.events, style)),
    h('.properties', {style: style.properties}, Person.properties.map(function (propName) {
      switch (propName) {
        case 'image':
        case 'id':
          break;
        default:
          return Person.renderProperty(propName, state, state.events, style); 
      }
    })),
    h('.children', {style: style.children}, children.map(function (child) {
      return h('.child', {style: style.child}, child)
    }))
  ]);
};

module.exports = Person;
