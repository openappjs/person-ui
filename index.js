//main
var mercury           = require('mercury')
 ,  h                 = mercury.h
 , 	svg 							= mercury.svg;

//helpers
var _                 = require('lodash')
 ,  blackSwap         = require('./lib/black-list-swap')
 ,  debug             = require('debug')('person-ui')
 ,  mercuryBlackList  = ["name", "_diff", "_type", "_version"]
 ,  keySwap           = require('key-swap')
 ,  graphify          = require('./lib/entity-nodes')
 , 	dagre							= require('dagre')
 ,	Promise						= require('bluebird')
 ,	renderElements 		= require('./lib/render/render-elements')
 ,	render 						= require('./lib/render/index');

var circle = require('./lib/render/render-svg-circle');
var layout = require('./lib/layout-graph');

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
};

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
};

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
	var style 			= state.styleController(state.parent, state.view)
	 ,	config 			= state.config
	 , 	predicates 	= []
	 ,	g;

	var	click 			= state.commands.click
		 	? mercury.event(state.commands.click, {id: state.model.id }) 
		 	: null

	var tag = (state.config.ui && state.config.ui.renderAs) 
			? state.config.ui.renderAs 
			: 'div';

	style = blackSwap(style, mercuryBlackList);
	var r = renderElements(state.model, config, style);
	var elements = Object.keys(state.model).map(r);
	var UiOptions = {
			style: style.person,
			'ev-click': click
	};

	if (state.view === 'graph') {
		predicates = Object.keys(config)
			.filter(function (key) { return (config[key].renderAs && config[key].renderAs === 'edge') });
	
		g = layout(state.model, style, predicates);
		console.log('g', g)

		UiOptions.width = g.graph().width;
		UiOptions.height = g.graph().height;

		g.nodes().forEach(function (n) {
			var node = g.node(n);
			var options = {
				attrs: {
					cx: String(node.x),
					cy: String(node.y),
					r: String(node.height/2)
				}
			}
			console.log(options)
			var c = circle(options);
			console.log(c)
			elements.push(c)
		})
	}


	if (state.children.length > 0) render.children(elements, state.children);
	console.log('UiOptions', UiOptions)

	if (tag === 'svg') {
		return svg(
			tag+'#_'+state.model.id+'.ui.person.'+state.view, 
			UiOptions,
			elements 
		);
	}

	return h(
		tag+'#_'+state.model.id+'.ui.person.'+state.view, 
		UiOptions,
		elements 
	);
};

module.exports = Person;