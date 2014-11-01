var debug = require('debug')('person-ui');
var mercury = require('mercury');
var _ = require('lodash');
var fs = require('fs'); 
var renderChildren = require('./lib/render-children');
var renderInput = require('./lib/render-input');
var renderImage = require('./lib/render-image');
var renderP     = requie('./lib/render-p');
var renderA     = require('./lib/render-a');
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

Person.renderProperty = function (propName, state, events, style) {
  var key = 'prop-' + propName;
  var readOnly = !state.editing[key];
  var classList = style.classList[key] ? style.classList[key].join('.') : '';

  return h('div.property.prop-'+propName+classList, { style: style[key] }, [
    h('label.label', { style: style.label }, propName),
    h('input.input', {
      style: style.input(readOnly, propName),
      type: "text",
      name: propName,
      value: state.entity[key],
      readOnly: readOnly
      //disbled temporarily for craftodex
      // 'ev-click': mercury.event(events["toggleEdit-"+propName]),
      // 'ev-event': mercury.changeEvent(events["change-"+propName])
    }),
  ]);
};

Person.renderBio = function (state, events, style)  {
  var classList = style.classList['prop-bio'] ? style.classList['prop-bio'].join('.') : '';

  return h('div.property.prop-bio'+classList, { style: style['prop-bio'] }, [
    h('p.bio', state.entity['prop-bio'])
  ]);
};

Person.renderImage = function (state, events, style) {
  var classList = style.classList.image ? style.classList.image.join('.') : '';

  return h('img'+classList, {
    style: style.img,
    src: state.entity['prop-image']
  })
};

Person.renderLocation = function (state, events, style)  {
  var classList = style.classList['prop-location'] ? style.classList['prop-location'].join('.') : '';

  return h('div.property.prop-location'+classList, { style: style['prop-bio'] }, [
    h('p.bio', state.entity['prop-bio'])
  ]);
}

Person.render = function (state, events) {
  console.log('rendering ', state, events)

  debug("render", state, events);

  var style = state.styleController(state.parent, state.view);
  var elements = Person.properties.map(function(propName) {
    var config = state.config[propName];
    var options = {
      key: propName,
      value: state.model[propName],
      style: style
    };
    switch (config.renderAs) {
      case 'input':
        options = _.extend(options, { className: ['property', 'prop-'+propName] })
        renderInput(options);
        break;
      case 'img':
        options = _.extend(options, { className: 'image' })
        renderImage(options);
        break;
      case 'p':
        options = _.extend(options, { className: ['property', 'prop-'+propName] })
        renderP(options);
      case 'a':
        options = _.extend(options, { className: []});
        renderA(options);

    }
  });

  if (state.children.length > 0) renderChildren(elements, state.children);

  return h('#_'+state.entity['prop-id']+'.ui.person.'+state.view, 
    {
      style: style.person,
      'ev-click': state.commands.click ? mercury.event(state.commands.click, {id: state.entity['prop-id']}) : null
    },
    elements, 
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
  );
};

module.exports = Person;
