var dagre = require('dagre');
var graphify = require('./entity-nodes');

module.exports = function (model, style, predicates) {
	var data = graphify(model, predicates);
	var g = new dagre.graphlib.Graph();
	// Set an object for the graph label
	g.setGraph({});
	// Default to assigning a new object as a label for each new edge.
	g.setDefaultEdgeLabel(function() { return {}; });

	for (var i=0;i<data.nodes.length;i++) {
		var node 		= data.nodes[i]
		 ,	size 		= style[node.type] || {};

		var	width 	= size.width || 100 
		 , 	height 	=	size.height	|| 100;

		g.setNode(node.id, { label: null, width: width, height: height });
	}

	for (var i=0;i<data.edges.length;i++) {
		var edge = data.edges[i];
		g.setEdge(edge.from, edge.to);
	}

	dagre.layout(g);

	return g;
}