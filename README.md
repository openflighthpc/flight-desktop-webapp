# Flight Desktop Webapp

Web app to provide access to graphical user interface desktops via the
`flight-desktop` tool.

## Overview

Flight Desktop Webapp is a web application that in conjunction with [Flight
Desktop Rest API](https://github.com/openflighthpc/flight-desktop-restapi) and
[Flight Desktop](https://github.com/openflighthpc/flight-desktop) provides
browser access to interactive GUI desktop sessions within HPC environments.
User's can sign in and launch, manage and connect to desktop sessions.

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

Before Flight Desktop Webapp is ready for use some additional configuration to
inform Flight Desktop Webapp about the cluster is required.

This is done by editing the file `build/config.json`.  You will need to
provide values for the following:

**clusterName**: Set it to a string that identifies this cluster in a human
friendly way.

**clusterDescription**: Set this to a human-friendly description of the
cluster that we are connecting to.  This could be used to describe its purpose
or the features that it supports.

**clusterLogo**: Optionally, set it to the URL for a logo for this cluster.
Or leave it unset.

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

### Installing with Flight Runway

Flight Runway provides a Ruby environment and command-line helpers for
running openflightHPC tools.  Flight Desktop Webapp integrates with Flight
Runway to provide easier installation and configuration.

To install Flight Runway, see the [Flight Runway installation
docs](https://github.com/openflighthpc/flight-runway#installation).

These instructions assume that `flight-runway` has been installed from
the openflightHPC yum repository and that either [system-wide
integration](https://github.com/openflighthpc/flight-runway#system-wide-integration) has been enabled or the
[`flight-starter`](https://github.com/openflighthpc/flight-starter) tool has been
installed and the environment activated with the `flight start` command.

 * Enable the Alces Flight RPM repository:

    ```
    yum install -e0 https://repo.openflighthpc.org/openflight/centos/7/x86_64/openflighthpc-release-2-1.noarch.rpm
    ```

 * Rebuild your `yum` cache:

    ```
    yum makecache
    ```
    
 * Install the `flight-desktop-webapp` RPM:

    ```
    [root@myhost ~]# yum install flight-desktop-webapp
    ```

 * Enable HTTPs support

    Flight Desktop Webapp is designed to operate over HTTPs connections.  You
    can enable HTTPs with self-signed certificates by running the commands
    below.  You will be asked to enter a passphrase and to answer some
    questions about your organization.

    ```
    [root@myhost ~]# flight www enable-https
    ```

 * Configure details about your cluster

    Flight Desktop Webapp needs to be configured with some details about the
    cluster it is providing access to.  This can be done with the `flight
    service configure` command as described below.  You will be asked to
    provide values for:

    **Cluster name**: set it to a string that identifies this cluster in a
    human friendly way.

    **Cluster description**: set it to a string that describes this cluster in
    a human friendly way.

    **Cluster logo URL**: Optionally, set it to the URL for a logo for this
    cluster.  Or leave it unset.

    **Hostname or IP address**: set this to either the fully qualified
    hostname for your server or its IP address.  If using the hostname, make
    sure that it can be resolved correctly.

    Once you have values for the above, you can configure the webapp by running:

    ```
    [root@myhost ~]# flight service configure desktop-webapp
    ```


## Configuration

The installation section details the configuration that is required for Flight
Desktop Webapp.  Additionally, when installing from source, you may also
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

XXX TBC

# Contributing

Fork the project. Make your feature addition or bug fix. Send a pull
request. Bonus points for topic branches.

Read [CONTRIBUTING.md](CONTRIBUTING.md) for more details.

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
