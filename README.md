# Flight Desktop Client

Web app to provide access to graphical user interface desktops via the
`flight-desktop` tool.

## Overview

Flight Desktop Client is a web application that in conjunction with [Flight
Desktop Server](https://github.com/openflighthpc/flight-desktop-server)
provides access to VNC desktop sessions provided by Flight Desktop over
websockets.  User's can sign in and launch, manage and connect to desktop
sessions.

## Installation

Install node version 12.16.  The following instructions assume `nvm` is being
used to manage the node version.

```
git clone git@github.com:openflighthpc/flight-desktop-client.git
cd flight-desktop-client
nvm use
yarn install
```

Flight Desktop Client is now installed.  Next it needs to be configured.

## Configuration

To configure, edit `.env` and set the variables `REACT_APP_CLUSTER_NAME`,
`REACT_APP_API_ROOT_URL` and `REACT_APP_WEBSOCKET_PATH_PREFIX`.  They must all
be set.


## Operation

To use Flight Desktop Client, it must be built.

```
yarn run build
```

The static files required to server Flight Desktop Client are saved to
`build/`.  They can be served from that directory by any HTTP file server,
e.g.,

```
cd build
python -m SimpleHTTPServer 8080
```


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

Flight Desktop Client is distributed in the hope that it will be
useful, but WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, EITHER
EXPRESS OR IMPLIED INCLUDING, WITHOUT LIMITATION, ANY WARRANTIES OR
CONDITIONS OF TITLE, NON-INFRINGEMENT, MERCHANTABILITY OR FITNESS FOR
A PARTICULAR PURPOSE. See the [Eclipse Public License 2.0](https://opensource.org/licenses/EPL-2.0) for more
details.
