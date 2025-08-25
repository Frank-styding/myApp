import { createContext, ReactNode, useContext, useState } from "react";

const context = createContext({
  message: "",
  showModal: (message: string) => {},
  visible: false,
  hideModal: () => {},
});

export const ErrorModalProvider = ({ children }: { children: ReactNode }) => {
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);

  const showModal = (message: string) => {
    setVisible(true);
    setMessage(message);
  };
  const hideModal = () => {
    setVisible(false);
  };

  return (
    <context.Provider value={{ message, visible, showModal, hideModal }}>
      {children}
    </context.Provider>
  );
};

export const useErrorModal = () => useContext(context);
