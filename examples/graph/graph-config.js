var h = require('mercury').h;

var clipPathLarge = h(
		'svg:clipPath', 
		{ id: 'clip-path-large' }, 
		h('circle', { r:50, cx: 50, cy: 50 })
);

var clipPathSmall = h(
	'svg:clipPath',
	{ id: 'clip-path-small' },
	h('circle', { r:25, cx: 25, cy: 25 })
);


module.exports = {
	ui: { renderAs: 'svg' },
	id: { renderAs: null, key: '@id' },
  defs: [clipPathLarge, clipPathSmall],
  location: { renderAs: 'edge', objects: { renderAs: 'node' } },
  memberships: { renderAs: 'edge' },
  children: [],
  node: { renderAs: ['image', 'circle']}
};