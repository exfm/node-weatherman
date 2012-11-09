# node-weatherman

CloudWatch metrics client.  Generates metrics and submits them as custom metrics to CloudWatch.

## Install

     npm install weatherman

## Running

Include weatherman, assign a config object to it and pass an interval in seconds to weatherman.start().

	var wm = require('weatherman');

	wm.config({
		namespace: "SW/ServiceName",
		plugins: {
	    	plugin_name: {
	    		config_key: "config_value"
	    	}
		}
	});

	wm.start(60);

## Stopping

	wm.stop();


## Configuration

If a namespace is not defined in the plugin-specific configuration, the globally-defined namespace is used.

### system

Load, free memory and uptime stats

* No configuration

### rabbit

Rabbit queue statistics - metadata, phantom and celery.

* rabbit_url: the Rabbit queue API URL to connect to
* rabbit_auth: username and password for Rabbit access in a list

### listening

Current exfm listening statistics.

* listening_url: listening URL to grab stats from

### nurse

[Nurse](https://github.com/exfm/node-nurse) integration - system info and server statistics.

* nurse_url: URL to grab info from, usually localhost:port/health-check
* nurse_stats: list of statistics to grab, see nurse docs
* nurse\_mem\_stats: list of memory statistics to grab, see nurse docs
* nurse\_load\_stats: list of load statistics to grab, see nurse docs
* nurse\_server\_stats: list of server statistics to grab, see nurse docs

