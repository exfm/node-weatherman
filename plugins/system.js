"use strict";

var os = require('os');

module.exports.addMetrics = function(metrics, timestamp, namespace) {
	var loadAvg = os.loadavg()[0],
		freeMemPercent = (os.freemem()/os.totalmem())*100,
		uptime = os.uptime();

	// uptime is in seconds

	var system = [{
		'name': 'LoadAvg',
		'value': loadAvg,
		'unit': 'Percent',
		'timestamp': timestamp,
		'sum': loadAvg,
		'dimensions': {}
	},
	{
		'name': 'FreeMemPercent',
		'value': freeMemPercent,
		'unit': 'Percent',
		'timestamp': timestamp,
		'sum': freeMemPercent,
		'dimensions': {}
	}];

	system.forEach(function(metric){
		metrics.push(metric);
	});
}