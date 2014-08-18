var debug = require('debug')('person-ui');
var h = require('virtual-hyperscript');
var Input = require('geval/multiple');
var Event = require('value-event/event')
var ValueEvent = require('value-event/value');
var ChangeEvent = require('value-event/change');
var Observ = require('observ');
var ObservStruct = require('observ-struct');

function Person (options) {


  // setup property state and events
  var eventNames = [];
  var entityStruct = {};
  var editingStruct = {};

  Person.properties.forEach(function (propName) {
    entityStruct["prop-"+propName] = Observ(options.person[propName]);
    eventNames.push("change-"+propName);
    editingStruct["prop-"+propName] = Observ(false);
    eventNames.push("toggleEdit-"+propName);
  })

  var events = Input(eventNames);

  // create state
  var state = ObservStruct({
    entity: ObservStruct(entityStruct),
    editing: ObservStruct(editingStruct),
    events: events,
  });

  // define events
  Person.properties.forEach(function (propName) {
    events["change-"+propName](
      Person.changeProperty(propName, state)
    );
    events["toggleEdit-"+propName](
      Person.toggleEditProperty(propName, state)
    );
  })

  debug("setup", state());

  return { state: state, events: events };
}

Person.properties = ["name", "email", "bio"];

Person.changeProperty = function (propName, state) {
  return function (data) {
    debug("changeProperty", propName, ":", data);
    state.entity["prop-",propName].set(data[name]);
  };
};

Person.toggleEditProperty = function (propName, state) {
  return function (data) {
    debug("toggleEdit", propName, ":", data);
    state.editing["prop-"+propName].set(!state.editing["prop-"+propName]());
  };
};

Person.renderProperty = function (propName, state, events) {
  return h('div.property', {}, [
    h('label', {}, propName),
    h('input', {
      type: "text",
      name: propName,
      value: state.entity["prop-"+propName],
      readOnly: !state.editing["prop-"+propName],
      'ev-click': Event(events["toggleEdit-"+propName]),
      'ev-event': ChangeEvent(events["change-"+propName]),
    }),
  ]);
}

Person.render = function (state, events) {
  debug("render", state, events);

  return h('div.ui.person', {}, [
    h('div.properties', {}, Person.properties.map(function (propName) {
      return Person.renderProperty(propName, state, state.events);
    })),
  ])
  ;
}

module.exports = Person;
