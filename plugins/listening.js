"use strict";

var request = require('superagent'),
	when = require('when');

module.exports.addMetrics = function(timestamp, pluginOpts) {

	var d = when.defer(),
		metrics = [];
	request
		.get(pluginOpts.listening_url)
		.end(function(res){
			metrics.push({
				'name': 'ListeningCount',
				'value': res.body.total,
				'unit': 'Count',
				'timestamp': timestamp,
				'dimensions': {}
			});
			d.resolve(metrics);
		});
	return d.promise;
};