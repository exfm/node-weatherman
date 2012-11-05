"use strict";

var os = require('os'),
	when = require('when');

module.exports.addMetrics = function(timestamp, pluginOpts) {

	var d = when.defer(),
		loadAvg = os.loadavg()[0],
		freeMemPercent = (os.freemem()/os.totalmem())*100,
		uptime = os.uptime(),
		metrics = [];

	// uptime is in seconds

	var system = [{
		'name': 'LoadAvg',
		'value': loadAvg,
		'unit': 'Percent',
		'timestamp': timestamp,
		'dimensions': {}
	},
	{
		'name': 'FreeMemPercent',
		'value': freeMemPercent,
		'unit': 'Percent',
		'timestamp': timestamp,
		'dimensions': {}
	}];

	system.forEach(function(metric){
		metrics.push(metric);
	});
	d.resolve(metrics);
	return d.promise;
}