import React from 'react';

import DesktopCard from './DesktopCard';

const desktops = [
  {
    type: "chrome",
    name: "Google Chrome browser session",
    description: "Full-screen Google Chrome browser session.\n\nhttps://www.google.com/chrome/",
  },
  {
    type: "gnome",
    name: "GNOME v3",
    description: "GNOME v3, a free and open-source desktop environment for Unix-like operating systems.\n\nhttps://www.gnome.org/",
  },
  {
    type: "terminal",
    name: "Terminal",
    description: "Preconfigured terminal for Flight HPC environments.",
  },
  {
    type: "kde",
    name: "KDE Plasma Desktop",
    description: "KDE Plasma Desktop (KDE 4). Plasma is KDE's desktop environment. Simple by default, powerful when needed.\n\nhttps://kde.org/",
  },

  {
    type: "xfce",
    name: "Xfce desktop",
    description: "Xfce is a lightweight desktop environment for UNIX-like operating systems. It aims to be fast and low on system resources, while still being visually appealing and user friendly.\n\nhttps://xfce.org/",
  },
  {
    type: "xterm",
    name: "xterm",
    description: "Minimal desktop environment with an xterm terminal window.\n\nhttps://invisible-island.net/xterm/xterm.html",
  },
];


function NewSessionPage() {
  const cards = desktops.map(
    (desktop) => <DesktopCard key={desktop.type} desktop={desktop} />
  );
  return (
    <div>
    <div className="jumbotron bg-white py-4">
      <h1>
        Launch a new desktop session
      </h1>
      <p>
        To launch a new desktop session
      </p>
      <ul>
        <li>Select the desktop session type from the list below.</li>
        <li>Click "Launch".</li>
        <li>When your session is ready you will be automatically connected to it.</li>
        <li>Start working!</li>
      </ul>
    </div>
      <div className="row">
        {cards}
      </div>
    </div>
  );
}

export default NewSessionPage;
