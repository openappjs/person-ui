var debug = require('debug')('person-ui');
var mercury = require('mercury');
var fs = require('fs');
var nested = require('check-nested');
var h = mercury.h;
var Link = require('./link');
var Image = require('./image');

var icon = Image({
  style: {
    'position': 'absolute',
    'display':'inline-block',
    'top': 0,
    'bottom': 0,
    'right': '10px',
    'margin': 'auto'
  },
  model: {
    src: 'data:image/png;base64,' + fs.readFileSync(__dirname + "/images/glyphicons_223_chevron-right.png", "base64")
  }
}).state;

var link = Link({
  model: {
    href: '/mikey-williams',
    content: icon
  },
  style: {}
}).state;


function Person (options) {
  options = options || {};
  var style = options.style || {};
  var config = options.config || {};
  var model = options.model || {};
  var commands = [link];



  // setup property state and events
  var eventNames = [];
  var entityStruct = {};
  var editingStruct = {};

  Person.properties.forEach(function (propName) {
    entityStruct["prop-"+propName] = mercury.value(model[propName]);
    if (propName !== 'image') {
      eventNames.push("change-"+propName);
      editingStruct["prop-"+propName] = mercury.value(false);
      eventNames.push("toggleEdit-"+propName);
    }
  });

  var events = mercury.input(eventNames);

  // create state
  var state = mercury.struct({
    //TODO select style/config from multiple options logic
    commands: mercury.array(commands),
    config: mercury.struct(config),
    style: mercury.struct(require('./styles/listItemMobile')),
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
      style: state.style.person.properties.label.style
    }, propName),
    h('input', {
      type: "text",
      name: propName,
      value: state.entity["prop-"+propName],
      readOnly: readOnly,
      style: state.style.person.properties.input.style(propName, readOnly),
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

  var commands = [];

  for (var i = 0; i < state.commands.length; i++) {
    var command = state.commands[i];
    if (typeof command !== 'undefined') {
      commands.push(
        command && command.render && command.render(command) || stringify(command)
      );
    }
  }

  return h('div.ui.person', {
    style: state.style.person.style
  }, [
      h('div.image', {
        style: nested(state, 'state.style.person.image.style') || null
      }, Person.renderImage(state, events)),
      h('div.properties', {
        style: nested(state, 'state.style.person.properties.style') || null
      }, Person.properties.map(function (propName) {
        if (propName !== 'image') { return Person.renderProperty(propName, state, state.events); }
      })),
      h('div.commands', {
        style: nested(state, 'state.style.person.commands.style') || null
      }, commands.map(function (command) {
        return h('.command', {}, command)
      })),
  ])
  ;
};

module.exports = Person;
