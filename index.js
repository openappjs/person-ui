var debug = require('debug')('person-ui');
var h = require('virtual-hyperscript');
var input = require('geval/multiple');
var event = require('value-event/event')
var valueEvent = require('value-event/value');
var changeEvent = require('value-event/change');
var Observ = require('observ');
var ObservStruct = require('observ-struct');

function Person (options) {

  var events = input(['name', 'email', 'bio']);

  // setup state
  var state = ObservStruct({
    person: ObservStruct({
      aName: Observ(options.person.name),
      email: Observ(options.person.email),
      bio: Observ(options.person.bio),
    }),
    events: events,
  });

  events.name(function (data) {
    debug("name", data);
    state.person.name.set(data.name);
  });

  events.email(function (data) {
    debug("email", data);
    state.person.email.set(data.email);
  });

  events.bio(function (data) {
    debug("bio", data);
    state.person.bio.set(data.bio);
  });

  debug("setup", state);

  return { state: state, events: events };
}

Person.render = function (state, events) {
  debug("render", state, events);

  return h('div.ui.person', {}, [
    h('div.properties', {}, [
      h('input', {
        type: "text",
        name: "name",
        value: state.person.aName,
        'ev-event': changeEvent(state.events.name),
      }),
      h('input', {
        type: "text",
        name: "name",
        value: state.person.email,
        'ev-event': changeEvent(state.events.name),
      }),
      h('input', {
        type: "text",
        name: "name",
        value: state.person.bio,
        'ev-event': changeEvent(state.events.name),
      }),
    ]),
  ])
  ;
}

module.exports = Person;
