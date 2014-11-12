//main
var mercury           = require('mercury')
 ,  h                 = mercury.h;

//helpers
var _                 = require('lodash')
 ,  blackSwap         = require('./lib/black-list-swap')
 ,  debug             = require('debug')('person-ui')
 ,  mercuryBlackList  = ["name", "_diff", "_type", "_version"]
 ,  keySwap           = require('key-swap');

//renderers
var renderA           = require('./lib/render-a')
 ,  renderChildren    = require('./lib/render-children')
 ,  renderInput       = require('./lib/render-input')
 ,  renderImage       = require('./lib/render-image')
 ,  renderP           = require('./lib/render-p');

function Person (options) {
  options = options || {};
  var styleController = options.styleController;
  var config = options.config || {};
  var model;
  var mercuryModel = {};
  //TODO commands -> events
  var commands = options.commands || {};
  var parent = options.parent || {};
  var children = options.children || [];
  var view = options.view || {};

  // setup property state and events
  var eventNames = [];
  var editingStruct = {};

  //de[json-ld]ify
  if (config.id && config.id.key) {
    model = keySwap(options.model, config.id.key, 'id')
  } else {
    model = options.model;
  }

  Person.properties.forEach(function (propName) {
    mercuryModel[propName] = mercury.value(model[propName]);
    switch (propName) {
      case 'id':
      case 'image':
      case 'location':
      case 'memberships':
        break;
      default:
        eventNames.push("change-"+propName);
        editingStruct["prop-"+propName] = mercury.value(false);
        eventNames.push("toggleEdit-"+propName);
    }
  });

  mercuryModel = blackSwap(mercuryModel, mercuryBlackList);
  config = blackSwap(config, mercuryBlackList);

  eventNames.push('click')
  var events = mercury.input(eventNames);

  // create state
  var state = mercury.struct({
    parent: mercury.struct(parent),
    children: mercury.array(children),
    commands: mercury.value(commands),
    config: mercury.struct(config),
    model: mercury.struct(mercuryModel),
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
      case 'id':
      case 'image':
      case 'location':
      case 'memberships':
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

Person.properties = [ 
  "name", 
  "handle", 
  "email", 
  "bio", 
  "location", 
  "image", 
  "id", 
  "memberships"
];

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

Person.render = function (state, events) {
  debug("render", state, events);
  var style = state.styleController(state.parent, state.view),
      elements = [];
  
  style = blackSwap(style, mercuryBlackList);

  Person.properties.forEach(function(propName) {
    var _propName = blackSwap(propName, mercuryBlackList);
    var config = state.config[_propName];
    var renderAs = config ? config.renderAs : null;

    if (renderAs) {
      var options = {
        key: _propName,
        value: state.model[_propName],
        style: style,
        className: config.className ? config.className : []
      };
      options.className.push('property', propName);
      switch (renderAs) {
        case 'input':
          elements.push(renderInput(options));
          break;
        case 'img':
          elements.push(renderImage(options));
          break;
        case 'p':
          elements.push(renderP(options));
          break;
        case 'a':
          elements.push(renderA(options));
          break;
        default:
          elements.push(
            h('p', { style: { display: 'none' } }, state.model[_propName] )
          );
          break;
      }      
    } else if (typeof state.model[_propName] === 'string') {
      //assumes model value is string
      elements.push(
        h('p', { style: {display: 'none'} }, state.model[_propName] )
      );
    }
  });

  if (state.children.length > 0) renderChildren(elements, state.children);

  return h('#_'+state.model.id+'.ui.person.'+state.view, 
    {
      style: style.person,
      'ev-click': state.commands.click ? mercury.event(state.commands.click, {id: state.model.id }) : null
    },
    elements 
  );
};

module.exports = Person;