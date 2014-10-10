var debug = require('debug')('person-ui');
var mercury = require('mercury');
var fs = require('fs'); 
var h = mercury.h;
require("setimmediate");



function QueryParent (styles, elemName) {
  this.styles = styles;
  this.elemName = elemName;
};

QueryParent.prototype.hook = function (elem) {
  setImmediate(function () {
    var parent = elem.parentElement;
    var width = parent.clientWidth;
    var height = parent.clientHeight;
    var style = this.styles(width, height);
    console.log('style', style, this.elemName)
    var styleString = JSON.stringify(style[this.elemName])
                        .replace(/[{}"]/g, '')
                        .replace(/,/g, '; ');
    console.log('styleString', styleString)
    elem.setAttribute('style', styleString)
  }.bind(this))
};

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
    h('label', {
      'ev-queryParent': new QueryParent(state.styles, 'label')
    }, propName),
    h('input', {
      type: "text",
      name: propName,
      value: state.entity["prop-"+propName],
      readOnly: readOnly,
      'ev-queryParent': new QueryParent(state.styles, 'input'),
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
  console.log('state in render', state)


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
    'ev-queryParent': new QueryParent(state.styles, 'person')
  }, [
      h('div.image', {
        'ev-queryParent': new QueryParent(state.styles, 'image')
      }, Person.renderImage(state, events)),
      h('div.properties', {
        'ev-queryParent': new QueryParent(state.styles, 'person')
      }, Person.properties.map(function (propName) {
        if (propName !== 'image') { return Person.renderProperty(propName, state, state.events); }
      })),
      h('div.commands', {
        'ev-queryParent': new QueryParent(state.styles, 'commands')
      }, commands.map(function (command) {
        return h('.command', command)
      }))
  ])
  ;
};

module.exports = Person;
