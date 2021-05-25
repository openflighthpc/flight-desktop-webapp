# Development setup

This documents explains howto setup and configure Flight Desktop Webapp for
development.  For more details on contributing to the project see
[CONTRIBUTING.md](CONTRIBUTING.md).

## Openflight Vagrant Cluster

Flight Desktop Webapp is designed to be developed on an [OpenFlight Vagrant
Cluster](https://github.com/openflighthpc/openflight-vagrant-cluster).  The
OpenFlight Vagrant Cluster repository contains details of how to install,
configure and build an OpenFlightHPC cluster using Vagrant.  Follow the
instructions there and then continue with the instructions here.

## Configuring which services Flight Desktop Webapp uses

By default, Flight Desktop Webapp is configured to use the production services
installed on your OpenFlight Vagrant cluster.  You can configure the services
it uses by editing the file [.env.development](.env.development) and
restarting the service.  That file is well documented.

## Starting Flight Desktop Webapp

You can start the development version of Flight Desktop Webapp by running the
following on `chead1` of your OpenFlight Vagrant cluster.

```
cd /code/flight-desktop-webapp
/opt/flight/bin/yarn run start 
```

## Accessing the development build

Once your OpenFlight Vagrant cluster is created, the development build of
Flight Desktop Webapp will be available at
https://flight.lvh.me:8443/dev/desktop.
