import { createContext, ReactNode, useContext, useState } from "react";

const context = createContext({
  message: "",
  title: "",
  showModal: ({ message, title }: { message: string; title: string }) => {},
  visible: false,
  hideModal: () => {},
});

export const ReturnModalProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState({ title: "", message: "" });

  const [visible, setVisible] = useState(false);

  const showModal = ({
    message,
    title,
  }: {
    message: string;
    title: string;
  }) => {
    setVisible(true);
    setData({ message, title });
  };
  const hideModal = () => {
    setVisible(false);
  };

  return (
    <context.Provider
      value={{
        message: data.message,
        title: data.title,
        visible,
        showModal,
        hideModal,
      }}
    >
      {children}
    </context.Provider>
  );
};

export const useReturnModal = () => useContext(context);
