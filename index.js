var debug = require('debug')('person-ui');
var mercury = require('mercury');
var h = mercury.h;

function Person (options) {

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
    //TODO select config from multiple options logic
    config: mercury.struct(require('./styles/listItemMobile')),
    entity: mercury.struct(entityStruct),
    editing: mercury.struct(editingStruct),
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
    h('label', {
      style: state.config.person.properties.label.style
    }, propName),
    h('input', {
      type: "text",
      name: propName,
      value: state.entity["prop-"+propName],
      readOnly: readOnly,
      style: state.config.person.properties.input.style(propName, readOnly),
      'ev-click': mercury.event(events["toggleEdit-"+propName]),
      'ev-event': mercury.changeEvent(events["change-"+propName]),
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

  return h('div.ui.person', {
    style: state.config.person.style
  }, [
    h('div.image', {
      style: state.config.person.image.style
    }, Person.renderImage(state, events)),
    h('div.properties', {
      style: state.config.person.properties.style
    }, Person.properties.map(function (propName) {
      if (propName !== 'image') { return Person.renderProperty(propName, state, state.events); }
    })),
  ])
  ;
};

module.exports = Person;
