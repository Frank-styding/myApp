import { createContext, ReactNode, useContext, useRef, useState } from "react";

const context = createContext({
  showModal: () => {},
  visible: false,
  hideModal: () => {},
});

export const ChangeModalProvider = ({ children }: { children: ReactNode }) => {
  const [visible, setVisible] = useState(false);
  const callbackRef = useRef<() => void>(null);

  const showModal = () => {
    setVisible(true);
  };
  const hideModal = () => {
    callbackRef.current?.();
    setVisible(false);
  };

  return (
    <context.Provider value={{ visible, showModal, hideModal }}>
      {children}
    </context.Provider>
  );
};

export const useChangeModal = () => useContext(context);
