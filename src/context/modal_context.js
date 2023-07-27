import React, { useContext, useState } from "react";
import { Modal, Register } from "../components";

const ModalContext = React.createContext();
export const ModalProvider = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loginWithRedirect = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <ModalContext.Provider
      value={{ isModalOpen, loginWithRedirect, closeModal }}
    >
      {children}
      <Modal>
        <Register />
      </Modal>
    </ModalContext.Provider>
  );
};

// make sure use
export const useModalContext = () => {
  return useContext(ModalContext);
};
