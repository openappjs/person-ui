var h = require('mercury').h;

//renderers
var renderImage 			= require('./render-svg-image');
var render = {
	a: require('./render-a'),
	img: require('./render-img'),
	image: renderImage,
	'svg:image': renderImage,
	input: require('./render-input'),
	p: require('./render-p'),
	children: require('./render-children')
};

module.exports = function(model, config, style) {
	return function iterator (propName) {
		console.log(propName)

		var val = model[propName]
		 ,	propConfig = config[propName]
		 ,	renderAs = (propConfig) ? propConfig.renderAs : null
		 ,	className = (propConfig) ? propConfig.className : [];


		var options = {
			key: propName,
			value: val,
			style: style,
			className: className
		};

		if (render[renderAs]) {
			return render[renderAs](options);
		} else {
			options.style = { display: 'none' }
			return render.p(options);
		}
	}
}


