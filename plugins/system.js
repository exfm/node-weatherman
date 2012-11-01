"use strict";

var os = require('os');

module.exports.addMetrics = function(metrics, timestamp, namespace) {
	var loadAvg = os.loadavg()[0],
		freeMemPercent = (os.freemem()/os.totalmem())*100,
		uptime = os.uptime();

	// uptime is in seconds

	var system = [{
		'name': 'loadAvg',
		'value': loadAvg,
		'unit': 'Percent',
		'timestamp': timestamp,
		'max': loadAvg,
		'min': loadAvg,
		'samples': 1,
		'sum': loadAvg
	},
	{
		'name': 'freeMemPercent',
		'value': freeMemPercent,
		'unit': 'Percent',
		'timestamp': timestamp,
		'max': freeMemPercent,
		'min': freeMemPercent,
		'samples': 1,
		'sum': freeMemPercent
	},
	{
		'name': 'uptime',
		'value': uptime,
		'unit': 'Seconds',
		'timestamp': timestamp,
		'max': uptime,
		'min': uptime,
		'samples': 1,
		'sum': uptime
	}];

	system.forEach(function(metric){
		metrics.push(metric);
	});
}