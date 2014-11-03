var debug = require('debug')('person-ui');
var mercury = require('mercury');
var _ = require('lodash');
var fs = require('fs'); 
var renderChildren = require('./lib/render-children');
var renderInput = require('./lib/render-input');
var renderImage = require('./lib/render-image');
var renderP     = require('./lib/render-p');
var renderA     = require('./lib/render-a');
var mercuryBlackList = ["name", "_diff", "_type", "_version"];
var blackSwap = function(test, blackList) {
  if (typeof test === 'object') {
    var keys = Object.keys(test);
    keys.forEach(function(key) {
      if (blackList.indexOf(key) !== -1) {
        test['_'+key] = test[key];
        delete test[key]
      }
    });
    return test;
  } else {
    if (blackList.indexOf(test) !== -1) {
      return '_'+test;
    } else {
      return test;
    }
  }
};

var h = mercury.h;

function Person (options) {
  options = options || {};
  var styleController = options.styleController;
  var config = options.config || {};
  var model = {};
  //TODO commands -> events
  var commands = options.commands || {};
  var parent = options.parent || {};
  var children = options.children || [];
  var view = options.view || {};

  // setup property state and events
  var eventNames = [];
  var editingStruct = {};

  Person.properties.forEach(function (propName) {
    model[propName] = mercury.value(options.model[propName]);
    switch (propName) {
      case 'id':
      case 'image':
      case 'location':
        break;
      default:
        eventNames.push("change-"+propName);
        editingStruct["prop-"+propName] = mercury.value(false);
        eventNames.push("toggleEdit-"+propName);
    }
  });

  model = blackSwap(model, mercuryBlackList);
  config = blackSwap(config, mercuryBlackList);

  eventNames.push('click')
  var events = mercury.input(eventNames);

  // create state
  var state = mercury.struct({
    parent: mercury.struct(parent),
    children: mercury.array(children),
    commands: mercury.value(commands),
    config: mercury.struct(config),
    model: mercury.struct(model),
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

Person.properties = ["name", "handle", "email", "bio", "location", "image", "id"];

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
  console.log('rendering ', state, events)
  debug("render", state, events);
  var style = state.styleController(state.parent, state.view),
      elements = [];
  
  style = blackSwap(style, mercuryBlackList);

  Person.properties.forEach(function(propName) {
    propName = blackSwap(propName, mercuryBlackList);
    var config = state.config[propName];
    var renderAs = config ? config.renderAs : null;
    if (renderAs) {
      var options = {
        key: propName,
        value: state.model[propName],
        style: style,
        className: config.className ? config.className : []
      };
      console.log('options', options)
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
            h('p', { style: {display: 'none'} }, state.model[propName] )
          );
          break;
      }      
    } else if (typeof state.model[propName] === 'string') {
      //assumes model value is string
      elements.push(
        h('p', { style: {display: 'none'} }, state.model[propName] )
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

  // [
  //   // h('.image', {style: style.image}, Person.renderImage(state, state.events, style)),
  //   // h('.properties', {style: style.properties}, Person.properties.map(function (propName) {
  //   //   switch (propName) {
  //   //     case 'id':
  //   //     case 'image':
  //   //       break;
  //   //     case 'bio':
  //   //       return Person.renderBio(state, state.events, style);
  //   //     case 'location':
  //   //       return Person.renderLocation(state, state.events, style);
  //   //     default:
  //   //       return Person.renderProperty(propName, state, state.events, style); 
  //   //   }
  //   // }))
  // ]