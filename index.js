var debug = require('debug')('person-ui');
var h = require('virtual-hyperscript');
var Input = require('geval/multiple');
var Event = require('value-event/event')
var ValueEvent = require('value-event/value');
var ChangeEvent = require('value-event/change');
var Observ = require('observ');
var ObservStruct = require('observ-struct');

function Person (options) {


  var eventNames = [];
  Person.properties.forEach(function (propName) {
    eventNames.push(propName + "Change");
    eventNames.push(propName + "ToggleEdit");
  })

  var events = Input(eventNames);

  // setup state
  var state = ObservStruct({
    entity: ObservStruct({
      " name": Observ(options.person.name),
      email: Observ(options.person.email),
      bio: Observ(options.person.bio),
    }),
    editing: ObservStruct({
      " name": Observ(false),
      email: Observ(false),
      bio: Observ(false),
    }),
    events: events,
  });

  Person.properties.forEach(function (propName) {
    events[propName + "Change"](
      Person.changeProperty(
        propName,
        state.entity[propName]
      )
    );
    events[propName + "ToggleEdit"](
      Person.toggleEditProperty(
        propName,
        state.editing[propName]
      )
    );
  })

  debug("setup", state);

  return { state: state, events: events };
}

Person.properties = [" name", "email", "bio"];

Person.changeProperty = function (name, state) {
  return function (data) {
    debug("change", name, ":", data);
    state.set(data[name]);
  };
};

Person.toggleEditProperty = function (name, state) {
  return function (data) {
    debug("change", name, ":", data);
    state.set(!state());
  };
};

Person.renderProperty = function (propName, state, events) {
  return h('div.property', {}, [
    h('label', {}, propName),
    h('input', {
      type: "text",
      name: propName,
      value: state.entity[propName],
      readOnly: !state.editing[propName],
      'ev-click': Event(events[propName + "ToggleEdit"]),
      'ev-event': ChangeEvent(events[propName + "Change"]),
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
