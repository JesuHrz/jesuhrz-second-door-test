import Modal from 'react-modal'

const customStyles = {
  overlay: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(55, 55, 55, 0.329)'
  },
  content: {
    inset: '-25% 0',
    position: 'relative',
    maxWidth: 700,
    width: '100%',
    border: '1px solid #e7e7e9',
  }
}

Modal.setAppElement('#modal-root');

export default function ModalContent ({ children, isOpen, onRequestClose, afterOpenModal }) {
  return (
    <Modal
      isOpen={isOpen}
      onAfterOpen={afterOpenModal}
      onRequestClose={onRequestClose}
      style={customStyles}
    >
      {children}
    </Modal>
  )
}