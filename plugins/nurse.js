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
							'name': metric.toCamelCase(true) + memStat.toCamelCase(true),
							'value': res.body[metric][memStat],
							'unit': 'Bytes',
							'timestamp': timestamp,
							'dimensions': {
								'MemStat': memStat
							}
						});
					});
				}
				else if (metric === 'load') {
					pluginOpts.nurse_load_stats.forEach(function(loadStat){
						metrics.push({
							'name': metric.toCamelCase(true) + loadStat.toCamelCase(true),
							'value': res.body[metric][loadStat],
							'unit': 'Percent',
							'timestamp': timestamp,
							'dimensions': {
								'TimePeriod': loadStat
							}
						});
					});
				}
				else if (metric === 'server') {
					pluginOpts.nurse_server_stats.forEach(function(serverStat){
						metrics.push({
							'name': metric.toCamelCase(true) + serverStat.toCamelCase(true),
							'value': res.body[metric][serverStat],
							'timestamp': timestamp,
							'dimensions': {
								'ServerStat': serverStat
							}
						});
					});
				}
				else {
					metrics.push({
						'name': metric.toCamelCase(true),
						'value': res.body[metric],
						'timestamp': timestamp,
						'dimensions': {}
					});
				}
			});
			d.resolve(metrics);
		});
	return d.promise;
};


