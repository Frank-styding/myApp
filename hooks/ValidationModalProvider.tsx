import { createContext, ReactNode, useContext, useRef, useState } from "react";

const context = createContext({
  message: "",
  showModal: (data: string, callback: () => void) => {},
  visible: false,
  hideModal: () => {},
});

export const ValidationModalProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);
  const callbackRef = useRef<() => void>(null);

  const showModal = (message: string, callback: () => void) => {
    setVisible(true);
    setMessage(message);
    callbackRef.current = callback;
  };
  const hideModal = () => {
    callbackRef.current?.();
    setVisible(false);
  };

  return (
    <context.Provider value={{ message, visible, showModal, hideModal }}>
      {children}
    </context.Provider>
  );
};

export const useValidationModal = () => useContext(context);
