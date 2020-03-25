import React, { useContext, useMemo, useState } from 'react';
import { v1 as uuidv1 } from 'uuid';

import Portal from './Portal';

const Context = React.createContext({});

function Provider({ children }) {
  const [toasts, setToasts] = useState([]);
  const actions = useMemo(
    () => ({
      addToast(content) {
        const id =  uuidv1();
        const newToast = { content, id };
        setToasts((toasts) => [ ...toasts, newToast ]);
        return {
          id,
          removeToast() { actions.removeToast(id) },
        };
      },

      removeToast(id) {
        setToasts((toasts) => {
          const idx = toasts.findIndex(t => t.id === id);
          if (idx > -1) {
            const before = toasts.slice(0, idx);
            const after = toasts.slice(idx + 1, toasts.length);
            return [ ...before, ...after ];
          }
        });
      }
    }),
    [ setToasts ],
  );

  return (
    <Context.Provider value={{ toasts, ...actions }}>
      {children}
    </Context.Provider>
  );
}

function useToast() {
  return useContext(Context);
}

function Container() {
  const { toasts } = useToast();

  return (
    <Portal id="toast-portal">
      { toasts.map(t => React.cloneElement(t.content, {key: t.id})) }
    </Portal>
  );
}

export {
  Container,
  Context,
  Provider,
  useToast,
}
