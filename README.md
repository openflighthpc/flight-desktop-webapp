# Flight Desktop Webapp

Web app to provide access to graphical user interface desktops via the
`flight-desktop` tool.

## Overview

Flight Desktop Webapp is a web application that in conjunction with [Flight
Desktop Rest API](https://github.com/openflighthpc/flight-desktop-restapi) and
[Flight Desktop](https://github.com/openflighthpc/flight-desktop) provides
browser access to interactive GUI desktop sessions within HPC environments.
User's can sign in and then launch, manage and connect to desktop sessions.

## Installation

### From source

Flight Desktop Webapp requires a recent version of Node and `yarn`.

The following will install from source using `git`:

```
git clone https://github.com/alces-flight/flight-desktop-webapp.git
cd flight-desktop-webapp
yarn install
yarn run build
```

Flight Desktop Webapp has been built into `build/`.  It can be served by any
webserver configured to serve static files from that directory.  By default,
Flight Desktop Webapp expects to be served from a path of `/desktop`.  If that
does not suit your needs, see the configuration section below for details on
how to configure it.

### Installing with Flight Runway

Flight Runway provides a Ruby environment and command-line helpers for
running openflightHPC tools.  Flight Desktop Webapp integrates with Flight
Runway to provide easier installation and configuration.

To install Flight Runway, see the [Flight Runway installation
docs](https://github.com/openflighthpc/flight-runway#installation).

The installation of Flight Desktop Webapp and the Flight Web Suite is
documented in [the OpenFlight
Documentation](https://use.openflighthpc.org/installing-web-suite/install.html#installing-flight-web-suite).

## Configuration

The default configuration for Flight Desktop Webapp will work out-of the box
for most cluster setups.  If you have an unusual cluster setup, you can
configure Flight Desktop Webapp by editing the file `build/config.json` and
changing the following:

**apiRootUrl**: Set this to the root URL for the Flight Desktop Rest API for
the cluster that is being managed.

**websocketPathPrefix**: Set this to the path prefix that is proxied to
websocket connections.

**websocketPathIp**: The IP that the websocket proxy uses to connect to the
websockify process.  If unset, the IP address reported by the session will be
used.

If the websocket proxy and the websockify process are running on the same
machine, you probably want to set this to "127.0.0.1".  If they are not,
you probably want to not have this set.

Additionally, when installing from source, you may also
configure the path at which the built application is to be mounted.

**Mount point**

By default, the built web application expects to be mounted at the path
`/desktop`.  This setting can be changed by editing three settings across two
files.

First, edit the file `.env` and change the settings for `REACT_APP_MOUNT_PATH`
and `REACT_APP_CONFIG_FILE` to contain the desired mount path.

Second, edit the file `package.json` and change the setting in `homepage` to
contain the desired mount path.

## Operation

Open your browser and visit the URL for your cluster with path `/desktop`.
E.g., if you have installed on a machine called `my.cluster.com` visit the URL
https://my.cluster.com/desktop.

Enter your username and password for the cluster.  You can then create new
sessions, list your current sessions and connect to your current sessions by
following the appropriate links.


# Contributing

Fork the project. Make your feature addition or bug fix. Send a pull
request. Bonus points for topic branches.

Read [CONTRIBUTING.md](CONTRIBUTING.md) and [DEVELOPMENT.md](DEVELOPMENT.md)
for more details.

# Copyright and License

Eclipse Public License 2.0, see [LICENSE.txt](LICENSE.txt) for details.

Copyright (C) 2019-present Alces Flight Ltd.

This program and the accompanying materials are made available under
the terms of the Eclipse Public License 2.0 which is available at
[https://www.eclipse.org/legal/epl-2.0](https://www.eclipse.org/legal/epl-2.0),
or alternative license terms made available by Alces Flight Ltd -
please direct inquiries about licensing to
[licensing@alces-flight.com](mailto:licensing@alces-flight.com).

Flight Desktop Webapp is distributed in the hope that it will be
useful, but WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, EITHER
EXPRESS OR IMPLIED INCLUDING, WITHOUT LIMITATION, ANY WARRANTIES OR
CONDITIONS OF TITLE, NON-INFRINGEMENT, MERCHANTABILITY OR FITNESS FOR
A PARTICULAR PURPOSE. See the [Eclipse Public License 2.0](https://opensource.org/licenses/EPL-2.0) for more
details.
