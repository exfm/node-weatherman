"use strict";

var sequence = require('sequence'),
	when = require('when'),
	fs = require('fs'),
	os = require('os'),
	nconf = require('nconf'),
	getConfig = require('junto'),
	aws = require('plata');

var availablePlugins = {},
	juntoConfig,
	timer,
	config;

fs.readdirSync(__dirname + '/plugins').forEach(function(pluginFilename){
	availablePlugins[pluginFilename.split('.')[0]] = require(__dirname + '/plugins/' + pluginFilename);
});

getConfig('development').then(function(c){
	juntoConfig = c;
	aws.connect(juntoConfig.aws);
});

module.exports.config = function(c){
	config = c;
};

module.exports.start = function(ivl){
	console.log('starting weatherman...');
	generateMetrics();
	timer = setInterval(function(){
		generateMetrics();
	}, ivl*1000);
};

module.exports.stop = function(){
	console.log('stopping weatherman...');
	clearInterval(timer);
};

function generateMetrics(){
	var allMetrics = {},
		timestamp = new Date().toISOString(),
		pluginOpts;

	when.all(Object.keys(config.plugins).map(function(plugin){
		var p = when.defer();
		pluginOpts = config.plugins[plugin];
		availablePlugins[plugin].addMetrics(timestamp, pluginOpts).then(function(data){
			if (pluginOpts !== undefined && pluginOpts.namespace !== undefined) {
				allMetrics[pluginOpts.namespace] = data;
				return p.resolve();
			}
			else {
				allMetrics[config.namespace] = data;
				return p.resolve();
			}
		});
		return p.promise;
	})).then(function(){
		sendMetricsToCloudWatch(allMetrics).then(function(resp){
			console.log('done');
		});
	});
}

function sendMetricsToCloudWatch(metrics){
	var d = when.defer();
	sequence().then(function(next){
		aws.onConnected(next);
	}).then(function(next){
		when.all(Object.keys(metrics).map(function(namespace){
			var p = when.defer();
			aws.cloudWatch.putMetricData(namespace, metrics[namespace]).then(function(){
				return p.resolve();
			});
			// console.log('ns:' + config.namespace);
			// console.log(metrics[namespace]);
			// p.resolve();
			return p.promise;
		})).then(function(){
			next();
		});
	}).then(function(next){
		d.resolve();
	});
	return d.promise;
}