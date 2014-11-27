var renderImage 			= require('./render-svg-image');
module.exports = {
	a: require('./render-a'),
	img: require('./render-img'),
	image: renderImage,
	'svg:image': renderImage,
	input: require('./render-input'),
	p: require('./render-p'),
	children: require('./render-children')
};