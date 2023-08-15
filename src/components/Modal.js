import React from 'react';
import styled from 'styled-components';
import { useModalContext } from '../context/modal_context';
const Modal = ({ children }) => {
  const { isModalOpen } = useModalContext();
  return (
    <Wrapper
      className={`${
        isModalOpen ? 'modal-overlay show-modal' : 'modal-overlay '
      }`}
    >
      <div
        className={
          isModalOpen ? 'modal-container' : 'modal-container hideContainer'
        }
      >
        {children}
      </div>
    </Wrapper>
  );
};
const Wrapper = styled.div`
  .modal-container {
    border-top: 8px solid var(--clr-primary-5);
  }
  .hideContainer {
    display: none;
  }
`;
export default Modal;
