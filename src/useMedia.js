import { useEffect, useState } from 'react';

function useMedia(queries, values, defaultValue) {
  const mediaQueryLists = queries.map(q => window.matchMedia(q));

  const getValue = () => {
    const index = mediaQueryLists.findIndex(mql => mql.matches);
    return typeof values[index] !== 'undefined' ? values[index] : defaultValue;
  };

  const [value, setValue] = useState(getValue);

  useEffect(
    () => {
      const handler = () => setValue(getValue);
      mediaQueryLists.forEach(mql => mql.addListener(handler));
      return () => mediaQueryLists.forEach(mql => mql.removeListener(handler));
    },
    // Only run on mount and unmount.  The event listener added above will
    // keep the returned value updated.
    //
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return value;
}

export default useMedia;
