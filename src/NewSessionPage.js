import React from 'react';

import DesktopCard from './DesktopCard';
// import ErrorBoundary from './ErrorBoundary';
// import NoVNC from './NoVNC';
// import Spinner from './Spinner';
// import { DefaultErrorMessage } from './ErrorBoundary';
// import { useFetchSession } from './api';


const desktops = [
  {
    type: "chrome",
    name: "Google Chrome browser session",
    description: "Full-screen Google Chrome browser session.\n\nhttps://www.google.com/chrome/",
    icon: 'chrome',
  },
  {
    type: "gnome",
    name: "GNOME v3",
    description: "GNOME v3, a free and open-source desktop environment for Unix-like operating systems.\n\nhttps://www.gnome.org/",
    icon: null,
  },
  {
    type: "terminal",
    name: "Terminal",
    description: "Preconfigured terminal for Flight HPC environments.",
    icon: null,
  },

  // kde: "KDE Plasma Desktop",
  // xfce: "Xfce desktop",
  // xterm: "xterm",
];


function NewSessionPage() {
  const cards = desktops.map(
    (desktop) => <DesktopCard key={desktop.type} desktop={desktop} />
  );
  return (
    <div>
      <p>
        To launch a new desktop session
      </p>
      <ul>
        <li>Select the desktop session type from the list below.</li>
        <li>Click "Launch".</li>
        <li>Start working!</li>
      </ul>
      <div className="row">
        {cards}
      </div>
    </div>
  );
}

export default NewSessionPage;
