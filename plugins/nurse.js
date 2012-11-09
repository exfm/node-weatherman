"use strict";

// see https://github.com/exfm/node-nurse

var request = require('superagent'),
	when = require('when');

String.prototype.toCamelCase = function(cap1st) {
	return ((cap1st ? "_" : "") + this).replace(/_+([^_])/g, function(a, b) {
		return b.toUpperCase();
	});
};

module.exports.addMetrics = function(timestamp, pluginOpts) {

	var d = when.defer(),
		metrics = [];
	request
		.get(pluginOpts.nurse_url)
		.end(function(res){
			pluginOpts.nurse_stats.forEach(function(metric){
				if (metric === 'memory') {
					pluginOpts.nurse_mem_stats.forEach(function(memStat){
						metrics.push({
							'name': metric.toCamelCase(true),
							'value': res.body[metric][memStat],
							'unit': 'Bytes',
							'timestamp': timestamp,
							'dimensions': {
								'Hostname': res.body.hostname,
								'MemStat': memStat.toCamelCase(true),
								'Process': process.pid
							}
						});
					});
				}
				else if (metric === 'load') {
					pluginOpts.nurse_load_stats.forEach(function(loadStat){
						metrics.push({
							'name': metric.toCamelCase(true),
							'value': res.body[metric][loadStat],
							'unit': 'Percent',
							'timestamp': timestamp,
							'dimensions': {
								'Hostname': res.body.hostname,
								'TimePeriod': loadStat.toCamelCase(true),
								'Process': process.pid
							}
						});
					});
				}
				else if (metric === 'server') {
					pluginOpts.nurse_server_stats.forEach(function(serverStat){
						metrics.push({
							'name': metric.toCamelCase(true),
							'value': res.body[metric][serverStat],
							'timestamp': timestamp,
							'unit': 'Count',
							'dimensions': {
								'Hostname': res.body.hostname,
								'ServerStat': serverStat.toCamelCase(true),
								'Process': process.pid
							}
						});
					});
				}
				else {
					metrics.push({
						'name': metric.toCamelCase(true),
						'value': res.body[metric],
						'timestamp': timestamp,
						'unit': 'Count',
						'dimensions': {
							'Hostname': res.body.hostname,
							'Process': process.pid
						}
					});
				}
			});
			d.resolve(metrics);
		});
	return d.promise;
};


