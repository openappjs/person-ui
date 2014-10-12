var debug = require('debug')('person-ui');
var mercury = require('mercury');
var validate = require('jsonschema').validate;
var fs = require('fs'); 
var h = mercury.h;
require("setimmediate");

function QueryParent (styles) {
  this.styles = styles;
};

QueryParent.prototype.hook = function (elem) {
  setImmediate(function () {
    var parent = elem.parentElement;
    var width = parent.clientWidth;
    var height = parent.clientHeight;
    var style = this.styles(width, height);
    this.recurse(elem, style)
  }.bind(this))
};

QueryParent.prototype.recurse = function (elem, style) {
  if (this.match(elem, style)) {
    this.setStyle(elem, style.properties);
    if (elem.childNodes && style.children) {
      for (var i=0;i<elem.childNodes.length;i++) {
        for (var j=0;j<style.children.length;j++) {
          console.log(elem.childNodes[i], style.children[j])
          this.recurse(elem.childNodes[i], style.children[j])
        }
      }
    }
  }
}

QueryParent.prototype.setStyle = function (elem, properties) {
  var inlineStyle = JSON.stringify(properties)
                        .replace(/[{}"]/g, '')
                        .replace(/,/g, '; ');
  elem.setAttribute('style', inlineStyle);
};

QueryParent.prototype.match = function (elem, style) {
  if (typeof style.className === 'string' && elem.classList.contains(style.className)) return true;
  if (typeof style.className === 'object') {
    var validation = validate(elem.className, style.className);
    return validation.errors.length === 0 ? true : false;
  }
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
  console.log('state in render', state)


  var commands = [];

  for (var i = 0; i < state.commands.length; i++) {
    var command = state.commands[i];
    if (typeof command !== 'undefined') {
      commands.push(
        command && command.render && command.render(command) || stringify(command)
      );
    }
  };


  return h('div.ui.person', {
    'ev-queryParent': new QueryParent(state.styles)
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
