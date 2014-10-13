var debug = require('debug')('person-ui');
var mercury = require('mercury');
var fs = require('fs'); 
var h = mercury.h;
var ElementQuery = require('element-query');


function Person (options) {
  options = options || {};
  var styles = options.styles || {};
  var config = options.config || {};
  var model = options.model || {};
  var commands = options.children.commands || [];

  // setup property state and events
  var eventNames = [];
  var entityStruct = {};
  var editingStruct = {};

  Person.properties.forEach(function (propName) {
    entityStruct["prop-"+propName] = mercury.value(options.model[propName]);
    if (propName !== 'image') {
      eventNames.push("change-"+propName);
      editingStruct["prop-"+propName] = mercury.value(false);
      eventNames.push("toggleEdit-"+propName);
    }
  });

  var events = mercury.input(eventNames);

  // create state
  var state = mercury.struct({
    commands: mercury.array(commands),
    config: mercury.struct(config),
    entity: mercury.struct(entityStruct),
    editing: mercury.struct(editingStruct),
    styles: mercury.value(styles),
    events: events,
    render: mercury.value(Person.render),
  });

  // define events
  Person.properties.forEach(function (propName) {
    if (propName !== 'image' ) {
      events["change-"+propName](
        Person.changeProperty(propName, state)
      );
      events["toggleEdit-"+propName](
        Person.toggleEditProperty(propName, state)
      );
    }
  })

  debug("setup", state());

  return { state: state, events: events };
}

Person.properties = ["name", "email", "bio", "image"];

Person.changeViewAs = function (view, state) {
  return function (data) {
    //state.
  }
};

Person.changeProperty = function (propName, state) {
  return function (data) {
    debug("changeProperty", propName, ":", data);
    state.entity["prop-"+propName].set(data[name]);
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

  var commands = [];

  for (var i = 0; i < state.commands.length; i++) {
    var command = state.commands[i];
    if (typeof command !== 'undefined') {
      commands.push(
        command && command.render && command.render(command) || command
      );
    }
  };


  return h('div.ui.person', {
    'ev-elementQuery': new ElementQuery(state.styles)
    // "ev-click": function() {
    //   console.log('person clicked')
    // }
  }, [
      h('div.image', Person.renderImage(state, events)),
      h('div.properties', Person.properties.map(function (propName) {
        if (propName !== 'image') { return Person.renderProperty(propName, state, state.events); }
      })),
      h('div.commands', commands.map(function (command) {
        return h('.command', command)
      }))
  ])
  ;
};

module.exports = Person;
