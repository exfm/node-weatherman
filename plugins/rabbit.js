"use strict";

var request = require('superagent'),
	when = require('when');

module.exports.addMetrics = function(metrics, timestamp, pluginOpts) {

	var d = when.defer(),
		messageCount = {};

	request
		.get(pluginOpts.rabbit_url)
		.auth(pluginOpts.rabbit_auth[0], pluginOpts.rabbit_auth[1])
		.end(function(res){
			res.body.forEach(function(rabbitQueue){
				if (rabbitQueue.name === 'celery') {
					messageCount['celery'] = rabbitQueue.messages;
				}
				else if (rabbitQueue.name === 'metadata') {
					messageCount['metadata'] = rabbitQueue.messages;
				}
				else if (rabbitQueue.name === 'phantom') {
					messageCount['phantom'] = rabbitQueue.messages;
				}
			});

			var rabbit = [{
				'name': 'CeleryQueue',
				'value': messageCount.celery,
				'unit': 'Count',
				'timestamp': timestamp,
				'dimensions': {}
			},
			{
				'name': 'MetadataQueue',
				'value': messageCount.metadata,
				'unit': 'Count',
				'timestamp': timestamp,
				'dimensions': {}
			},
			{
				'name': 'PhantomQueue',
				'value': messageCount.phantom,
				'unit': 'Count',
				'timestamp': timestamp,
				'dimensions': {}
			}];

			rabbit.forEach(function(metric){
				metrics.push(metric);
			});
			d.resolve(metrics);
		});
	return d.promise;
}