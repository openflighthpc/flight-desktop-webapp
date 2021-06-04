// Based on code from
// https://github.com/Daruse93/react-noVNC/blob/master/lib/noVNC.js licensed
// under the MIT license.
//
// Copyright 2018 Larry Price

// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the "Software"),
// to deal in the Software without restriction, including without limitation
// the rights to use, copy, modify, merge, publish, distribute, sublicense,
// and/or sell copies of the Software, and to permit persons to whom the
// Software is furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
// DEALINGS IN THE SOFTWARE.

import React from 'react'
import PropTypes from 'prop-types'
import RFB from 'novnc-core'

import styles from './NoVNC.module.css';

const createConnection = ({
  connectionName,
  domEl,
  onClipboard,
  onDisconnect,
  onConnect,
  onPasswordPrompt,
  password,
  viewOnly,
}) => {
  let rfb = null;
  try {
    console.log('connecting to', connectionName);
    rfb = new RFB(
      domEl,
      connectionName,
      password && {credentials: {password}}
    );
    rfb.addEventListener('connect', onConnect);
    rfb.addEventListener('disconnect', onDisconnect);
    rfb.addEventListener('credentialsrequired', onPasswordPrompt);
    rfb.addEventListener('clipboard', onClipboard);
    rfb.scaleViewport = true;
    rfb.resizeSession = false;
    rfb.viewOnly = viewOnly;
  } catch (err) {
    console.error(`Unable to create RFB client: ${err}`)
    return onDisconnect({detail: {clean: false}})
  }

  return rfb
};

export default class VncContainer extends React.Component {
  static propTypes = {
    connectionName: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    onBeforeConnect: PropTypes.func,
  };

  state = {
    status: 'connecting',
    connectionName: this.props.connectionName,
  };

  constructor(props) {
    super(props);
    this.noVNCCanvas = React.createRef();
  }

  componentDidMount() {
    this.createConnection();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.viewOnly !== prevProps.viewOnly) {
      this.rfb.viewOnly = this.props.viewOnly;
    }
  }

  onStatusChange = () => {
    this.rfb.focus();
    this.setState(() => ({status: 'connected'}));
    this.props.onBeforeConnect();
  };

  onClipboard = async (ev) => {
    if (ev && ev.detail && ev.detail.text) {
      try {
        await navigator.clipboard.write([
          // eslint-disable-next-line no-undef
          new ClipboardItem({
            'text/plain': new Blob([ev.detail.text], { type: 'text/plain' }),
          })
        ]);
      } catch (err) {
        console.log('err:', err);  // eslint-disable-line no-console
        let div = document.getElementById("copy-fallback-div")
        let input = document.createElement("textarea");
        try {
          // Firefox does not support the ClipboardItem API at the time or writing.
          // It should *hopefully* support it in the future, so it is still attempted.
          // Until then, a fallback on a text area is used.
          div.appendChild(input);
          input.value = ev.detail.text;

          // The textarea must be visible in order to copy from it
          input.style.display = "block";
          input.select();

          if (document.execCommand('copy')) {
            console.log("Copy succeeded!");
          } else {
            console.log("Copy failed!");
          }
        } catch(fallback_err) {
          console.log('err:', fallback_err);  // eslint-disable-line no-console
        }
        input.remove();
      }
    }
  }

  onDisconnect = (e) => {
    this.props.onDisconnected(
      !e.detail.clean || this.state.status !== 'connected'
    )
    this.setState(() => ({status: 'disconnected'}));
  }

  onUserDisconnect = () => this.rfb.disconnect();

  onPasswordRequired = () => {
    // XXX Something has gone all kinds of wrong here.  We should have
    // configured with the password in the first instance.
    this.rfb.sendCredentials({password: this.props.password})
  }

  onReconnect() {
    this.createConnection();
  }

  createConnection() {
    console.log('creating RFB connection');
    if (this.rfb != null && this.state.status !== 'disconnected') {
      this.rfb.disconnect();
      this.rfb = null;
    }
    this.rfb = createConnection({
      connectionName: this.props.connectionName,
      domEl: this.noVNCCanvas.current,
      onClipboard: this.onClipboard,
      onDisconnect: this.onDisconnect,
      onConnect: this.onStatusChange,
      onPasswordPrompt: this.onPasswordRequired,
      password: this.props.password,
      viewOnly: this.props.viewOnly
    });
  }

  resize() {
    if (this.rfb != null && typeof this.rfb._windowResize === 'function') {
      this.rfb._windowResize();
    }
  }

  setClipboardText(text) {
    if (this.rfb != null) {
      this.rfb.clipboardPasteFrom(text);
    }
  }

  render() {
    return (
      <div
        ref={this.noVNCCanvas}
        className={`${styles.NoVNCWrapper} fullscreen-content`}
      />
    )
  }
}
