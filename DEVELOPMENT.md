# Development setup

This documents explains howto setup and configure Flight Desktop Webapp for
development.  For more details on contributing to the project see
[CONTRIBUTING.md](CONTRIBUTING.md).

## Quick start

The easiest way to get started developing Flight Desktop Webapp is to use
[OpenFlight Vagrant
Cluster](https://github.com/openflighthpc/openflight-vagrant-cluster).  The
OpenFlight Vagrant Cluster repository contains details of how to install,
configure and build an OpenFlightHPC cluster using Vagrant.

Once OpenFlight Vagrant Cluster is running, you can develop Flight Destkop on
your host machine and run it on OpenFlight Vagrant Cluster.  To start it:

```
cd /code/flight-desktop-webapp
yarn run start
```

This will start Flight Desktop Webapp on port `3001` on `chead1`.  You can
access it from your host at `https://flight.lvh.me:8443/dev/desktop`.  This
proxies the request via Flight WWW.

You can make changes to Flight Desktop Webapp on your host and those changes
will be automatically picked up and compiled by Flight Desktop Webapp running
on `chead1`.

## Configuring which APIs to use

TODO: complete this

* The webapp can be configured to use either the development versions to the
  APIs or to use the versions installed as part of `flight-web-suite`.
* How to do so differs whether proxying via Flight WWW or accessing directly.

When proxying via Flight WWW

* Edit [.env.development](.env.development).
* Comment and uncomment the appropriate `REACT_APP_*_BASE_URL` variables.
* The `REACT_APP_CONFIG_FILE` variable must match the `REACT_APP_API_BASE_URL`
  setting.  Either both development or both production.

When accessing directly

* Edit the `REACT_APP_PROXY_*` variables.
* By default, they are set to use the development APIs.
* The `REACT_APP_PROXY_*_URL`s are resolved from `chead1`.

## Accessing without proxying via Flight WWW

TODO: complete this

* See [OpenFlight Vagrant
  Cluster](https://github.com/openflighthpc/openflight-vagrant-cluster) for
  details on how to expose the development ports.
* Edit [.env.development](.env.development) and uncomment the
  `REACT_APP_PROXY_*` settings.
* Restart Flight Desktop Webapp `cd /code/flight-desktop-webapp; yarn run
  start`.

## Developing without using OpenFlight Vagrant Cluster

TODO complete

* Checkout the source code.
* Install dependencies: `yarn`.
* Checkout and start any dependent services. E.g., `flight-desktop-restapi`
  and `flight-login-api`.
* Edit [.env.development](.env.development); uncomment the `REACT_APP_PROXY_*`
  settings; set to the appropriate values for your setup.
* Start the development server: `yarn run start`.
* Access it at http://localhost:3001

Follow the
instructions there and then continue with the instructions here.
