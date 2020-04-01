// Share session storage between tabs.
//
// This function should be called when a new tab opens.  It "broadcasts" a
// message to all other tabs sharing the same localStorage.  Other tabs
// respond by "broadcasting" the session storage to all other tabs (including
// the requesting tab) sharing the same localStorage.
//
function shareSessionStorage() {
  if (typeof window === 'undefined') { return; }

  if (!sessionStorage.length) {
    localStorage.setItem('requestSessionStorage', Date.now());
  };

  window.addEventListener('storage', function(event) {
    if (event.key === 'requestSessionStorage') {
      localStorage.setItem('sendSessionStorage', JSON.stringify(sessionStorage));
      localStorage.removeItem('sendSessionStorage');

    } else if (event.key === 'sendSessionStorage' && !sessionStorage.length) {
      const data = JSON.parse(event.newValue);

      for (const key in data) {
        sessionStorage.setItem(key, data[key]);
      }
    }
  });
}

export default shareSessionStorage;
