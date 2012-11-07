# node-weatherman

CloudWatch metrics client.  Generates metrics and submits them as custom metrics to CloudWatch.

## Install

     npm install node-weatherman

## Running

    git clone
    npm install
    ./weatherman

## Configuration

Configuration is done via nconf.  Copy config.json.example to config.json and edit.  Add plugins to the 'active_plugins' field to enable them.

### Plugins

* system: load, free memory and uptime stats
* rabbit: Rabbit queue statistics - metadata, phantom and celery
* listening: current number of listeners on exfm
* nurse: node-nurse integration, system info and server statistics


