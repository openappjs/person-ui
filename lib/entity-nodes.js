var _ = require('lodash');
var isArray = require('is-array');

module.exports = function (model, predicates) {
	// if (!isArray(predicates)) throw new TypeError('predicates must be an array');
	var root = _.omit(model, function (prop) {
		return _.contains(predicates, prop);
	});
	var nodes = [root];
	var edges = []; 
	var index = 1;

	for (var i=0;i<predicates.length;i++) {
		//assumes graph is array
		var predicate = predicates[i];
		var graph = model[predicate];

		if (graph) {
			for (var j=0;j<graph.length;j++) {
				var node = graph[j];
				if (node.id) {
				//assumes nodes have an id property
					var edge = { from: root.id, to: node.id, type: predicate };
					nodes.push(node);
					edges.push(edge);
					index++;
				}
			}			
		}
	}

	return {
		nodes: nodes,
		edges: edges
	};
}