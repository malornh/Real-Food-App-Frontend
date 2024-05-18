import React from 'react';
import { Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalBody, Image } from '@chakra-ui/react';
import './ImageDialog.css';

interface ImageDialogProps {
  img: string | null;
  onClose: () => void;
}

const ImageDialog: React.FC<ImageDialogProps> = ({ img, onClose }) => {
  if (!img) return null;
  return (
    <Modal isOpen={!!img} onClose={onClose} isCentered size="xl">
      <ModalOverlay />
      <ModalContent className="img-dialog-content">
        <ModalCloseButton sx={{ marginBottom: '5px' }} />
        <ModalBody>
          <Image src={img} alt="Cropped" className="img-dialog-image" />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ImageDialog;
